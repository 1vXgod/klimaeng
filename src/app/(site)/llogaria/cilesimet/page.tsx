import { SettingsForm } from "@/components/account/SettingsForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Cilësimet" };

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, phone: true, language: true },
  });
  if (!user) return null;

  return <SettingsForm user={user} />;
}
