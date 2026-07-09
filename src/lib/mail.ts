/**
 * Transactional email sender (Resend — https://resend.com).
 *
 * Required environment:
 *  - RESEND_API_KEY  API key from the Resend dashboard.
 *  - EMAIL_FROM      Verified sender, e.g. `KlimaENG <info@klimaeng.com>`.
 *                    The domain must be verified in Resend; while it isn't,
 *                    Resend's sandbox sender is used as a fallback.
 *
 * There is intentionally no "demo mode": verification codes and receipts are
 * never logged or surfaced anywhere except the recipient's inbox. A missing
 * key returns `delivered: false` so callers can show a configuration error.
 */

export type MailResult = { delivered: boolean; error?: string };

type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail(input: MailInput): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error(
      "[mail] RESEND_API_KEY is not set — cannot deliver email. Configure it in .env and in the Vercel project settings."
    );
    return { delivered: false, error: "email_not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "KlimaENG <onboarding@resend.dev>",
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[mail] Resend responded ${res.status}: ${body}`);
      return { delivered: false, error: `Resend ${res.status}` };
    }
    return { delivered: true };
  } catch (e) {
    console.error("[mail] send failed:", e);
    return { delivered: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
