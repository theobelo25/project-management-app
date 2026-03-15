"use client";

import Link from "next/link";
import {
  MoreHorizontal,
  FolderKanban,
  CheckCircle2,
  Circle,
} from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Badge } from "@web/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import {
  getInitials,
  formatProjectRole,
  formatUpdatedAt,
} from "@web/components/projects/utils";
import {
  ProjectListItemView,
  ProjectListMember,
  ProjectRole,
} from "@repo/types";

type ProjectCardProps = {
  project: ProjectListItemView;
};

function MembersPreview({ members }: { members: ProjectListMember[] }) {
  const visibleMembers = members.slice(0, 3);
  const remainingCount = Math.max(members.length - visibleMembers.length, 0);

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleMembers.map((member) => (
          <div
            key={member.id}
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted text-[11px] font-medium text-muted-foreground"
            title={member.name}
          >
            {getInitials(member.name)}
          </div>
        ))}

        {remainingCount > 0 ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-[11px] font-medium text-muted-foreground">
            +{remainingCount}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: ProjectRole }) {
  return (
    <Badge variant="secondary" className="font-normal">
      {formatProjectRole(role)}
    </Badge>
  );
}

function ProjectActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open project actions"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Open project</DropdownMenuItem>
        <DropdownMenuItem>Edit project</DropdownMenuItem>
        <DropdownMenuItem>Archive project</DropdownMenuItem>
        <DropdownMenuItem>Leave project</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="group h-full cursor-pointer transition-colors hover:bg-accent/30">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />
                <CardTitle className="truncate text-base">
                  {project.name}
                </CardTitle>
              </div>

              <CardDescription className="line-clamp-2">
                {project.description || "No description provided."}
              </CardDescription>
            </div>

            <CardAction>
              <ProjectActionsDropdown />
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-background/60 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                <FolderKanban className="h-3.5 w-3.5" />
                <span className="text-xs">Tasks</span>
              </div>
              <p className="text-sm font-semibold">{project.totalTasks}</p>
            </div>

            <div className="rounded-lg border bg-background/60 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-xs">Completed</span>
              </div>
              <p className="text-sm font-semibold">{project.completedTasks}</p>
            </div>

            <div className="rounded-lg border bg-background/60 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                <Circle className="h-3.5 w-3.5" />
                <span className="text-xs">Open</span>
              </div>
              <p className="text-sm font-semibold">{project.openTasks}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <MembersPreview members={project.members} />
            <span className="text-xs text-muted-foreground">
              {project.members.length} member
              {project.members.length === 1 ? "" : "s"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 border-t pt-4 text-sm">
          <RoleBadge role={project.currentUserRole ?? "MEMBER"} />
          <span className="text-muted-foreground">
            Updated {formatUpdatedAt(project.updatedAt)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
