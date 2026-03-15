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

type CreateEntityDialogProps = {
  triggerLabel: string;
  dialogTitle: string;
  dialogDescription: string;
  children: (props: { onSuccess: () => void }) => React.ReactNode;
};

export function CreateEntityDialog({
  triggerLabel,
  dialogTitle,
  dialogDescription,
  children,
}: CreateEntityDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {children({ onSuccess: () => setOpen(false) })}
      </DialogContent>
    </Dialog>
  );
}
