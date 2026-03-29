'use client';

import { useState } from 'react';

import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';

export type TaskComposerProps = {
  /** Called with trimmed title when the user submits. */
  onAdd: (title: string) => void;
};

/**
 * Small form-shaped example: controlled input + disabled submit until valid.
 * Kept in Storybook for portfolio-friendly interaction tests (not used in routes).
 */
export function TaskComposer({ onAdd }: TaskComposerProps) {
  const [title, setTitle] = useState('');

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="space-y-2">
        <Label htmlFor="task-title">Task title</Label>
        <Input
          id="task-title"
          value={title}
          placeholder="e.g. Add Storybook interaction tests"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <Button
        type="button"
        disabled={!title.trim()}
        onClick={() => onAdd(title.trim())}
      >
        Add task
      </Button>
    </div>
  );
}
