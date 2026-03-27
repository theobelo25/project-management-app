import type { ReactNode } from 'react';
import { BackLink } from './back-link';

type PageHeaderProps = {
  /** Optional back link (e.g. BackLink), or use backHref + backLabel. */
  backLink?: ReactNode;
  /** If set with backLabel, renders BackLink internally. Ignored when backLink is set. */
  backHref?: string;
  /** Label for the back link when using backHref. */
  backLabel?: ReactNode;
  /** Main title (string or node for custom content). */
  title: ReactNode;
  /** Optional badge next to or under title. */
  badge?: ReactNode;
  /** Optional short description under title. */
  description?: ReactNode;
  /** Optional actions (buttons/links) on the right. */
  actions?: ReactNode;
};

export function PageHeader({
  backLink,
  backHref,
  backLabel,
  title,
  badge,
  description,
  actions,
}: PageHeaderProps) {
  const resolvedBackLink =
    backLink ??
    (backHref != null && backLabel != null ? (
      <BackLink href={backHref}>{backLabel}</BackLink>
    ) : null);

  return (
    <section className="flex flex-col gap-4">
      {resolvedBackLink ? <div>{resolvedBackLink}</div> : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className={badge ? 'space-y-3' : 'space-y-1'}>
          <div
            className={badge ? 'flex flex-wrap items-center gap-3' : undefined}
          >
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {badge ?? null}
          </div>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
