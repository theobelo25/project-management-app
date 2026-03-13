"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, UserPlus, Users } from "lucide-react";

import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Textarea } from "@web/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import {
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
  PROJECTS_QUERY_KEY,
  useProjectMembersQuery,
  useProjectQuery,
} from "@web/lib/api/queries";
import {
  archiveProject,
  removeProjectMember,
  unarchiveProject,
  updateProject,
} from "@web/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

type ProjectMember = {
  id: string;
  name: string;
  email: string;
  role: ProjectRole;
};

type ProjectSettings = {
  id: string;
  name: string;
  description: string | null;
  currentUserRole: ProjectRole;
  members: ProjectMember[];
};

function formatRole(role: ProjectRole | undefined) {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "MEMBER":
      return "Member";
    default:
      return role;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function ProjectSettingsPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;

  const { data: project, isLoading, isError, error } = useProjectQuery(id);
  const { data: membersData } = useProjectMembersQuery(id);

  const membersWithRole =
    project?.members && membersData?.items
      ? project.members.map((m) => {
          const roleItem = membersData.items.find((i) => i.userId === m.id);
          return {
            id: m.id,
            name: m.name,
            email: "email" in m ? (m as { email?: string }).email : undefined,
            role: roleItem?.role ?? ("MEMBER" as ProjectRole),
          };
        })
      : [];

  const canManageMembers =
    project?.currentUserRole === "OWNER" ||
    project?.currentUserRole === "ADMIN";

  const canDeleteProject = project?.currentUserRole === "OWNER";

  if (!id) return null;
  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12">Loading…</div>
      </div>
    );
  }
  if (isError || !project) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12 text-destructive">
          {error?.message ?? "Project not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href={`/projects/${project.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Project Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage project details, members, and administrative actions for{" "}
            <span className="font-medium">{project.name}</span>.
          </p>
        </div>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Update the basic information for this project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeneralForm
              projectId={project.id}
              defaultName={project.name}
              defaultDescription={project.description ?? ""}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Manage who has access to this project and what they can do.
              </CardDescription>
            </div>
            {canManageMembers ? (
              <Button type="button" variant="outline" size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {membersWithRole.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{member.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {member.email ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{formatRole(member.role)}</Badge>
                  {canManageMembers && member.role !== "OWNER" ? (
                    <RemoveMemberButton
                      projectId={project.id}
                      userId={member.id}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              These actions can permanently affect this project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-destructive/20 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Delete Project</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove this project and its associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!canDeleteProject}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </div>
              {!canDeleteProject ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Only the project owner can delete this project.
                </p>
              ) : null}
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Archive Project</p>
                  <p className="text-sm text-muted-foreground">
                    Hide this project from active views while keeping its data
                    available for later reference.
                  </p>
                </div>
                <ArchiveButton
                  projectId={project.id}
                  archivedAt={project.archivedAt}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Permissions Summary</CardTitle>
            <CardDescription>
              Your current access level for this project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">
                  {formatRole(project.currentUserRole)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.currentUserRole === "OWNER"
                    ? "You can manage settings, members, and destructive actions."
                    : project.currentUserRole === "ADMIN"
                      ? "You can manage members and update project details."
                      : "You can view project details but have limited administrative access."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GeneralForm({
  projectId,
  defaultName,
  defaultDescription,
}: {
  projectId: string;
  defaultName: string;
  defaultDescription: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (dto: { name?: string; description?: string | null }) =>
      updateProject(projectId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    updateMutation.mutate({ name, description: description || null });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>
        <Input id="name" name="name" defaultValue={defaultName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={defaultDescription}
          placeholder="Describe this project"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
      {updateMutation.error && (
        <p className="text-sm text-destructive">
          {updateMutation.error.message}
        </p>
      )}
    </form>
  );
}
function RemoveMemberButton({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const removeMutation = useMutation({
    mutationFn: () => removeProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
    },
  });
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => removeMutation.mutate()}
      disabled={removeMutation.isPending}
    >
      Remove
    </Button>
  );
}
function ArchiveButton({
  projectId,
  archivedAt,
}: {
  projectId: string;
  archivedAt: string | null;
}) {
  const queryClient = useQueryClient();
  const archiveMutation = useMutation({
    mutationFn: () => archiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
  const unarchiveMutation = useMutation({
    mutationFn: () => unarchiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
  if (archivedAt) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => unarchiveMutation.mutate()}
        disabled={unarchiveMutation.isPending}
      >
        Unarchive Project
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => archiveMutation.mutate()}
      disabled={archiveMutation.isPending}
    >
      Archive Project
    </Button>
  );
}
