'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { getInitials } from '@web/components/projects/utils';
import { Button } from '@web/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@web/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@web/components/ui/popover';
import { fetchAllUsers, fetchUsers } from '@web/lib/api/client';
import { cn } from '@web/lib/utils';

export type UserSearchResult = {
  id: string;
  name: string;
  email: string;
};

type UserSearchScope = 'org' | 'global';

type UserSearchComboboxProps = {
  id?: string;
  value?: string;
  onChange: (user: UserSearchResult) => void;
  disabled?: boolean;
  excludeUserIds?: string[];
  selectedUserDisplay?: UserSearchResult | null;
  scope?: UserSearchScope;
};

export function UserSearchCombobox({
  id: idProp,
  value,
  onChange,
  disabled = false,
  excludeUserIds,
  selectedUserDisplay = null,
  scope = 'org',
}: UserSearchComboboxProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const searchTerm = deferredSearch.trim();

  const usersQuery = useQuery<UserSearchResult[]>({
    queryKey: ['users', scope, searchTerm] as const,
    queryFn: async () => {
      const users =
        scope === 'global'
          ? await fetchAllUsers(searchTerm)
          : await fetchUsers(searchTerm);

      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      }));
    },
    enabled: searchTerm.length >= 2,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: searchResults = [],
    isLoading: usersLoading,
    isError: usersError,
  } = usersQuery;

  const excludeSet = useMemo(
    () => new Set(excludeUserIds ?? []),
    [excludeUserIds],
  );

  const availableUsers = useMemo(
    () => searchResults.filter((u) => !excludeSet.has(u.id)),
    [searchResults, excludeSet],
  );

  const selectedUser =
    selectedUserDisplay ?? availableUsers.find((u) => u.id === value);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch('');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
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
            autoComplete="off"
          />
          <CommandList>
            {searchTerm.length < 2 ? (
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
                        'h-4 w-4',
                        value === user.id ? 'opacity-100' : 'opacity-0',
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
