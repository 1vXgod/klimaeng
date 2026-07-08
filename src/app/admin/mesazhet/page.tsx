import { MessagesList } from "@/components/admin/MessagesList";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Mesazhet" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <MessagesList
      messages={messages.map((m) => ({
        id: m.id,
        name: m.name,
        phone: m.phone,
        email: m.email,
        message: m.message,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
