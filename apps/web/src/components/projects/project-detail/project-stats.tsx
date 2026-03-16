import { CheckCircle2, Circle, FolderKanban, Users } from "lucide-react";

import type { ProjectDetailMember } from "@repo/types";

import { StatCard } from "./stat-card";

export interface ProjectStatsProps {
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
  members: readonly ProjectDetailMember[];
}

export function ProjectStats({
  totalTasks,
  openTasks,
  completedTasks,
  members,
}: ProjectStatsProps) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Project statistics"
    >
      <StatCard
        title="Total Tasks"
        description="All tasks in this project"
        value={totalTasks}
        icon={<FolderKanban />}
      />
      <StatCard
        title="Open"
        description="Tasks still in progress"
        value={openTasks}
        icon={<Circle />}
      />
      <StatCard
        title="Completed"
        description="Finished tasks"
        value={completedTasks}
        icon={<CheckCircle2 />}
      />
      <StatCard
        title="Members"
        description="People in this project"
        value={members.length}
        icon={<Users />}
      />
    </section>
  );
}
