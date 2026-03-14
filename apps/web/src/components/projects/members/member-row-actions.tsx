"use client";

import { MoreHorizontal } from "lucide-react";

import type {
  ProjectMember,
  ProjectRole,
} from "@web/components/projects/members/types";

import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";

type MemberRowActionsProps = {
  member: ProjectMember;
  currentUserRole: ProjectRole;
  onChangeRole?: (
    memberId: string,
    role: Exclude<ProjectRole, "OWNER">,
  ) => void;
  onRemove?: (memberId: string) => void;
};

export function MemberRowActions({
  member,
  currentUserRole,
  onChangeRole,
  onRemove,
}: MemberRowActionsProps) {
  const canManageMembers =
    currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const canChangeRole =
    canManageMembers &&
    member.role !== "OWNER" &&
    typeof onChangeRole === "function";

  const canRemove =
    canManageMembers &&
    member.role !== "OWNER" &&
    typeof onRemove === "function";

  if (!canChangeRole && !canRemove) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open member actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {canChangeRole ? (
          <>
            <DropdownMenuItem
              onClick={() => onChangeRole?.(member.id, "ADMIN")}
            >
              Make Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChangeRole?.(member.id, "MEMBER")}
            >
              Make Member
            </DropdownMenuItem>
          </>
        ) : null}

        {canRemove ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onRemove?.(member.id)}
          >
            Remove Member
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
