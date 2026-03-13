import Link from "next/link";
import { FolderKanban, CheckCircle2, Circle, Plus } from "lucide-react";

import { Button } from "@web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

const stats = [
  {
    title: "Projects",
    value: "8",
    description: "Active workspaces",
    icon: FolderKanban,
  },
  {
    title: "Open Tasks",
    value: "24",
    description: "Still in progress",
    icon: Circle,
  },
  {
    title: "Completed",
    value: "53",
    description: "Finished this month",
    icon: CheckCircle2,
  },
];

const recentProjects = [
  {
    id: "1",
    name: "Project Management App",
    description: "A collaborative project and task management platform.",
  },
  {
    id: "2",
    name: "Marketing Website Redesign",
    description: "Landing pages and content refresh for Q2.",
  },
  {
    id: "3",
    name: "Client Portal",
    description: "Internal dashboard for client account management.",
  },
];

const myTasks = [
  { id: "1", title: "Finish projects toolbar", status: "In progress" },
  { id: "2", title: "Wire up projects pagination", status: "Todo" },
  { id: "3", title: "Create project detail page", status: "Todo" },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Track projects, manage tasks, and keep your team moving.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/tasks/new">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

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

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
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
            {recentProjects.map((project) => (
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

        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>
              A quick snapshot of what needs attention.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.status}</p>
                </div>
              </div>
            ))}

            <Button asChild variant="outline" className="w-full">
              <Link href="/tasks">View all tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
