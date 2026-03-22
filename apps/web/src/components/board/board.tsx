'use client';

import { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { BoardColumn } from './board-column';
import { BoardCard } from './board-card';
import type { TaskStatus } from '@repo/types';

import type { BoardTask } from './types';

type BoardProps = {
  projectId: string;
  columns: { key: TaskStatus; title: string }[];
  grouped: Record<TaskStatus, BoardTask[]>;
  onMoveTask?: (taskId: string, newStatus: TaskStatus) => void;
};

export function Board({ projectId, columns, grouped, onMoveTask }: BoardProps) {
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as BoardTask | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const taskId = event.active.id as string;
      const overId = event.over?.id;
      if (!overId || !onMoveTask) return;
      const isValidStatus = columns.some((c) => c.key === overId);
      if (isValidStatus && typeof overId === 'string') {
        onMoveTask(taskId, overId as TaskStatus);
      }
    },
    [onMoveTask, columns],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="grid gap-4 flex-1"
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((column) => (
          <BoardColumn
            key={column.key}
            projectId={projectId}
            status={column.key}
            title={column.title}
            tasks={grouped[column.key] ?? []}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? <BoardCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
