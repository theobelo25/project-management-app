import { CreateProjectDialog } from "./create-project-dialog";

export function ProjectsWelcome() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between my-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Manage your projects, track progress, and collaborate with your team.
        </p>
      </div>

      <CreateProjectDialog />
    </section>
  );
}
