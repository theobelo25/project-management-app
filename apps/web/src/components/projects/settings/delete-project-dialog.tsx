import { useEffect, useRef, useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@web/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@web/components/ui/dialog';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';

type DeleteProjectDialogProps = {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  canDeleteProject: boolean;
  projectName: string;
  deleteMutation: UseMutationResult<void, Error, void, unknown>;
};

export function DeleteProjectDialog({
  deleteDialogOpen,
  setDeleteDialogOpen,
  canDeleteProject,
  projectName,
  deleteMutation,
}: DeleteProjectDialogProps) {
  const [confirmValue, setConfirmValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isConfirmed = confirmValue.trim() === projectName.trim();

  useEffect(() => {
    if (!deleteDialogOpen) {
      setConfirmValue('');
      return;
    }
  }, [deleteDialogOpen]);

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          disabled={!canDeleteProject}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            This will permanently delete this project and all its tasks and
            data. This action cannot be undone. Type the project name below to
            confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="delete-confirm">
            Type{' '}
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(projectName);
                toast.success('Project name copied to clipboard');
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium underline decoration-muted-foreground/50 underline-offset-2 hover:decoration-muted-foreground hover:bg-muted/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
              <Copy className="h-3.5 w-3.5 shrink-0" />
              &quot;{projectName}&quot;
            </button>{' '}
            to confirm
          </Label>
          <Input
            id="delete-confirm"
            ref={inputRef}
            type="text"
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            placeholder={projectName}
            className="font-medium"
            disabled={deleteMutation.isPending}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={!isConfirmed || deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
