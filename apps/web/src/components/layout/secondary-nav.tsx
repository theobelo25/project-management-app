'use client';
import Link from 'next/link';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { logout } from '@web/lib/api/client';
import {
  ME_QUERY_KEY,
  useAcceptInviteByIdMutation,
  useClearNotificationMutation,
  useDeclineInviteByIdMutation,
  useMeQuery,
  useNotificationsQuery,
  useOrganizationsQuery,
  usePendingInvitesQuery,
  useSwitchOrganizationMutation,
} from '@web/lib/api/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@web/lib/routes';
import { cn } from '@web/lib/utils';
import { toast } from 'sonner';
import { Bell, Check, LogOut, Plus, X } from 'lucide-react';
import * as React from 'react';
import { CreateOrganizationDialog } from '@web/components/organizations/create-organization-dialog';
import { ThemeToggle } from './theme-toggle';
import { ColorSchemeToggle } from './color-scheme-toggle';
import { Separator } from '@web/components/ui/separator';
import type { UserView } from '@repo/types';

const authItems = [
  { href: ROUTES.signin, label: 'Sign in', primary: false },
  { href: ROUTES.signup, label: 'Sign up', primary: true },
] as const;

type SecondaryNavVariant = 'bar' | 'drawer';

function userDisplayInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function UserAccountMenu({
  user,
  variant,
  onLogout,
}: {
  user: UserView;
  variant: SecondaryNavVariant;
  onLogout: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const initials = userDisplayInitials(user.name);
  const closeAccountPopover =
    variant === 'bar' ? () => setOpen(false) : undefined;

  const infoBlock = (
    <>
      <p className="truncate text-sm font-medium leading-tight">{user.name}</p>
      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
    </>
  );

  const organizationSection = (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Organization</p>
      <OrganizationSwitcher
        enabled
        user={user}
        onSwitched={closeAccountPopover}
        className="w-full"
      />
      <CreateOrganizationDialog
        trigger={
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full justify-start gap-2 px-2"
            onClick={closeAccountPopover}
          >
            <Plus className="size-4 shrink-0" aria-hidden />
            New organization
          </Button>
        }
      />
    </div>
  );

  const logoutControl = (
    <Button
      type="button"
      variant="ghost"
      className="h-9 w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => {
        setOpen(false);
        onLogout();
      }}
    >
      <LogOut className="size-4 shrink-0" />
      Log out
    </Button>
  );

  if (variant === 'drawer') {
    return (
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">{infoBlock}</div>
        </div>
        {organizationSection}
        <Separator />
        <Button asChild variant="ghost" className="h-9 w-full justify-start">
          <Link href={ROUTES.profile}>Profile</Link>
        </Button>
        {logoutControl}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-full p-0"
          aria-label="Account menu"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            {initials}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1 space-y-1">{infoBlock}</div>
        </div>
        <Separator className="my-3" />
        {organizationSection}
        <Separator className="my-3" />
        <Button asChild variant="ghost" className="h-9 w-full justify-start">
          <Link
            href={ROUTES.profile}
            onClick={() => {
              setOpen(false);
            }}
          >
            Profile
          </Link>
        </Button>
        {logoutControl}
      </PopoverContent>
    </Popover>
  );
}

interface SecondaryNavProps {
  variant?: SecondaryNavVariant;
}

function OrganizationSwitcher({
  enabled,
  user,
  onSwitched,
  className,
}: {
  enabled: boolean;
  user: { orgId: string; organizationName: string };
  onSwitched?: () => void;
  className?: string;
}) {
  const organizationsQuery = useOrganizationsQuery(enabled);
  const switchOrganizationMutation = useSwitchOrganizationMutation();
  const router = useRouter();
  const [isSwitching, setIsSwitching] = React.useState(false);

  if (!enabled) return null;

  if (organizationsQuery.isLoading && !organizationsQuery.data) {
    return (
      <div className={cn('h-9 animate-pulse rounded-md bg-muted', className)} />
    );
  }

  const organizations = organizationsQuery.data ?? [];

  if (organizations.length === 0) {
    return (
      <div
        className={cn(
          'truncate text-sm font-medium text-muted-foreground',
          className,
        )}
      >
        {user.organizationName}
      </div>
    );
  }

  return (
    <>
      {isSwitching ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg">
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-medium">
              Switching organization...
            </span>
          </div>
        </div>
      ) : null}

      <select
        aria-label="Switch organization"
        className={cn(
          'h-9 rounded-md border border-border bg-background px-2 py-1 text-sm',
          className,
        )}
        disabled={
          organizationsQuery.isFetching ||
          switchOrganizationMutation.isPending ||
          isSwitching
        }
        value={user.orgId}
        onChange={(event) => {
          const nextOrganizationId = event.target.value;
          if (nextOrganizationId === user.orgId) return;

          setIsSwitching(true);

          void (async () => {
            try {
              await switchOrganizationMutation.mutateAsync(nextOrganizationId);
              toast.success('Organization switched');
              router.replace(ROUTES.dashboard);
              onSwitched?.();
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'Failed to switch organization',
              );
            } finally {
              setIsSwitching(false);
            }
          })();
        }}
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </select>
    </>
  );
}

