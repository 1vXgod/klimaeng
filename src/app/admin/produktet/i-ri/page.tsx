import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Produkt i ri" };

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink">Shto produkt të ri</h2>
      <ProductForm />
    </div>
  );
}
