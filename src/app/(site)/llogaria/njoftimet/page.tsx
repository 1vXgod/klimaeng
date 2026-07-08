import { NotificationList } from "@/components/account/NotificationList";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Njoftimet" };

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = await prisma.notification.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <NotificationList
      notifications={notifications.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      }))}
    />
  );
}
