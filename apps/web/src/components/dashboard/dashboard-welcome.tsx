import { CreateProjectDialog } from '@web/components/projects';

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
          <CreateProjectDialog />
        </div>
      </div>
    </section>
  );
}
