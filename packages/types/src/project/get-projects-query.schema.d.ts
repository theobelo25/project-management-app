import { z } from "zod";
export declare const ProjectsFilterSchema: z.ZodEnum<{
    archived: "archived";
    all: "all";
    owned: "owned";
    member: "member";
}>;
export type ProjectsFilter = z.infer<typeof ProjectsFilterSchema>;
export declare const ProjectsSortSchema: z.ZodEnum<{
    "updated-desc": "updated-desc";
    "created-desc": "created-desc";
    "name-asc": "name-asc";
}>;
export type ProjectsSort = z.infer<typeof ProjectsSortSchema>;
export declare const GetProjectsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    includeArchived: z.ZodDefault<z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"true">, z.ZodLiteral<"false">]>, z.ZodTransform<boolean, boolean | "true" | "false">>>>;
    search: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    filter: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        archived: "archived";
        all: "all";
        owned: "owned";
        member: "member";
    }>>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        "updated-desc": "updated-desc";
        "created-desc": "created-desc";
        "name-asc": "name-asc";
    }>>>;
}, z.core.$strip>;
export type GetProjectsQueryDto = z.infer<typeof GetProjectsQuerySchema>;
