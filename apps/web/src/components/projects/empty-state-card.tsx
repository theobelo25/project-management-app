import type { ReactNode } from 'react';
import { cn } from '@web/lib/utils';

type EmptyStateCardProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Minimum height. Default "min-h-80". Use "min-h-[320px]" to match tasks. */
  minHeight?: 'min-h-80' | 'min-h-[320px]';
};

export function EmptyStateCard({
  icon,
  title,
  description,
  children,
  minHeight = 'min-h-80',
}: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center',
        minHeight,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
        {icon}
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
