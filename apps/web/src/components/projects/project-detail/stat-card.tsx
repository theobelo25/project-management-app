import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';

export interface StatCardProps {
  /** Short label above the value, e.g. "Total Tasks" */
  title: string;
  /** Optional subtitle/description */
  description?: string;
  /** Main value (number, string, or custom content) */
  value: ReactNode;
  /** Icon shown in the header (e.g. Lucide icon) */
  icon?: ReactNode;
}

export function StatCard({ title, description, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {icon ? (
          <span className="h-4 w-4 text-muted-foreground [&>svg]:size-4">
            {icon}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
