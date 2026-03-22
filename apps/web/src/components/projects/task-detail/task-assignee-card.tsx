'use client';

import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { Button } from '@web/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/select';

import type { ProjectDetailMember } from '@repo/types';
import { getInitials } from '../utils/string';
import { useAssignTaskUser } from '@web/lib/api/mutations/use-assign-task-user';
import { useUnassignTaskUser } from '@web/lib/api/mutations/use-unassign-task-user';

type TaskAssigneeCardProps = {
  projectId: string;
  taskId: string;
  assignee: { name: string; email: string } | null;
  assigneeUserId: string | null;
  members: ProjectDetailMember[];
  canEdit: boolean;
};

export function TaskAssigneeCard({
  projectId,
  taskId,
  assignee,
  assigneeUserId,
  members,
  canEdit,
}: TaskAssigneeCardProps) {
  const [selectKey, setSelectKey] = useState(0);
  const assignMutation = useAssignTaskUser(projectId);
  const unassignMutation = useUnassignTaskUser(projectId);

  const isBusy = assignMutation.isPending || unassignMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignee</CardTitle>
        <CardDescription>
          The person currently responsible for this task.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {assignee ? (
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
              {getInitials(assignee.name)}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium">{assignee.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {assignee.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            This task has not been assigned yet.
          </div>
        )}

        {canEdit ? (
          <div className="flex flex-col gap-2">
            <Select
              key={selectKey}
              disabled={isBusy}
              value={undefined}
              onValueChange={async (userId) => {
                // Immediately reset the Select back to placeholder
                setSelectKey((k) => k + 1);
                if (!userId || userId === assigneeUserId) return;
                // Replace behavior: remove old assignee then add new
                try {
                  if (assigneeUserId) {
                    await unassignMutation.mutateAsync({
                      taskId,
                      userId: assigneeUserId,
                    });
                  }
                  await assignMutation.mutateAsync({ taskId, userId });
                } catch {
                  // mutations already toast errors; nothing else needed here
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign to…" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {assigneeUserId ? (
              <Button
                variant="outline"
                disabled={isBusy}
                onClick={() =>
                  unassignMutation.mutate({ taskId, userId: assigneeUserId })
                }
              >
                Unassign
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
