/**
 * Application-layer inputs — validated HTTP bodies map to these types at the controller.
 * They intentionally mirror `@repo/types` zod-inferred shapes without coupling to DTO classes.
 */
export type { CreateTaskDto as CreateTaskCommand } from '@repo/types';
export type { UpdateTaskInput as UpdateTaskCommand } from '@repo/types';
export type { FindTasksQuery as FindTasksQueryCommand } from '@repo/types';
