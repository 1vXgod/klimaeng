import { OrdersTable } from "@/components/admin/OrdersTable";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Porositë" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <OrdersTable
      initialStatus={status}
      orders={orders.map((o) => ({
        id: o.id,
        orderNo: o.orderNo,
        customerName: o.customerName,
        email: o.email,
        phone: o.phone,
        city: o.city,
        street: o.street,
        note: o.note,
        withInstallation: o.withInstallation,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
      }))}
    />
  );
}
