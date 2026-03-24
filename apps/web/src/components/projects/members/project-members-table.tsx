import {
  MemberRowContent,
  MEMBERS_TABLE_GRID_CLASS,
} from './member-row-content';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import type { ProjectRole } from '@repo/types';
import type { ProjectMember } from './types';
import { cn } from '@web/lib/utils';

const EMPTY_MEMBERS_MESSAGE = 'No members yet. Invite people to get started.';

type ProjectMembersTableProps = {
  members: ProjectMember[];
  currentUserRole?: ProjectRole;
  onChangeRole?: (
    memberId: string,
    role: Exclude<ProjectRole, 'OWNER'>,
  ) => void;
  onRemove?: (memberId: string) => void;
  isMutating?: boolean;
};

export function ProjectMembersTable({
  members,
  currentUserRole,
  onChangeRole,
  onRemove,
  isMutating = false,
}: ProjectMembersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className="hidden md:block"
          role="table"
          aria-label="Project members"
        >
          <div
            role="row"
            className={cn(
              MEMBERS_TABLE_GRID_CLASS,
              'border-b px-6 py-3 text-sm font-medium text-muted-foreground',
            )}
          >
            <div role="columnheader">Name</div>
            <div role="columnheader">Email</div>
            <div role="columnheader">Role</div>
            <div role="columnheader" aria-hidden />
          </div>

          {members.length === 0 ? (
            <div
              role="row"
              className={cn(MEMBERS_TABLE_GRID_CLASS, 'px-6 py-8')}
            >
              <div
                role="cell"
                className="col-span-full text-center text-sm text-muted-foreground"
                style={{ gridColumn: '1 / -1' }}
              >
                {EMPTY_MEMBERS_MESSAGE}
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {members.map((member) => (
                <MemberRowContent
                  key={member.id}
                  member={member}
                  currentUserRole={currentUserRole}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                  layout="row"
                  disabled={isMutating}
                />
              ))}
            </div>
          )}
        </div>

        <div className="divide-y md:hidden">
          {members.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {EMPTY_MEMBERS_MESSAGE}
            </div>
          ) : (
            members.map((member) => (
              <MemberRowContent
                key={member.id}
                member={member}
                currentUserRole={currentUserRole}
                onChangeRole={onChangeRole}
                onRemove={onRemove}
                layout="stack"
                disabled={isMutating}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
