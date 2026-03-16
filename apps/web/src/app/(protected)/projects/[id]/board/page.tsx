"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Button } from "@web/components/ui/button";

type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
};

const columns: { key: TaskStatus; title: string }[] = [
  { key: "TODO", title: "Todo" },
  { key: "IN_PROGRESS", title: "In Progress" },
  { key: "REVIEW", title: "Review" },
  { key: "DONE", title: "Done" },
];

const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Setup project structure",
    description: "Create base folders and configs",
    status: "DONE",
    assignee: "Theo",
  },
  {
    id: "2",
    title: "Implement auth service",
    description: "JWT login + refresh tokens",
    status: "IN_PROGRESS",
    assignee: "Theo",
  },
  {
    id: "3",
    title: "Create project CRUD",
    description: "Projects controller/service/repo",
    status: "DONE",
    assignee: "Joel",
  },
  {
    id: "4",
    title: "Build task API",
    description: "Create tasks endpoints",
    status: "TODO",
    assignee: "Theo",
  },
  {
    id: "5",
    title: "Add task permissions",
    description: "Project role based access",
    status: "REVIEW",
    assignee: "Theo",
  },
  {
    id: "6",
    title: "Create board UI",
    description: "Kanban style layout",
    status: "TODO",
    assignee: "Theo",
  },
];

function groupTasks(tasks: Task[]) {
  const map: Record<TaskStatus, Task[]> = {
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  };

  for (const task of tasks) {
    map[task.status].push(task);
  }

  return map;
}

export default function ProjectBoardPage() {
  const grouped = groupTasks(dummyTasks);

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Project Board</h1>

        <Button>New Task</Button>
      </div>

      {/* Board */}

      <div className="grid grid-cols-4 gap-4 flex-1">
        {columns.map((column) => (
          <div
            key={column.key}
            className="flex flex-col gap-4 bg-muted/40 p-3 rounded-lg"
          >
            {/* Column Header */}

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                {column.title}
              </h2>

              <span className="text-xs text-muted-foreground">
                {grouped[column.key].length}
              </span>
            </div>

            {/* Tasks */}

            <div className="flex flex-col gap-3">
              {grouped[column.key].map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:bg-muted/60 transition"
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {task.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
                    <span>{task.description}</span>
                    {task.assignee && (
                      <span className="text-muted-foreground/70">
                        {task.assignee}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Task Button */}

            <Button variant="ghost" size="sm" className="justify-start">
              + Add Task
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
