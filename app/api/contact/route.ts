import { NextResponse } from "next/server";
import { Resend } from "resend";
import disposableDomainsList from "disposable-email-domains";

// Env: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL (see .env.example)
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "vincentdo306@gmail.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlInTextRegex = /(https?:\/\/|www\.)/i;

const disposableDomains = new Set<string>(
  disposableDomainsList.map((d) => d.toLowerCase())
);

// MX lookup via Cloudflare DNS-over-HTTPS, fails open on error
async function domainHasMx(domain: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      { headers: { Accept: "application/dns-json" }, signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return true;
    const data = (await res.json()) as { Answer?: unknown[] };
    return Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return true;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured. Set RESEND_API_KEY in .env.local." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, message, company, openedAt } = (body ?? {}) as Record<string, unknown>;

  // Bot traps — return 200 so bots don't retry
  if (typeof company === "string" && company.trim()) return NextResponse.json({ ok: true });
  if (typeof openedAt === "number" && Date.now() - openedAt < 2000) return NextResponse.json({ ok: true });
  if (typeof name === "string" && urlInTextRegex.test(name)) return NextResponse.json({ ok: true });

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() || !email.trim() || !message.trim()
  ) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return NextResponse.json(
      { error: "One of the fields is too long." },
      { status: 400 }
    );
  }

  const emailDomain = email.split("@")[1]?.toLowerCase() ?? "";

  if (disposableDomains.has(emailDomain)) {
    return NextResponse.json(
      { error: "Please use a real email address — disposable addresses aren't accepted." },
      { status: 400 }
    );
  }

  if (!(await domainHasMx(emailDomain))) {
    return NextResponse.json(
      { error: `That email domain (${emailDomain}) doesn't appear to receive mail. Please double-check the address.` },
      { status: 400 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Portfolio: message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (result.error) {
      console.error("[contact] resend error:", result.error);
      return NextResponse.json(
        { error: result.error.message || "Email provider rejected the message." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] unexpected error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: `Failed to send: ${msg}` }, { status: 500 });
  }
}
