import { NextResponse } from "next/server";
import { Resend } from "resend";
import disposableDomainsList from "disposable-email-domains";

// Env: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL (see .env.example)
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "vincentdo306@gmail.com";

const MAX_BODY_BYTES = 16 * 1024;
const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;
/**
 * The trap field is deliberately NOT called "company".
 *
 * It was, and that is a real false-success bug: browsers and password
 * managers autofill organization fields, and `company` is one of the names
 * they recognise. A recruiter whose browser filled it in would see "Message
 * sent" while the message was silently dropped. `ref_id` is meaningless to
 * autofill heuristics, so only a script that fills every input will trip it.
 */
const TRAP_FIELD = "ref_id";

const ALLOWED_FIELDS = new Set(["name", "email", "message", TRAP_FIELD]);
const SEND_TIMEOUT_MS = 10_000;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlInTextRegex = /(https?:\/\/|www\.)/i;
// CR, LF, null bytes, and other C0/C1 control characters
const controlCharRegex = /[\u0000-\u001F\u007F-\u009F]/;

const MX_CACHE_MAX_ENTRIES = 256;
const mxCache = new Map<string, { value: boolean; expiresAt: number }>();
const mxCacheTtlMs = 1000 * 60 * 60;

const disposableDomains = new Set<string>(
  disposableDomainsList.map((d) => d.toLowerCase()),
);

const baseHeaders = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
  "X-Content-Type-Options": "nosniff",
};

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: baseHeaders });
}

export function GET() {
  return new NextResponse(null, {
    status: 405,
    headers: { ...baseHeaders, Allow: "POST" },
  });
}

function newCorrelationId() {
  return crypto.randomUUID().slice(0, 8);
}

async function readBodyWithLimit(
  req: Request,
  limit: number,
): Promise<string | null> {
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > limit) return null;

  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  // Non-browser clients may omit Origin; only enforce when present.
  if (!origin) return true;
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function domainHasMx(domain: string): Promise<boolean> {
  const cached = mxCache.get(domain);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: { Accept: "application/dns-json" },
        signal: AbortSignal.timeout(1500),
      },
    );
    if (!res.ok) return true;
    const data = (await res.json()) as { Answer?: unknown[] };
    const value = Array.isArray(data.Answer) && data.Answer.length > 0;
    if (mxCache.size >= MX_CACHE_MAX_ENTRIES) {
      const oldest = mxCache.keys().next().value;
      if (oldest !== undefined) mxCache.delete(oldest);
    }
    mxCache.set(domain, { value, expiresAt: Date.now() + mxCacheTtlMs });
    return value;
  } catch {
    return true;
  }
}

