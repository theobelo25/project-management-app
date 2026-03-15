"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { getInitials } from "@web/components/projects/utils";
import { Button } from "@web/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@web/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@web/components/ui/popover";
import { useUsersSearchQuery } from "@web/lib/api/queries";
import { cn } from "@web/lib/utils";

export type UserSearchResult = {
  id: string;
  name: string;
  email: string;
};

type UserSearchComboboxProps = {
  value?: string;
  onChange: (user: UserSearchResult) => void;
  disabled?: boolean;
  excludeUserIds?: string[];
  selectedUserDisplay?: UserSearchResult | null;
};

export function UserSearchCombobox({
  value,
  onChange,
  disabled = false,
  excludeUserIds,
  selectedUserDisplay = null,
}: UserSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {
    data: searchResults = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useUsersSearchQuery(search);
  const availableUsers = useMemo(
    () => searchResults.filter((u) => !excludeUserIds?.includes(u.id)),
    [searchResults, excludeUserIds],
  );
  const selectedUser =
    selectedUserDisplay ?? availableUsers.find((u) => u.id === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedUser ? (
            <span className="truncate">
              {selectedUser.name} ({selectedUser.email})
            </span>
          ) : value ? (
            <span className="truncate">Selected user</span>
          ) : (
            <span className="text-muted-foreground">Search for a user...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by name or email..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {search.trim().length < 2 ? (
              <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
            ) : usersLoading ? (
              <div className="flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : usersError ? (
              <div className="px-3 py-6 text-sm text-destructive">
                Failed to load users.
              </div>
            ) : availableUsers.length === 0 ? (
              <CommandEmpty>No users found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Users">
                {availableUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      onChange(user);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted text-[11px] font-medium text-muted-foreground">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === user.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
