import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { ProjectListItemView } from "packages/types/dist";

type Props = { projects: ProjectListItemView[] };

export function DashboardProjectsCard({ projects }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Jump back into the projects you touched most recently.
            </CardDescription>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/projects">View all</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="rounded-xl border p-4 transition-colors hover:bg-accent/30">
              <div className="space-y-1">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
