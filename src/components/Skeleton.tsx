export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-black/[0.06] ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
