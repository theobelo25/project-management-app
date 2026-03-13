import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";
import { ProjectCard } from "./project-card";

const projects = [
  {
    id: "1",
    name: "Project Management App",
    description: "A collaborative project and task management platform.",
    currentUserRole: "OWNER" as const,
    updatedAt: new Date(),
    totalTasks: 14,
    completedTasks: 5,
    openTasks: 9,
    members: [
      { id: "1", name: "Theo Belo" },
      { id: "2", name: "Kenzie Malone" },
      { id: "3", name: "Joel Smith" },
      { id: "4", name: "Alex Doe" },
    ],
  },
];

export default function ProjectsPage() {
  const hasProjects = projects.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage your projects, track progress, and collaborate with your
            team.
          </p>
        </div>

        <Button>Create Project</Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input placeholder="Search projects..." className="sm:max-w-sm" />

          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              <SelectItem value="owned">Owned by me</SelectItem>
              <SelectItem value="member">Member of</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Recently updated" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Recently updated</SelectItem>
            <SelectItem value="created-desc">Recently created</SelectItem>
            <SelectItem value="name-asc">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasProjects ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Showing 1 of 1 projects
            </p>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">No projects yet</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Create your first project to start organizing tasks and
              collaborating with your team.
            </p>
          </div>

          <Button className="mt-4">Create Project</Button>
        </div>
      )}
    </div>
  );
}
