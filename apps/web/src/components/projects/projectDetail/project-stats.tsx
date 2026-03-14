import { CheckCircle2, Circle, FolderKanban, Users } from "lucide-react";
import { StatCard } from "./stat-card";

export interface ProjectStatsProps {
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
  members: readonly unknown[] | { length: number };
}

export function ProjectStats({
  totalTasks,
  openTasks,
  completedTasks,
  members,
}: ProjectStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-4">
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
