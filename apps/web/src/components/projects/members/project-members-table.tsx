import { Badge } from "@web/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { MemberRowActions } from "@web/components/projects/members";
import { formatProjectRole, getInitials } from "@web/components/projects/utils";
import { ProjectRole } from "@repo/types";
import type { ProjectMember } from "./types";

type ProjectMembersTableProps = {
  members: ProjectMember[];
  currentUserRole: ProjectRole;
  onChangeRole?: (
    memberId: string,
    role: Exclude<ProjectRole, "OWNER">,
  ) => void;
  onRemove?: (memberId: string) => void;
};

export function ProjectMembersTable({
  members,
  currentUserRole,
  onChangeRole,
  onRemove,
}: ProjectMembersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="hidden md:block">
          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_120px_56px] items-center gap-4 border-b px-6 py-3 text-sm font-medium text-muted-foreground">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div />
          </div>

          <div className="divide-y">
            {members.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_120px_56px] items-center gap-4 px-6 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(member.name)}
                  </div>

                  <p className="truncate font-medium">{member.name}</p>
                </div>

                <p className="truncate text-sm text-muted-foreground">
                  {member.email}
                </p>

                <div>
                  <Badge variant="secondary">
                    {formatProjectRole(member.role)}
                  </Badge>
                </div>

                <div className="flex justify-end">
                  <MemberRowActions
                    member={member}
                    currentUserRole={currentUserRole}
                    onChangeRole={onChangeRole}
                    onRemove={onRemove}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y md:hidden">
          {members.map((member) => (
            <div key={member.id} className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(member.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">{member.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>

                <MemberRowActions
                  member={member}
                  currentUserRole={currentUserRole}
                  onChangeRole={onChangeRole}
                  onRemove={onRemove}
                />
              </div>

              <Badge variant="secondary">
                {formatProjectRole(member.role)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
