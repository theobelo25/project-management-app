import Link from 'next/link';

import { getInitials } from '@web/components/projects/utils';
import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import type { ProjectDetailMember, ProjectDetailView } from '@repo/types';

export interface ProjectMembersCardProps {
  project: Pick<ProjectDetailView, 'id'>;
  members: ProjectDetailMember[];
  canManageMembers: boolean;
}

export function ProjectMembersCard({
  project,
  members,
  canManageMembers,
}: ProjectMembersCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            People collaborating on this project.
          </CardDescription>
        </div>

        {canManageMembers ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}/members`}>Manage</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Manage
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                {getInitials(member.name)}
              </div>

              <div className="min-w-0">
                <p className="truncate font-medium">{member.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {member.email ?? ''}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No members yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
