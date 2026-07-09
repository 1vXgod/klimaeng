"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { resetCodeEmail, verificationCodeEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

type Result = { ok: true } | { ok: false; error: string };

const CODE_TTL_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

const PURPOSE = {
  verify: "VERIFY_EMAIL",
  reset: "RESET_PASSWORD",
} as const;

function normalizeEmail(raw: string) {
  return (raw ?? "").trim().toLowerCase();
}

/** Creates (or refuses, on cooldown) a 6-digit code and emails it. */
async function issueCode(
  email: string,
  purpose: string,
  recipientName: string
): Promise<Result> {
  const latest = await prisma.verificationCode.findFirst({
    where: { email, purpose },
    orderBy: { createdAt: "desc" },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    return { ok: false, error: "Prisni një minutë para se të kërkoni kod të ri." };
  }

  const code = String(crypto.randomInt(100000, 1000000));
  await prisma.verificationCode.deleteMany({ where: { email, purpose } });
  const record = await prisma.verificationCode.create({
    data: { email, code, purpose, expiresAt: new Date(Date.now() + CODE_TTL_MS) },
  });

  const template =
    purpose === PURPOSE.verify
      ? verificationCodeEmail(recipientName, code)
      : resetCodeEmail(recipientName, code);
  const result = await sendMail({ to: email, ...template });

  if (!result.delivered) {
    // Remove the unusable code so the cooldown doesn't block an immediate retry.
    await prisma.verificationCode.delete({ where: { id: record.id } }).catch(() => {});
    return {
      ok: false,
      error:
        "Dërgimi i email-it dështoi. Provoni përsëri pas pak — nëse problemi vazhdon, na kontaktoni në avnibunjaku@hotmail.com.",
    };
  }
  return { ok: true };
}

/** Checks a submitted code; consumes it on success, counts attempts on failure. */
async function consumeCode(email: string, purpose: string, submitted: string): Promise<Result> {
  const record = await prisma.verificationCode.findFirst({
    where: { email, purpose },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.expiresAt < new Date()) {
    return { ok: false, error: "Kodi ka skaduar. Kërkoni një kod të ri." };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "Shumë tentativa të gabuara. Kërkoni një kod të ri." };
  }
  if (record.code !== submitted.trim()) {
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, error: "Kodi është i pasaktë. Kontrolloni dhe provoni përsëri." };
  }
  await prisma.verificationCode.deleteMany({ where: { email, purpose } });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Registration + email verification
// ---------------------------------------------------------------------------

export async function registerUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<Result> {
  const name = input.name?.trim();
  const email = normalizeEmail(input.email);
  const password = input.password ?? "";

  if (!name || name.length < 3) return { ok: false, error: "Shkruani emrin e plotë." };
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, error: "Email-i nuk është i vlefshëm." };
  if (password.length < 8)
    return { ok: false, error: "Fjalëkalimi duhet të ketë të paktën 8 karaktere." };

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing?.emailVerified) {
    return { ok: false, error: "Ky email është i regjistruar tashmë. Provoni të kyçeni." };
  }

  if (existing) {
    // Unverified leftover from an earlier attempt — refresh it and re-issue a code.
    await prisma.user.update({
      where: { id: existing.id },
      data: { name, passwordHash, phone: input.phone?.trim() || null },
    });
  } else {
    await prisma.user.create({
      data: { name, email, passwordHash, phone: input.phone?.trim() || null },
    });
    await prisma.activityLog.create({
      data: { actor: name, action: "Regjistrim i ri klienti", detail: email },
    });
  }

  return issueCode(email, PURPOSE.verify, name);
}

export async function verifyEmail(input: { email: string; code: string }): Promise<Result> {
  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Llogaria nuk u gjet." };
  if (user.emailVerified) return { ok: true };

  const check = await consumeCode(email, PURPOSE.verify, input.code);
  if (!check.ok) return check;

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });
  return { ok: true };
}

export async function resendVerificationCode(emailRaw: string): Promise<Result> {
  const email = normalizeEmail(emailRaw);
  const user = await prisma.user.findUnique({ where: { email } });
  // Never reveal whether an account exists.
  if (!user || user.emailVerified) return { ok: true };
  return issueCode(email, PURPOSE.verify, user.name);
}

/** Lets the login page distinguish "unverified email" from "wrong credentials". */
export async function loginPrecheck(emailRaw: string): Promise<{ unverified: boolean }> {
  const email = normalizeEmail(emailRaw);
  if (!email) return { unverified: false };
  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });
  return { unverified: !!user && !user.emailVerified };
}

// ---------------------------------------------------------------------------
// Password reset with code
// ---------------------------------------------------------------------------

export async function requestPasswordReset(emailRaw: string): Promise<Result> {
  const email = normalizeEmail(emailRaw);
  if (!email) return { ok: true };
  const user = await prisma.user.findUnique({ where: { email } });
  // Always report success — never reveal whether an account exists.
  if (!user) return { ok: true };
  return issueCode(email, PURPOSE.reset, user.name);
}

export async function resetPasswordWithCode(input: {
  email: string;
  code: string;
  password: string;
}): Promise<Result> {
  const email = normalizeEmail(input.email);
  if (!input.password || input.password.length < 8)
    return { ok: false, error: "Fjalëkalimi duhet të ketë të paktën 8 karaktere." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Kodi është i pasaktë ose ka skaduar." };

  const check = await consumeCode(email, PURPOSE.reset, input.code);
  if (!check.ok) return check;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(input.password, 10),
      // Proving control of the inbox also verifies the address.
      emailVerified: user.emailVerified ?? new Date(),
    },
  });
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Fjalëkalimi u ndryshua",
      body: "Fjalëkalimi i llogarisë suaj u rivendos me sukses. Nëse nuk ishit ju, na kontaktoni menjëherë.",
      type: "security",
    },
  });
  return { ok: true };
}
