import { CheckCircle2, Circle, FolderKanban } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

const ICON_MAP = {
  projects: FolderKanban,
  open: Circle,
  completed: CheckCircle2,
} as const;

export type DashboardStat = {
  title: string;
  value: string;
  description: string;
  iconKey: keyof typeof ICON_MAP;
};

type Props = { stats: DashboardStat[] };

export function DashboardStats({ stats }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.iconKey];

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <CardDescription>{stat.description}</CardDescription>
              </div>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
