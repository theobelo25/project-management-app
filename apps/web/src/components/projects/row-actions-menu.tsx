"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";

type RowActionsMenuProps = {
  ariaLabel: string;
  children: React.ReactNode;
};

export function RowActionsMenu({ ariaLabel, children }: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DestructiveDropdownItem({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem
      className="text-destructive focus:text-destructive"
      onClick={onClick}
    >
      {children}
    </DropdownMenuItem>
  );
}
