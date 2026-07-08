"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type Result = { ok: true } | { ok: false; error: string };

export async function registerUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<Result> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password ?? "";

  if (!name || name.length < 3) return { ok: false, error: "Shkruani emrin e plotë." };
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, error: "Email-i nuk është i vlefshëm." };
  if (password.length < 8)
    return { ok: false, error: "Fjalëkalimi duhet të ketë të paktën 8 karaktere." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Ky email është i regjistruar tashmë. Provoni të kyçeni." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, phone: input.phone?.trim() || null },
  });
  await prisma.activityLog.create({
    data: { actor: name, action: "Regjistrim i ri klienti", detail: email },
  });

  return { ok: true };
}

export async function requestPasswordReset(
  emailRaw: string
): Promise<{ ok: true; resetUrl?: string }> {
  const email = emailRaw?.trim().toLowerCase();
  if (!email) return { ok: true };

  const user = await prisma.user.findUnique({ where: { email } });
  // Always report success — never reveal whether an account exists.
  if (!user) return { ok: true };

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  // Without an SMTP provider configured, surface the link directly (demo mode).
  return { ok: true, resetUrl: `/rivendos-fjalekalimin/${token}` };
}

export async function resetPassword(input: {
  token: string;
  password: string;
}): Promise<Result> {
  if (!input.password || input.password.length < 8)
    return { ok: false, error: "Fjalëkalimi duhet të ketë të paktën 8 karaktere." };

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: input.token },
  });
  if (!record || record.expiresAt < new Date())
    return { ok: false, error: "Linku i rivendosjes ka skaduar. Kërkoni një të ri." };

  const passwordHash = await bcrypt.hash(input.password, 10);
  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });
  await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } });

  return { ok: true };
}
