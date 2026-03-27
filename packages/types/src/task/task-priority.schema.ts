import { z } from "zod";

export const TaskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
