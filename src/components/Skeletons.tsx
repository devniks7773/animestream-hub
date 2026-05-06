export function CardSkeleton() {
  return (
    <div className="aspect-[2/3] rounded-xl bg-secondary overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent bg-[length:200%_100%] animate-shimmer" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="container py-6">
      <div className="h-8 w-48 rounded-md bg-secondary mb-4 animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[170px]"><CardSkeleton /></div>
        ))}
      </div>
    </div>
  );
}
