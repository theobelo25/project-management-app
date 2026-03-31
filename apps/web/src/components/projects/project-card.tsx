'use client';

import Link from 'next/link';
import {
  Circle,
  CheckCircle2,
  FolderKanban,
  MoreHorizontal,
} from 'lucide-react';

import { Badge } from '@web/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@web/components/ui/dropdown-menu';
import {
  formatProjectRole,
  formatUpdatedAt,
  getInitials,
} from '@web/components/projects/utils';
import type {
  ProjectListItemView,
  ProjectListMember,
  ProjectRole,
} from '@repo/types';

type StatBlockProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};
function StatBlock({ icon, label, value }: StatBlockProps) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

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
            aria-label={member.name}
          >
            <span aria-hidden>{getInitials(member.name)}</span>
          </div>
        ))}

        {remainingCount > 0 ? (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-[11px] font-medium text-muted-foreground"
            aria-label={`${remainingCount} more members`}
          >
            <span aria-hidden>+{remainingCount}</span>
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
          <MoreHorizontal className="h-4 w-4" aria-hidden />
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
                <FolderKanban
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <CardTitle className="truncate text-base">
                  {project.name}
                </CardTitle>
              </div>

              <CardDescription className="line-clamp-2">
                {project.description || 'No description provided.'}
              </CardDescription>
            </div>

            <CardAction>
              <ProjectActionsDropdown />
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <StatBlock
              icon={<FolderKanban className="h-3.5 w-3.5" aria-hidden />}
              label="Tasks"
              value={project.totalTasks}
            />
            <StatBlock
              icon={<CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
              label="Completed"
              value={project.completedTasks}
            />
            <StatBlock
              icon={<Circle className="h-3.5 w-3.5" aria-hidden />}
              label="Open"
              value={project.openTasks}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <MembersPreview members={project.members} />
            <span className="text-xs text-muted-foreground">
              {project.members.length} member
              {project.members.length === 1 ? '' : 's'}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 border-t pt-4 text-sm">
          {project.currentUserRole ? (
            <RoleBadge role={project.currentUserRole} />
          ) : (
            <span />
          )}
          <span className="text-muted-foreground">
            Updated {formatUpdatedAt(project.updatedAt)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
