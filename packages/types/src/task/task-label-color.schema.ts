import { z } from "zod";

export const TaskLabelColorSchema = z.enum([
  "NONE",
  "SLATE",
  "RED",
  "ORANGE",
  "AMBER",
  "GREEN",
  "BLUE",
  "VIOLET",
  "ROSE",
]);

export type TaskLabelColor = z.infer<typeof TaskLabelColorSchema>;
