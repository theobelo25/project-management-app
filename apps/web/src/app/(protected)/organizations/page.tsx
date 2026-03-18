"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Crown,
  Mail,
  ShieldCheck,
  Trash2,
  UserMinus,
  Users,
} from "lucide-react";

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
  DialogTrigger,
} from "@web/components/ui/dialog";
import { Textarea } from "@web/components/ui/textarea";

type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER";

type OrganizationMember = {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  role: OrganizationRole;
  members: OrganizationMember[];
};

const initialOrganizations: Organization[] = [
  {
    id: "org_1",
    name: "Kenzerama Productions",
    slug: "kenzerama-productions",
    description: "Video production, client work, and internal planning.",
    role: "OWNER",
    members: [
      {
        id: "user_1",
        name: "Theo Belo",
        email: "theo@example.com",
        role: "OWNER",
      },
      {
        id: "user_2",
        name: "Kenzie Malone",
        email: "kenzie@example.com",
        role: "ADMIN",
      },
      {
        id: "user_3",
        name: "Joel",
        email: "joel@example.com",
        role: "MEMBER",
      },
    ],
  },
  {
    id: "org_2",
    name: "Client Success Team",
    slug: "client-success-team",
    description: "Shared workspace for production coordination.",
    role: "ADMIN",
    members: [
      {
        id: "user_1",
        name: "Theo Belo",
        email: "theo@example.com",
        role: "ADMIN",
      },
      {
        id: "user_4",
        name: "Sarah Ahmed",
        email: "sarah@example.com",
        role: "OWNER",
      },
      {
        id: "user_5",
        name: "Alex Kim",
        email: "alex@example.com",
        role: "MEMBER",
      },
    ],
  },
  {
    id: "org_3",
    name: "Open Source Guild",
    slug: "open-source-guild",
    description: "A shared org for side projects and experiments.",
    role: "MEMBER",
    members: [
      {
        id: "user_1",
        name: "Theo Belo",
        email: "theo@example.com",
        role: "MEMBER",
      },
      {
        id: "user_6",
        name: "Priya Patel",
        email: "priya@example.com",
        role: "OWNER",
      },
    ],
  },
];

function getRoleBadgeVariant(role: OrganizationRole) {
  switch (role) {
    case "OWNER":
      return "default";
    case "ADMIN":
      return "secondary";
    case "MEMBER":
      return "outline";
    default:
      return "outline";
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
    default:
      return <Users className="h-4 w-4" />;
  }
}

function canInvite(role: OrganizationRole) {
  return role === "OWNER" || role === "ADMIN";
}

function canDelete(role: OrganizationRole) {
  return role === "OWNER";
}

type InviteDialogProps = {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (organizationId: string, email: string, message: string) => void;
};

