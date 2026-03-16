import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function DashboardWelcome() {
  return (
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
  );
}
