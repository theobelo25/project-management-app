export function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-9 w-64 rounded bg-muted/50 animate-pulse" />
      <div className="h-4 w-96 max-w-full rounded bg-muted/30 animate-pulse" />
    </div>
  );
}
