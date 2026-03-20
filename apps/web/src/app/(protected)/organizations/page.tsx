"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Crown,
  LogOut,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Badge } from "@web/components/ui/badge";
import { Separator } from "@web/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@web/components/ui/dialog";
import { PageHeader } from "@web/components/projects";
import {
  UserSearchCombobox,
  type UserSearchResult,
} from "@web/components/projects/members";
import { CreateOrganizationDialog } from "@web/components/organizations/create-organization-dialog";
import {
  useDeleteOrganizationMutation,
  useAddOrganizationMemberMutation,
  useLeaveOrganizationMutation,
  useMeQuery,
  useOrganizationQuery,
  useOrganizationsQuery,
  useSwitchOrganizationMutation,
} from "@web/lib/api/queries";
import { ROUTES } from "@web/lib/routes";

type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER";

function getRoleBadgeVariant(role: OrganizationRole) {
  switch (role) {
    case "OWNER":
      return "default" as const;
    case "ADMIN":
      return "secondary" as const;
    case "MEMBER":
      return "outline" as const;
  }
}

function getRoleIcon(role: OrganizationRole) {
  switch (role) {
    case "OWNER":
      return <Crown className="h-4 w-4" />;
    case "ADMIN":
      return <ShieldCheck className="h-4 w-4" />;
    case "MEMBER":
      return <Users className="h-4 w-4" />;
  }
}

