import type { ReactNode } from 'react';

type SettingsActionRowProps = {
  title: string;
  description: string;
  children: ReactNode;
  /** When true, uses destructive border styling. */
  variant?: 'default' | 'destructive';
};

export function SettingsActionRow({
  title,
  description,
  children,
  variant = 'default',
}: SettingsActionRowProps) {
  const borderClass =
    variant === 'destructive'
      ? 'rounded-xl border border-destructive/20 p-4'
      : 'rounded-xl border p-4';

  return (
    <div className={borderClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
