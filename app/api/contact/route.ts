import { NextResponse } from "next/server";
import { Resend } from "resend";
import disposableDomainsList from "disposable-email-domains";

/**
 * Contact form endpoint.
 *
 * SETUP:
 * 1. Sign up at https://resend.com (free tier: 100/day, 3000/month).
 * 2. Create an API key in the Resend dashboard.
 * 3. In `.env.local` (gitignored), add:
 *      RESEND_API_KEY=re_xxxxxxxxxxxxx
 *    Optionally override the default from / to addresses:
 *      RESEND_FROM_EMAIL="Portfolio <noreply@vmd306.com>"
 *      RESEND_TO_EMAIL=vincentdo306@gmail.com
 * 4. The default `from` address uses Resend's `onboarding@resend.dev` test
 *    domain. To send from `@vmd306.com`, verify the domain in the Resend
 *    dashboard (add the SPF/DKIM/DMARC DNS records they show you) and then
 *    set RESEND_FROM_EMAIL above.
 * 5. For Vercel / Cloudflare deployments, add the same env vars in your
 *    project's Environment Variables panel.
 *
 * Without RESEND_API_KEY, this route returns a 500 with a clear error.
 *
 * Spam / fake-email defenses (in addition to the dialog's honeypot + min-time):
 *   - Reject obvious bot submissions silently (URL in name field) so bots
 *     don't retry.
 *   - Reject disposable email services (mailinator, guerrillamail, etc).
 *   - Verify the email's domain has MX records via Cloudflare DNS-over-HTTPS.
 *     Fails open if the DNS check itself errors out (no false positives).
 */

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "vincentdo306@gmail.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlInTextRegex = /(https?:\/\/|www\.)/i;

const disposableDomains = new Set<string>(
  disposableDomainsList.map((d) => d.toLowerCase())
);

/**
 * Resolve MX records via Cloudflare's DNS-over-HTTPS endpoint. Works on
 * both Node and edge runtimes (Cloudflare Workers, Vercel Edge). Returns
 * true if the domain has at least one MX record, false otherwise.
 * Fails open (returns true) on network errors — we don't want to block
 * legitimate users when DNS is flaky.
 */
async function domainHasMx(domain: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
        domain
      )}&type=MX`,
      {
        headers: { Accept: "application/dns-json" },
        signal: AbortSignal.timeout(3000),
      }
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
      {
        error:
          "Email service not configured. Set RESEND_API_KEY in .env.local (see app/api/contact/route.ts for setup).",
      },
      { status: 500 }
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

  // ── Silent bot rejections (200 OK so bots don't learn / retry) ──────────
  // Honeypot — only bots see/fill this field.
  if (typeof company === "string" && company.trim()) {
    return NextResponse.json({ ok: true });
  }
  // Min-time — humans can't type and submit a real message in under 2s.
  if (typeof openedAt === "number" && Date.now() - openedAt < 2000) {
    return NextResponse.json({ ok: true });
  }
  // URL in name — no human types `http://` into their name. Spambot signature.
  if (typeof name === "string" && urlInTextRegex.test(name)) {
    return NextResponse.json({ ok: true });
  }

  // ── User-facing validation errors ────────────────────────────────────────
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
      { status: 400 }
    );
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  // Hard caps to prevent abuse
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return NextResponse.json(
      { error: "One of the fields is too long." },
      { status: 400 }
    );
  }

  const emailDomain = email.split("@")[1]?.toLowerCase() ?? "";

  if (disposableDomains.has(emailDomain)) {
    return NextResponse.json(
      {
        error:
          "Please use a real email address — disposable addresses aren't accepted.",
      },
      { status: 400 }
    );
  }

  if (!(await domainHasMx(emailDomain))) {
    return NextResponse.json(
      {
        error: `That email domain (${emailDomain}) doesn't appear to receive mail. Please double-check the address.`,
      },
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
        {
          error:
            result.error.message || "Email provider rejected the message.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] unexpected error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to send: ${msg}` },
      { status: 500 }
    );
  }
}
