"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
  UserSearchCombobox,
  type UserSearchResult,
} from "@web/components/projects/members";
import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@web/components/ui/dialog";
import { Label } from "@web/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";
import { addProjectMember } from "@web/lib/api/client";
import {
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
} from "@web/lib/api/queries";
import { AddProjectMemberSchema, type AddProjectMemberDto } from "@repo/types";

type InviteMemberDialogProps = {
  projectId: string;
  currentMemberIds: string[];
};

type AddMemberFormValues = {
  userId: string;
  role?: "ADMIN" | "MEMBER";
};

export function InviteMemberDialog({
  projectId,
  currentMemberIds,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null,
  );

  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: (dto: AddProjectMemberDto) => addProjectMember(projectId, dto),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      await queryClient.refetchQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });
      toast.success("Member added successfully!");
      reset({ userId: "", role: "MEMBER" });
      setSelectedUser(null);
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add member.");
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddMemberFormValues>({
    resolver: standardSchemaResolver(AddProjectMemberSchema),
    defaultValues: { userId: "", role: "MEMBER" },
    mode: "onBlur",
  });

  const role = watch("role");
  const userId = watch("userId");

  const onSubmit: SubmitHandler<AddMemberFormValues> = (values) => {
    addMemberMutation.mutate({
      userId: values.userId,
      role: values.role ?? "MEMBER",
    });
  };

  const submitting = isSubmitting || addMemberMutation.isPending;

  const errorMessage =
    errors.userId?.message ??
    errors.role?.message ??
    addMemberMutation.error?.message ??
    null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Search for a user and choose their access level for this project.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {errorMessage ? (
            <p
              className="text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="user-search">User</Label>

            <UserSearchCombobox
              id="user-search"
              value={userId}
              onChange={(user) => {
                setSelectedUser(user);
                setValue("userId", user.id, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              selectedUserDisplay={selectedUser}
              excludeUserIds={currentMemberIds}
              disabled={submitting}
            />

            {selectedUser ? (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedUser.name} ({selectedUser.email})
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setValue("role", value as AddProjectMemberDto["role"], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !userId}
          >
            {submitting ? "Adding..." : "Add Member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