function NotificationsPopover({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = React.useState(false);

  // Fetch while logged in so the bell badge and list are up to date before opening
  const invitesQuery = usePendingInvitesQuery(enabled);
  const notificationsQuery = useNotificationsQuery(enabled);

  const invites = invitesQuery.data ?? [];
  const notifications = notificationsQuery.data ?? [];

  const acceptMutation = useAcceptInviteByIdMutation();
  const declineMutation = useDeclineInviteByIdMutation();
  const clearMutation = useClearNotificationMutation();

  const busy =
    acceptMutation.isPending ||
    declineMutation.isPending ||
    clearMutation.isPending;

  const count = invites.length + notifications.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="size-4" />
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {count > 9 ? '9+' : count}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between px-1">
          <div className="text-sm font-medium">Notifications</div>
          {invitesQuery.isFetching || notificationsQuery.isFetching ? (
            <div className="text-xs text-muted-foreground">Loading…</div>
          ) : null}
        </div>

        <div className="mt-2 space-y-3">
          {/* Invites */}
          <div>
            <div className="px-1 text-xs font-medium text-muted-foreground">
              Invites
            </div>

            <div className="mt-1 flex flex-col gap-2">
              {invitesQuery.isError ? (
                <div className="rounded-md bg-muted px-2 py-2 text-xs text-muted-foreground">
                  Failed to load invites.
                </div>
              ) : invites.length === 0 ? (
                <div className="rounded-md bg-muted px-2 py-2 text-xs text-muted-foreground">
                  No pending invites.
                </div>
              ) : (
                invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-start justify-between gap-2 rounded-md border border-border bg-background px-2 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {invite.organizationName}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {invite.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={busy}
                        aria-label="Accept invite"
                        onClick={() => {
                          void (async () => {
                            try {
                              await acceptMutation.mutateAsync(invite.id);
                              toast.success('Invite accepted');
                              setOpen(false);
                            } catch (e) {
                              toast.error(
                                e instanceof Error
                                  ? e.message
                                  : 'Failed to accept invite',
                              );
                            }
                          })();
                        }}
                      >
                        <Check className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={busy}
                        aria-label="Decline invite"
                        onClick={() => {
                          void (async () => {
                            try {
                              await declineMutation.mutateAsync(invite.id);
                              toast.success('Invite declined');
                            } catch (e) {
                              toast.error(
                                e instanceof Error
                                  ? e.message
                                  : 'Failed to decline invite',
                              );
                            }
                          })();
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Task assignment notifications */}
          <div>
            <div className="px-1 text-xs font-medium text-muted-foreground">
              Activity
            </div>

            <div className="mt-1 flex flex-col gap-2">
              {notificationsQuery.isError ? (
                <div className="rounded-md bg-muted px-2 py-2 text-xs text-muted-foreground">
                  Failed to load notifications.
                </div>
              ) : notifications.length === 0 ? (
                <div className="rounded-md bg-muted px-2 py-2 text-xs text-muted-foreground">
                  No new notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start justify-between gap-2 rounded-md border border-border bg-background px-2 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {n.title}
                      </div>
                      {n.body ? (
                        <div className="truncate text-xs text-muted-foreground">
                          {n.body}
                        </div>
                      ) : null}
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={busy}
                      aria-label="Clear notification"
                      onClick={() => {
                        void (async () => {
                          try {
                            await clearMutation.mutateAsync(n.id);
                            toast.success('Notification cleared');
                          } catch (e) {
                            toast.error(
                              e instanceof Error
                                ? e.message
                                : 'Failed to clear notification',
                            );
                          }
                        })();
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SecondaryNav({
  variant = 'bar',
}: SecondaryNavVariant extends never ? never : SecondaryNavProps) {
  const { data: user, isPending } = useMeQuery();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isClientReady, setIsClientReady] = React.useState(false);

  React.useEffect(() => {
    setIsClientReady(true);
  }, []);

  const isAuthenticated = !!user;
  const showLoadingState = !isClientReady || isPending;

  const handleLogoutClick = () => {
    void logout();
    queryClient.setQueryData(ME_QUERY_KEY, null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (variant === 'drawer') {
    return (
      <>
        {showLoadingState ? (
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ColorSchemeToggle />
            </div>
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : isAuthenticated ? (
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ColorSchemeToggle />
            </div>
            <UserAccountMenu
              user={user}
              variant="drawer"
              onLogout={handleLogoutClick}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ColorSchemeToggle />
            </div>
            {authItems.map(({ href, label, primary }) => (
              <Link
                key={href}
                href={href}
                className={
                  primary
                    ? 'block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90'
                    : 'block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted'
                }
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <nav className="flex items-center gap-3" aria-label="Account">
      <ThemeToggle />
      <ColorSchemeToggle />
      {showLoadingState ? (
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      ) : isAuthenticated ? (
        <>
          <NotificationsPopover enabled={isAuthenticated} />
          <UserAccountMenu
            user={user}
            variant="bar"
            onLogout={handleLogoutClick}
          />
        </>
      ) : (
        authItems.map(({ href, label, primary }) =>
          primary ? (
            <Button key={href} asChild size="sm">
              <Link href={href}>{label}</Link>
            </Button>
          ) : (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ),
        )
      )}
    </nav>
  );
}
