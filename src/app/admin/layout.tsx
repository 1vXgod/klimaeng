import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: { default: "Paneli Admin", template: "%s — Admin | KlimaENG" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/kycu?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/llogaria");

  const activities = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <AdminShell
      userName={session.user.name ?? "Admin"}
      activities={activities.map((a) => ({
        id: a.id,
        actor: a.actor,
        action: a.action,
        detail: a.detail,
        createdAt: a.createdAt.toISOString(),
      }))}
    >
      {children}
    </AdminShell>
  );
}
