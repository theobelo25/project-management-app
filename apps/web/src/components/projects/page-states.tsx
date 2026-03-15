type PageMessageProps = {
  children: React.ReactNode;
  className?: string;
  role?: "status" | "alert";
  "aria-live"?: "polite";
};

function PageMessage({
  children,
  className = "",
  role,
  "aria-live": ariaLive,
}: PageMessageProps) {
  return (
    <div
      className={`flex items-center justify-center py-12 text-sm ${className}`}
      role={role}
      aria-live={ariaLive}
    >
      {children}
    </div>
  );
}

export function PageLoadingMessage() {
  return (
    <PageMessage
      className="text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      Loading…
    </PageMessage>
  );
}

export function PageErrorMessage({ message }: { message: string }) {
  return (
    <PageMessage className="text-destructive" role="alert">
      {message}
    </PageMessage>
  );
}

export function InvalidProjectMessage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted-foreground">Invalid project.</div>
    </div>
  );
}

export function PageStateContainer({
  children,
  className = "flex flex-col gap-8 my-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
