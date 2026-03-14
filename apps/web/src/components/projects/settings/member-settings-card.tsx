import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { UserPlus } from "lucide-react";
import { RemoveMemberButton } from "./remove-member-button";
import { ProjectRole } from "@repo/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role: ProjectRole | undefined) {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "MEMBER":
      return "Member";
    default:
      return role;
  }
}

type MemberWithRole = {
  id: string;
  name: string;
  email?: string | null;
  role: ProjectRole;
};
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
          <Button type="button" variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
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
              <Badge variant="secondary">{formatRole(member.role)}</Badge>
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