/**
 * Per-IP request budget, held in the isolate.
 *
 * Be clear about what this is and is not. Workers isolates are per-colo and
 * short-lived, so this bounds a naive flood hitting one isolate and nothing
 * more — a distributed script routed through several colos will get a fresh
 * budget in each. It exists so the provider quota is not trivially drained by
 * a single looping client, which would make legitimate recruiter mail fail.
 *
 * The real control is a Cloudflare rate-limiting rule (or Turnstile) in front
 * of /api/contact. That is dashboard configuration, not code, and it is still
 * outstanding — see V3_IMPLEMENTATION_NOTES.md.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_WINDOW = 5;
const RATE_CACHE_MAX_ENTRIES = 2048;
const rateBuckets = new Map<string, number[]>();

function clientKey(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** True when this client is over budget. */
function isRateLimited(req: Request): boolean {
  const key = clientKey(req);
  const now = Date.now();

  // bounded: drop the oldest key rather than let the map grow without limit
  if (rateBuckets.size >= RATE_CACHE_MAX_ENTRIES) {
    const oldest = rateBuckets.keys().next().value;
    if (oldest !== undefined) rateBuckets.delete(oldest);
  }

  const hits = (rateBuckets.get(key) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (hits.length >= RATE_MAX_PER_WINDOW) {
    rateBuckets.set(key, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(key, hits);
  return false;
}

export async function POST(req: Request) {
  const correlationId = newCorrelationId();

  if (isRateLimited(req)) {
    return json(
      {
        error: `Too many messages from this address. Please try again shortly, or email ${TO_EMAIL} directly.`,
        correlationId,
      },
      429,
    );
  }

  if (!isSameOrigin(req)) {
    return json({ error: "Request rejected.", correlationId }, 403);
  }

  const mediaType =
    req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ?? "";
  if (mediaType !== "application/json") {
    return json({ error: "Unsupported content type.", correlationId }, 415);
  }

  const raw = await readBodyWithLimit(req, MAX_BODY_BYTES);
  if (raw === null) {
    return json({ error: "Request body too large.", correlationId }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON body.", correlationId }, 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ error: "Invalid JSON body.", correlationId }, 400);
  }

  const record = body as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ALLOWED_FIELDS.has(key)) {
      return json(
        { error: "Unexpected field in request.", correlationId },
        400,
      );
    }
  }

  const { name, email, message } = record;
  const trap = record[TRAP_FIELD];

  // The trap answers with a recoverable error, never with a fake success.
  //
  // This used to return { ok: true } without sending, which meant one
  // client-controlled field could make the UI announce "Message sent" for a
  // message nobody would ever receive — invisible to the sender and to
  // Vincent. Renaming the field away from "company" narrowed who could trip
  // it accidentally, but a single decisive signal silently discarding mail is
  // the wrong shape regardless of how unlikely the false positive is.
  //
  // A bot learns only that the request failed. A human who somehow trips it
  // gets told, and gets the direct address, so the conversion is recoverable.
  if (typeof trap === "string" && trap.trim()) {
    return json(
      {
        error: `That submission looked automated. Please email ${TO_EMAIL} directly.`,
        correlationId,
      },
      422,
    );
  }

  // A name matching urlInTextRegex (an explicit http:// or www.) used to be
  // silently discarded the same way. "Jane, www.acme.com" is a plausible
  // thing for a real recruiter to paste, and they were told the message sent.
  // It is a visible validation error now, so the sender can fix it and retry.
  if (typeof name === "string" && urlInTextRegex.test(name)) {
    return json(
      {
        error: "Please enter your name without a link or web address.",
        correlationId,
      },
      400,
    );
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return json(
      { error: "Name, email, and message are required.", correlationId },
      400,
    );
  }

  const cleanName = name.trim().normalize("NFC");
  const cleanEmail = email.trim().normalize("NFC");
  const cleanMessage = message.trim();

  if (controlCharRegex.test(cleanName) || controlCharRegex.test(cleanEmail)) {
    return json(
      { error: "Name or email contains invalid characters.", correlationId },
      400,
    );
  }

  if (!emailRegex.test(cleanEmail)) {
    return json(
      { error: "Please provide a valid email address.", correlationId },
      400,
    );
  }

  if (
    cleanName.length > MAX_NAME ||
    cleanEmail.length > MAX_EMAIL ||
    cleanMessage.length > MAX_MESSAGE
  ) {
    return json(
      { error: "One of the fields is too long.", correlationId },
      400,
    );
  }

  const emailDomain = cleanEmail.split("@")[1]?.toLowerCase() ?? "";

  if (disposableDomains.has(emailDomain)) {
    return json(
      {
        error:
          "Please use a real email address — disposable addresses aren't accepted.",
        correlationId,
      },
      400,
    );
  }

  if (!(await domainHasMx(emailDomain))) {
    return json(
      {
        error:
          "That email domain doesn't appear to receive mail. Please double-check the address.",
        correlationId,
      },
      400,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`[contact] ${correlationId} email service not configured`);
    return json(
      { error: "Message could not be sent right now.", correlationId },
      500,
    );
  }

  try {
    const resend = new Resend(apiKey);
    const result = await Promise.race([
      resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: cleanEmail,
        subject: `Portfolio: message from ${cleanName}`,
        text: `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("SendTimeout")), SEND_TIMEOUT_MS),
      ),
    ]);

    if (result.error) {
      // Log provider error name only — never submitted content.
      console.error(
        `[contact] ${correlationId} provider error: ${result.error.name}`,
      );
      return json(
        { error: "Message could not be sent right now.", correlationId },
        502,
      );
    }

    return json({ ok: true });
  } catch (e) {
    console.error(
      `[contact] ${correlationId} unexpected error:`,
      e instanceof Error ? e.name : "unknown",
    );
    return json(
      { error: "Message could not be sent right now.", correlationId },
      500,
    );
  }
}
