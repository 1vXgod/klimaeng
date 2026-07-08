"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Result = { ok: true } | { ok: false; error: string };

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function updateProfile(input: {
  name: string;
  phone?: string;
  language?: string;
  theme?: string;
}): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Duhet të jeni të kyçur." };

  const name = input.name?.trim();
  if (!name || name.length < 3) return { ok: false, error: "Shkruani emrin e plotë." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      phone: input.phone?.trim() || null,
      ...(input.language ? { language: input.language } : {}),
      ...(input.theme ? { theme: input.theme } : {}),
    },
  });
  revalidatePath("/llogaria");
  return { ok: true };
}

export async function changePassword(input: {
  current: string;
  next: string;
}): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Duhet të jeni të kyçur." };
  if (!input.next || input.next.length < 8)
    return { ok: false, error: "Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere." };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return { ok: false, error: "Llogaria nuk u gjet." };

  const valid = await bcrypt.compare(input.current, dbUser.passwordHash);
  if (!valid) return { ok: false, error: "Fjalëkalimi aktual është i pasaktë." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(input.next, 10) },
  });
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Fjalëkalimi u ndryshua",
      body: "Fjalëkalimi i llogarisë suaj u ndryshua me sukses. Nëse nuk ishit ju, na kontaktoni menjëherë.",
      type: "security",
    },
  });
  revalidatePath("/llogaria");
  return { ok: true };
}

export async function saveAddress(input: {
  id?: string;
  label: string;
  street: string;
  city: string;
  zip?: string;
  phone?: string;
  isDefault?: boolean;
}): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Duhet të jeni të kyçur." };
  if (!input.street?.trim() || !input.city?.trim())
    return { ok: false, error: "Plotësoni rrugën dhe qytetin." };

  const data = {
    label: input.label?.trim() || "Shtëpia",
    street: input.street.trim(),
    city: input.city.trim(),
    zip: input.zip?.trim() || null,
    phone: input.phone?.trim() || null,
    isDefault: !!input.isDefault,
  };

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
  }

  if (input.id) {
    const existing = await prisma.address.findFirst({
      where: { id: input.id, userId: user.id },
    });
    if (!existing) return { ok: false, error: "Adresa nuk u gjet." };
    await prisma.address.update({ where: { id: input.id }, data });
  } else {
    await prisma.address.create({ data: { ...data, userId: user.id } });
  }

  revalidatePath("/llogaria/adresat");
  return { ok: true };
}

export async function deleteAddress(id: string): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Duhet të jeni të kyçur." };
  await prisma.address.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/llogaria/adresat");
  return { ok: true };
}

export async function markNotificationsRead(): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Duhet të jeni të kyçur." };
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/llogaria/njoftimet");
  return { ok: true };
}

export async function deleteNotification(id: string): Promise<Result> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Duhet të jeni të kyçur." };
  await prisma.notification.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/llogaria/njoftimet");
  return { ok: true };
}
