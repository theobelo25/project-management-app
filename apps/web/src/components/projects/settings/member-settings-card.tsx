import { InviteMemberDialog } from "@web/components/projects/members";
import { RemoveMemberButton } from "@web/components/projects/settings";
import {
  formatProjectRole,
  getInitials,
  MemberWithRole,
} from "@web/components/projects/utils";
import { Badge } from "@web/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

type MemberSettingsCardProps = {
  project: { id: string };
  canManageMembers: boolean;
  membersWithRole: MemberWithRole[];
};

export function MemberSettingsCard({
  project,
  canManageMembers,
  membersWithRole,
}: MemberSettingsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Manage who has access to this project and what they can do.
          </CardDescription>
        </div>
        {canManageMembers ? (
          <InviteMemberDialog
            projectId={project.id}
            currentMemberIds={membersWithRole.map((m) => m.id)}
          />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {membersWithRole.map((member) => (
          <div
            key={member.id}
            className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                {getInitials(member.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{member.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {member.email ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {formatProjectRole(member.role)}
              </Badge>
              {canManageMembers && member.role !== "OWNER" ? (
                <RemoveMemberButton projectId={project.id} userId={member.id} />
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
