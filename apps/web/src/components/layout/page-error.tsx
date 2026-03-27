export function PageError({ message }: { message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex items-center justify-center py-12 text-destructive">
        {message}
      </div>
    </div>
  );
}
