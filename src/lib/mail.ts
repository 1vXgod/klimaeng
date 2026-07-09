/**
 * Provider-agnostic email sender.
 *
 * Providers (resolved from env, no code changes to swap):
 *  - RESEND_API_KEY set  → sends through the Resend API (works on Vercel).
 *    Optional EMAIL_FROM, e.g. `KlimaENG <info@klimaeng.com>` — the domain
 *    must be verified in Resend; without it the Resend sandbox sender is used.
 *  - otherwise           → demo mode: the email is logged to the server
 *    console and `delivered: false` is returned, so callers can surface
 *    verification codes directly in the UI during development.
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
    console.log(
      `[mail:demo] To: ${input.to}\n[mail:demo] Subject: ${input.subject}\n[mail:demo] ${input.text.slice(0, 300)}`
    );
    return { delivered: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "KlimaENG <onboarding@resend.dev>",
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