function formatJoinedAt(joinedAt: string) {
  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  open,
  onOpenChange,
  onConfirm,
  variant = "default",
  isPending = false,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  variant?: "default" | "destructive";
  isPending?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={async () => {
              try {
                await onConfirm();
                onOpenChange(false);
              } catch {
                // Caller handles the error state and toast.
              }
            }}
            disabled={isPending}
          >
            {isPending ? `${confirmLabel}...` : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrganizationDetailDialog({
  organizationId,
  open,
  onOpenChange,
  activeOrganizationId,
}: {
  organizationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeOrganizationId: string | null;
}) {
  const detailQuery = useOrganizationQuery(
    organizationId,
    open && !!organizationId,
  );
  const addMemberMutation = useAddOrganizationMemberMutation();
  const leaveOrganizationMutation = useLeaveOrganizationMutation();
  const deleteOrganizationMutation = useDeleteOrganizationMutation();

  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null,
  );

  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setSelectedUser(null);
    setLeaveConfirmOpen(false);
    setDeleteConfirmOpen(false);
  }, [organizationId]);

  const organization = detailQuery.data ?? null;
  const isActiveOrganization =
    !!organization && activeOrganizationId === organization.id;

  const canAddMembers =
    organization?.role === "OWNER" || organization?.role === "ADMIN";
  const canDelete = organization?.role === "OWNER";

  async function handleLeaveOrganization() {
    if (!organization) return;

    try {
      await leaveOrganizationMutation.mutateAsync(organization.id);
      toast.success(`Left ${organization.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to leave organization",
      );
      throw error;
    }
  }

  async function handleDeleteOrganization() {
    if (!organization) return;

    try {
      await deleteOrganizationMutation.mutateAsync(organization.id);
      toast.success(`Deleted ${organization.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete organization",
      );
      throw error;
    }
  }

  async function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!organization || !selectedUser) return;

    try {
      await addMemberMutation.mutateAsync({
        organizationId: organization.id,
        userId: selectedUser.id,
      });
      toast.success("Member added");
      setSelectedUser(null);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add member",
      );
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          onOpenChange(nextOpen);
          if (!nextOpen) {
            setSelectedUser(null);
            setLeaveConfirmOpen(false);
            setDeleteConfirmOpen(false);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Organization details</DialogTitle>
            <DialogDescription>
              View members and add existing users to this organization.
            </DialogDescription>
          </DialogHeader>

          {detailQuery.isPending ? (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              Loading organization details...
            </div>
          ) : detailQuery.isError || !organization ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              Failed to load organization details.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{organization.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Joined {formatJoinedAt(organization.joinedAt)}
                  </p>
                </div>

                <Badge
                  variant={getRoleBadgeVariant(organization.role)}
                  className="inline-flex items-center gap-1"
                >
                  {getRoleIcon(organization.role)}
                  {organization.role}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Members</h3>
                  <Badge variant="outline">{organization.members.length}</Badge>
                </div>

                <div className="space-y-3">
                  {organization.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-4 rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {member.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>

                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-medium">Add existing user</h3>
                  {canAddMembers ? (
                    <Badge variant="outline">Members can be added</Badge>
                  ) : (
                    <Badge variant="outline">Read only</Badge>
                  )}
                </div>

                {canAddMembers ? (
                  isActiveOrganization ? (
                    <form className="space-y-3" onSubmit={handleAddMember}>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`organization-user-search-${organization.id}`}
                        >
                          User
                        </Label>

                        <UserSearchCombobox
                          key={organization.id}
                          id={`organization-user-search-${organization.id}`}
                          scope="global"
                          value={selectedUser?.id}
                          onChange={(user) => {
                            setSelectedUser(user);
                          }}
                          selectedUserDisplay={selectedUser}
                          excludeUserIds={organization.members.map(
                            (member) => member.id,
                          )}
                          disabled={addMemberMutation.isPending}
                        />

                        {selectedUser ? (
                          <p className="text-sm text-muted-foreground">
                            Selected: {selectedUser.name} ({selectedUser.email})
                          </p>
                        ) : null}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={addMemberMutation.isPending || !selectedUser}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add member
                      </Button>
                    </form>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Switch to this organization first to add members to it.
                    </p>
                  )
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Only owners and admins can add members.
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Danger zone</h3>
                  <p className="text-xs text-muted-foreground">
                    {canDelete
                      ? "Delete this organization permanently. This cannot be undone."
                      : "Leave this organization and remove your membership."}
                  </p>
                </div>

                {canDelete ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(true)}
                    disabled={deleteOrganizationMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete organization
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setLeaveConfirmOpen(true)}
                    disabled={leaveOrganizationMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Leave organization
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={leaveConfirmOpen}
        onOpenChange={setLeaveConfirmOpen}
        title="Leave organization"
        description={
          organization
            ? `Are you sure you want to leave ${organization.name}?`
            : "Are you sure you want to leave this organization?"
        }
        confirmLabel="Leave organization"
        variant="destructive"
        isPending={leaveOrganizationMutation.isPending}
        onConfirm={handleLeaveOrganization}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete organization"
        description={
          organization
            ? `This will permanently delete ${organization.name}. This action cannot be undone.`
            : "This will permanently delete the organization. This action cannot be undone."
        }
        confirmLabel="Delete organization"
        variant="destructive"
        isPending={deleteOrganizationMutation.isPending}
        onConfirm={handleDeleteOrganization}
      />
    </>
  );
}

export default function OrganizationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const { data: me, isPending: isMePending } = useMeQuery();
  const organizationsQuery = useOrganizationsQuery(!!me);
  const switchOrganizationMutation = useSwitchOrganizationMutation();

  const activeOrganizationId = me?.orgId ?? null;

  const filteredOrganizations = useMemo(() => {
    const organizations = organizationsQuery.data ?? [];
    const q = search.trim().toLowerCase();

    if (!q) return organizations;

    return organizations.filter((organization) => {
      return (
        organization.name.toLowerCase().includes(q) ||
        organization.role.toLowerCase().includes(q)
      );
    });
  }, [organizationsQuery.data, search]);

  async function handleSwitch(organizationId: string) {
    try {
      await switchOrganizationMutation.mutateAsync(organizationId);
      toast.success("Organization switched");
      router.push(ROUTES.dashboard);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to switch organization",
      );
    }
  }

  const isLoading = isMePending || organizationsQuery.isPending;
  const isError = organizationsQuery.isError;

  return (
    <>
      <PageHeader
        backHref={ROUTES.dashboard}
        backLabel="Back to Dashboard"
        title="Organizations"
        description="Manage the organizations you belong to and add existing users to them."
        actions={
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-[420px]">
            <Label htmlFor="organization-search" className="sr-only">
              Search organizations
            </Label>
            <Input
              id="organization-search"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CreateOrganizationDialog />
          </div>
        }
      />

      <div className="space-y-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <h2 className="text-lg font-medium">Loading organizations</h2>
                <p className="text-sm text-muted-foreground">
                  Fetching your organization list...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <h2 className="text-lg font-medium">
                  Unable to load organizations
                </h2>
                <p className="text-sm text-muted-foreground">
                  Try refreshing the page or signing in again.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : filteredOrganizations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <h2 className="text-lg font-medium">No organizations found</h2>
                <p className="text-sm text-muted-foreground">
                  Try a different search or create a new organization.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredOrganizations.map((organization) => {
              const isCurrent = activeOrganizationId === organization.id;
              const isSwitching =
                switchOrganizationMutation.isPending &&
                switchOrganizationMutation.variables === organization.id;
              const canAddMembers =
                organization.role === "OWNER" || organization.role === "ADMIN";

              return (
                <Card
                  key={organization.id}
                  className={isCurrent ? "border-primary/40" : undefined}
                >
                  <CardHeader className="gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          <span>{organization.name}</span>
                        </CardTitle>
                        <CardDescription>
                          Joined {formatJoinedAt(organization.joinedAt)}
                        </CardDescription>
                      </div>

                      <Badge
                        variant={getRoleBadgeVariant(
                          organization.role as OrganizationRole,
                        )}
                        className="inline-flex items-center gap-1"
                      >
                        {getRoleIcon(organization.role as OrganizationRole)}
                        {organization.role}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">
                          {isCurrent
                            ? "Active organization"
                            : "Inactive organization"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isCurrent
                            ? "This is your current workspace."
                            : "Switch to make this your current workspace."}
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={() => handleSwitch(organization.id)}
                        disabled={isCurrent || isSwitching}
                      >
                        {isCurrent
                          ? "Current"
                          : isSwitching
                            ? "Switching..."
                            : "Switch"}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedOrgId(organization.id)}
                      >
                        View details
                      </Button>

                      {canAddMembers ? (
                        <Button
                          type="button"
                          onClick={() => setSelectedOrgId(organization.id)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add member
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <OrganizationDetailDialog
        organizationId={selectedOrgId}
        open={!!selectedOrgId}
        onOpenChange={(open) => {
          if (!open) setSelectedOrgId(null);
        }}
        activeOrganizationId={activeOrganizationId}
      />
    </>
  );
}
