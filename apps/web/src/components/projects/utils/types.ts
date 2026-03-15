import { ProjectRole } from "@repo/types";

export type ProjectTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export type MemberWithRole = {
  id: string;
  name: string;
  email?: string | null;
  role: ProjectRole;
};
