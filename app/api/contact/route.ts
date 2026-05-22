import { NextResponse } from "next/server";
import { Resend } from "resend";
import disposableDomainsList from "disposable-email-domains";

// Env: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL (see .env.example)
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "vincentdo306@gmail.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlInTextRegex = /(https?:\/\/|www\.)/i;
const mxCache = new Map<string, { value: boolean; expiresAt: number }>();
const mxCacheTtlMs = 1000 * 60 * 60;

const disposableDomains = new Set<string>(
  disposableDomainsList.map((d) => d.toLowerCase()),
);

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
    mxCache.set(domain, { value, expiresAt: Date.now() + mxCacheTtlMs });
    return value;
  } catch {
    return true;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email service not configured. Set RESEND_API_KEY in .env.local.",
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, message, company, openedAt } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof company === "string" && company.trim())
    return NextResponse.json({ ok: true });
  if (typeof openedAt === "number" && Date.now() - openedAt < 2000)
    return NextResponse.json({ ok: true });
  if (typeof name === "string" && urlInTextRegex.test(name)) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  if (!emailRegex.test(cleanEmail)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (
    cleanName.length > 200 ||
    cleanEmail.length > 320 ||
    cleanMessage.length > 5000
  ) {
    return NextResponse.json(
      { error: "One of the fields is too long." },
      { status: 400 },
    );
  }

  const emailDomain = cleanEmail.split("@")[1]?.toLowerCase() ?? "";

  if (disposableDomains.has(emailDomain)) {
    return NextResponse.json(
      {
        error:
          "Please use a real email address — disposable addresses aren't accepted.",
      },
      { status: 400 },
    );
  }

  if (!(await domainHasMx(emailDomain))) {
    return NextResponse.json(
      {
        error: `That email domain (${emailDomain}) doesn't appear to receive mail. Please double-check the address.`,
      },
      { status: 400 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: cleanEmail,
      subject: `Portfolio: message from ${cleanName}`,
      text: `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`,
    });

    if (result.error) {
      console.error("[contact] resend error:", result.error);
      return NextResponse.json(
        {
          error: result.error.message || "Email provider rejected the message.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] unexpected error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to send: ${msg}` },
      { status: 500 },
    );
  }
}
