"use server";

import { prisma } from "@/lib/prisma";

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function sendContactMessage(input: {
  name: string;
  phone?: string;
  email: string;
  message: string;
}): Promise<ContactResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const message = input.message?.trim();

  if (!name || name.length < 3) return { ok: false, error: "Shkruani emrin tuaj." };
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, error: "Email-i nuk është i vlefshëm." };
  if (!message || message.length < 10)
    return { ok: false, error: "Mesazhi duhet të ketë të paktën 10 karaktere." };

  await prisma.contactMessage.create({
    data: { name, email, phone: input.phone?.trim() || null, message },
  });
  await prisma.activityLog.create({
    data: { actor: name, action: "Mesazh i ri kontakti", detail: email },
  });

  return { ok: true };
}
