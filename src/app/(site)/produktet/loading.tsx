import { ProductCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="container-site pt-28 pb-20 md:pt-36">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-4 h-10 w-72" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-10 flex gap-2.5">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 w-40 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
