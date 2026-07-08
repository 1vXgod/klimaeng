import { AddressManager } from "@/components/account/AddressManager";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Adresat e mia" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return (
    <AddressManager
      addresses={addresses.map((a) => ({
        id: a.id,
        label: a.label,
        street: a.street,
        city: a.city,
        zip: a.zip,
        phone: a.phone,
        isDefault: a.isDefault,
      }))}
    />
  );
}
