"use client";

import type {
  ProjectMember,
  ProjectRole,
} from "@web/components/projects/members";
import {
  DestructiveDropdownItem,
  RowActionsMenu,
} from "@web/components/projects/row-actions-menu";
import { DropdownMenuItem } from "@web/components/ui/dropdown-menu";

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
