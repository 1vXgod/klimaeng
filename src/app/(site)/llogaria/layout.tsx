import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/kycu?callbackUrl=/llogaria");

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return (
    <div className="container-site pt-24 pb-20 md:pt-32">
      <div className="mb-8">
        <p className="text-sm font-medium text-muted">Llogaria ime</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink">
          Mirë se erdhët, {session.user.name?.split(" ")[0]} 👋
        </h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-10">
        <AccountSidebar unreadCount={unreadCount} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
