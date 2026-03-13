"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";

import { inviteProjectMember } from "@web/lib/api/client";
import { PROJECT_MEMBERS_QUERY_KEY } from "@web/lib/api/queries";

import {
  InviteProjectMemberSchema,
  type InviteProjectMemberDto,
} from "@repo/types";

import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@web/components/ui/dialog";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";

type InviteMemberDialogProps = {
  projectId: string;
};

export function InviteMemberDialog({ projectId }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const inviteMemberMutation = useMutation({
    mutationFn: (values: InviteProjectMemberDto) =>
      inviteProjectMember(projectId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      reset({
        email: "",
        role: "MEMBER",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const onSubmit = (values: InviteProjectMemberDto) => {
    inviteMemberMutation.mutate(values);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteProjectMemberDto>({
    resolver: standardSchemaResolver(InviteProjectMemberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
    mode: "onBlur",
  });

  const role = watch("role");
  const submitting = isSubmitting || inviteMemberMutation.isPending;

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
            Add a teammate to this project and choose their access level.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="teammate@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setValue("role", value as InviteProjectMemberDto["role"], {
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
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {inviteMemberMutation.error && (
            <p className="text-sm text-destructive">
              {inviteMemberMutation.error.message || "Failed to invite member."}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending Invite..." : "Send Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
