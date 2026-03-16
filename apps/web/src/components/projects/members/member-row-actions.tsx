"use client";

import { MoreHorizontal } from "lucide-react";
import type { ProjectMember } from "./types";
import {
  DestructiveDropdownItem,
  RowActionsMenu,
} from "@web/components/projects/row-actions-menu";
import { Button } from "@web/components/ui/button";
import { DropdownMenuItem } from "@web/components/ui/dropdown-menu";
import type { ProjectRole } from "@repo/types";

type MemberRowActionsProps = {
  member: ProjectMember;
  currentUserRole: ProjectRole;
  onChangeRole?: (
    memberId: string,
    role: Exclude<ProjectRole, "OWNER">,
  ) => void;
  onRemove?: (memberId: string) => void;
  disabled?: boolean;
};

export function MemberRowActions({
  member,
  currentUserRole,
  onChangeRole,
  onRemove,
  disabled = false,
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

  if (disabled) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open member actions"
        disabled
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <RowActionsMenu ariaLabel="Open member actions">
      {canChangeRole ? (
        <>
          <DropdownMenuItem onClick={() => onChangeRole?.(member.id, "ADMIN")}>
            Make Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeRole?.(member.id, "MEMBER")}>
            Make Member
          </DropdownMenuItem>
        </>
      ) : null}

      {canRemove ? (
        <DestructiveDropdownItem onClick={() => onRemove?.(member.id)}>
          Remove Member
        </DestructiveDropdownItem>
      ) : null}
    </RowActionsMenu>
  );
}
