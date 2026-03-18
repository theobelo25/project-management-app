"use client";
import Link from "next/link";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { logout } from "@web/lib/api/client";
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
} from "@web/lib/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ROUTES } from "@web/lib/routes";
import { toast } from "sonner";
import { Bell, Check, X } from "lucide-react";
import * as React from "react";
import { CreateOrganizationDialog } from "@web/components/organizations/create-organization-dialog";

const authItems = [
  { href: ROUTES.signin, label: "Sign in", primary: false },
  { href: ROUTES.signup, label: "Sign up", primary: true },
] as const;

type SecondaryNavVariant = "bar" | "drawer";

interface SecondaryNavProps {
  variant?: SecondaryNavVariant;
}

function OrganizationSwitcher({
  enabled,
  user,
}: {
  enabled: boolean;
  user: { orgId: string; organizationName: string };
}) {
  const organizationsQuery = useOrganizationsQuery(enabled);
  const switchOrganizationMutation = useSwitchOrganizationMutation();
  const router = useRouter();
  const [isSwitching, setIsSwitching] = React.useState(false);

  if (!enabled) return null;

  if (organizationsQuery.isLoading && !organizationsQuery.data) {
    return <div className="h-9 w-56 animate-pulse rounded-md bg-muted" />;
  }

  const organizations = organizationsQuery.data ?? [];

  if (organizations.length === 0) {
    return (
      <div className="max-w-[240px] truncate text-sm font-medium text-muted-foreground">
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
        className="h-9 max-w-[240px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        disabled={
          organizationsQuery.isFetching ||
          switchOrganizationMutation.isPending ||
          isSwitching
        }
        value={user.orgId}
        onChange={async (event) => {
          const nextOrganizationId = event.target.value;
          if (nextOrganizationId === user.orgId) return;

          setIsSwitching(true);

          try {
            await switchOrganizationMutation.mutateAsync(nextOrganizationId);
            toast.success("Organization switched");
            router.replace(ROUTES.dashboard);
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to switch organization",
            );
          } finally {
            setIsSwitching(false);
          }
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

  // Only fetch when opened
  const invitesQuery = usePendingInvitesQuery(enabled && open);
  const notificationsQuery = useNotificationsQuery(enabled && open);

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
              {count > 9 ? "9+" : count}
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
                        onClick={async () => {
                          try {
                            await acceptMutation.mutateAsync(invite.id);
                            toast.success("Invite accepted");
                            setOpen(false);
                          } catch (e) {
                            toast.error(
                              e instanceof Error
                                ? e.message
                                : "Failed to accept invite",
                            );
                          }
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
                        onClick={async () => {
                          try {
                            await declineMutation.mutateAsync(invite.id);
                            toast.success("Invite declined");
                          } catch (e) {
                            toast.error(
                              e instanceof Error
                                ? e.message
                                : "Failed to decline invite",
                            );
                          }
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
                      onClick={async () => {
                        try {
                          await clearMutation.mutateAsync(n.id);
                          toast.success("Notification cleared");
                        } catch (e) {
                          toast.error(
                            e instanceof Error
                              ? e.message
                              : "Failed to clear notification",
                          );
                        }
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
  variant = "bar",
}: SecondaryNavVariant extends never ? never : SecondaryNavProps) {
  const { data: user, isPending } = useMeQuery();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isAuthenticated = !!user;

  const handleLogoutClick = () => {
    logout();
    queryClient.setQueryData(ME_QUERY_KEY, null);
    toast.success("Logout successfull!");
    router.push("/");
  };

  if (variant === "drawer") {
    return (
      <>
        {isPending ? (
          <div className="h-10 animate-pulse rounded-lg bg-muted" />
        ) : isAuthenticated ? (
          <div className="flex flex-col gap-3">
            <OrganizationSwitcher enabled={isAuthenticated} user={user} />
            <CreateOrganizationDialog />
            <Button type="button" onClick={() => handleLogoutClick()}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            {authItems.map(({ href, label, primary }) => (
              <Link
                key={href}
                href={href}
                className={
                  primary
                    ? "block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    : "block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
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
      {isPending ? (
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      ) : isAuthenticated ? (
        <>
          <NotificationsPopover enabled={isAuthenticated} />
          <div className="flex items-center gap-2">
            <OrganizationSwitcher enabled={isAuthenticated} user={user} />
            <CreateOrganizationDialog />
          </div>
          <Button type="button" onClick={() => handleLogoutClick()}>
            Logout
          </Button>
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
