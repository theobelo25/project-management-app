'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { TaskView } from '@repo/types';
import type { TaskForHeader } from './types';

type TaskDetailContextValue = {
  taskForHeader: TaskForHeader;
  setTaskForHeader: (projectId: string | null, task: TaskView | null) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
};

const TaskDetailContext = createContext<TaskDetailContextValue | null>(null);

export function TaskDetailProvider({ children }: { children: ReactNode }) {
  const [taskForHeader, setTaskForHeaderState] = useState<TaskForHeader>(null);
  const [editOpen, setEditOpen] = useState(false);

  const setTaskForHeader = useCallback(
    (projectId: string | null, task: TaskView | null) => {
      if (!projectId || !task) {
        setTaskForHeaderState(null);
        return;
      }
      setTaskForHeaderState({
        projectId,
        task: { title: task.title, status: task.status },
      });
    },
    [],
  );

  const setEditOpenStable = useCallback(
    (open: boolean) => setEditOpen(open),
    [],
  );

  const value: TaskDetailContextValue = {
    taskForHeader,
    setTaskForHeader,
    editOpen,
    setEditOpen: setEditOpenStable,
  };

  return (
    <TaskDetailContext.Provider value={value}>
      {children}
    </TaskDetailContext.Provider>
  );
}

export function useTaskDetail() {
  const ctx = useContext(TaskDetailContext);
  if (!ctx) {
    return {
      taskForHeader: null,
      setTaskForHeader: () => {},
      editOpen: false,
      setEditOpen: () => {},
    };
  }
  return ctx;
}