function InviteMemberDialog({
  organization,
  open,
  onOpenChange,
  onInvite,
}: InviteDialogProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    onInvite(organization.id, trimmedEmail, message.trim());
    setEmail("");
    setMessage("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Invite someone to join {organization.name}.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={`invite-email-${organization.id}`}>Email</Label>
            <Input
              id={`invite-email-${organization.id}`}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`invite-message-${organization.id}`}>
              Message <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id={`invite-message-${organization.id}`}
              placeholder="Join us in this organization..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Send invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  variant?: "default" | "destructive";
};

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  open,
  onOpenChange,
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] =
    useState<Organization[]>(initialOrganizations);

  const [search, setSearch] = useState("");
  const [inviteOrgId, setInviteOrgId] = useState<string | null>(null);
  const [leaveOrgId, setLeaveOrgId] = useState<string | null>(null);
  const [deleteOrgId, setDeleteOrgId] = useState<string | null>(null);

  const filteredOrganizations = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return organizations;

    return organizations.filter((org) => {
      return (
        org.name.toLowerCase().includes(q) ||
        org.slug.toLowerCase().includes(q) ||
        org.description?.toLowerCase().includes(q)
      );
    });
  }, [organizations, search]);

  function handleInvite(
    organizationId: string,
    email: string,
    _message: string,
  ) {
    const newMember: OrganizationMember = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role: "MEMBER",
    };

    setOrganizations((current) =>
      current.map((org) =>
        org.id === organizationId
          ? {
              ...org,
              members: [...org.members, newMember],
            }
          : org,
      ),
    );
  }

  function handleLeave(organizationId: string) {
    setOrganizations((current) =>
      current.filter((org) => org.id !== organizationId),
    );
  }

  function handleDelete(organizationId: string) {
    setOrganizations((current) =>
      current.filter((org) => org.id !== organizationId),
    );
  }

  const inviteOrganization =
    organizations.find((org) => org.id === inviteOrgId) ?? null;
  const leaveOrganization =
    organizations.find((org) => org.id === leaveOrgId) ?? null;
  const deleteOrganization =
    organizations.find((org) => org.id === deleteOrgId) ?? null;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Organizations
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage the organizations you belong to, invite members, and leave or
            delete organizations.
          </p>
        </div>

        <div className="w-full md:max-w-sm">
          <Label htmlFor="organization-search" className="sr-only">
            Search organizations
          </Label>
          <Input
            id="organization-search"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredOrganizations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <h2 className="text-lg font-medium">No organizations found</h2>
              <p className="text-sm text-muted-foreground">
                Try a different search or create your first organization later.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {filteredOrganizations.map((organization) => {
            const canManageInvites = canInvite(organization.role);
            const canOwnerDelete = canDelete(organization.role);

            return (
              <Card key={organization.id} className="h-full">
                <CardHeader className="gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        <span>{organization.name}</span>
                      </CardTitle>
                      <CardDescription>@{organization.slug}</CardDescription>
                    </div>

                    <Badge
                      variant={getRoleBadgeVariant(organization.role)}
                      className="inline-flex items-center gap-1"
                    >
                      {getRoleIcon(organization.role)}
                      {organization.role}
                    </Badge>
                  </div>

                  {organization.description ? (
                    <p className="text-sm text-muted-foreground">
                      {organization.description}
                    </p>
                  ) : null}
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Members</p>
                      <p className="text-sm text-muted-foreground">
                        {organization.members.length} total members
                      </p>
                    </div>

                    <Badge variant="outline">
                      {organization.members.length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Member list</h3>

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

                  <div className="flex flex-wrap gap-2">
                    {canManageInvites ? (
                      <Button onClick={() => setInviteOrgId(organization.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Invite member
                      </Button>
                    ) : null}

                    <Button
                      variant="outline"
                      onClick={() => setLeaveOrgId(organization.id)}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Leave organization
                    </Button>

                    {canOwnerDelete ? (
                      <Button
                        variant="destructive"
                        onClick={() => setDeleteOrgId(organization.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete organization
                      </Button>
                    ) : null}
                  </div>

                  {!canManageInvites ? (
                    <p className="text-xs text-muted-foreground">
                      Only organization owners and admins can invite members.
                    </p>
                  ) : null}

                  {!canOwnerDelete ? (
                    <p className="text-xs text-muted-foreground">
                      Only organization owners can delete an organization.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {inviteOrganization ? (
        <InviteMemberDialog
          organization={inviteOrganization}
          open={true}
          onOpenChange={(open) => {
            if (!open) setInviteOrgId(null);
          }}
          onInvite={handleInvite}
        />
      ) : null}

      {leaveOrganization ? (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setLeaveOrgId(null);
          }}
          title="Leave organization"
          description={`Are you sure you want to leave ${leaveOrganization.name}?`}
          confirmLabel="Leave"
          variant="destructive"
          onConfirm={() => handleLeave(leaveOrganization.id)}
        />
      ) : null}

      {deleteOrganization ? (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setDeleteOrgId(null);
          }}
          title="Delete organization"
          description={`This will permanently delete ${deleteOrganization.name}. This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => handleDelete(deleteOrganization.id)}
        />
      ) : null}
    </div>
  );
}
