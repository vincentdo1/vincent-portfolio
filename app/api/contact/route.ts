import { NextResponse } from "next/server";
import { Resend } from "resend";

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
 * 5. For Vercel deployments, add the same env vars in your Vercel project
 *    settings → Environment Variables.
 *
 * Without RESEND_API_KEY, this route returns a 500 with a clear error.
 */

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "vincentdo306@gmail.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { name, email, message, company, openedAt } = (body ?? {}) as Record<
    string,
    unknown
  >;

  // ── Bot checks (silent success so bots don't retry) ──────────────────────
  // Honeypot — only bots see/fill this field.
  if (typeof company === "string" && company.trim()) {
    return NextResponse.json({ ok: true });
  }
  // Min-time — humans can't type and submit a real message in under 2s.
  if (typeof openedAt === "number" && Date.now() - openedAt < 2000) {
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
    return NextResponse.json(
      { error: `Failed to send: ${msg}` },
      { status: 500 }
    );
  }
}
