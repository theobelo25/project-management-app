import { z } from "zod";
import { ProjectRoleSchema } from "./project-role.schema";
import { TaskStatusSchema } from "../task/task-status.schema";
import { ProjectsListMemberSchema } from "./project-list-response.schema";

export const ProjectDetailMemberSchema = ProjectsListMemberSchema.extend({
  email: z.email().optional(),
});

export const ProjectRecentTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: TaskStatusSchema,
});

export const ProjectDetailViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  ownerId: z.string(),
  archivedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  currentUserRole: ProjectRoleSchema.optional(),
  totalTasks: z.number().int().min(0),
  completedTasks: z.number().int().min(0),
  openTasks: z.number().int().min(0),
  members: z.array(ProjectDetailMemberSchema),
  recentTasks: z.array(ProjectRecentTaskSchema),
});

export type ProjectDetailMember = z.infer<typeof ProjectDetailMemberSchema>;
export type ProjectRecentTask = z.infer<typeof ProjectRecentTaskSchema>;
export type ProjectDetailView = z.infer<typeof ProjectDetailViewSchema>;
