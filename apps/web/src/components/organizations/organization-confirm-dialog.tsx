'use client';

import { Button } from '@web/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@web/components/ui/dialog';

type OrganizationConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  variant?: 'default' | 'destructive';
  isPending?: boolean;
};

export function OrganizationConfirmDialog({
  title,
  description,
  confirmLabel,
  open,
  onOpenChange,
  onConfirm,
  variant = 'default',
  isPending = false,
}: OrganizationConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
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
