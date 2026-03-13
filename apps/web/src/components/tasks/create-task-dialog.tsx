"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@web/components/ui/dialog";

import { TaskForm } from "@web/components/tasks/task-form";

type CreateTaskDialogProps = {
  projectId: string;
};

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Add a new task to this project and keep work moving forward.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          projectId={projectId}
          onSuccess={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
