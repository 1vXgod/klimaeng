import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-surface-3/70 dark:bg-surface-3",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <Skeleton className="mt-4 h-3 w-16" />
      <Skeleton className="mt-2 h-5 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}
