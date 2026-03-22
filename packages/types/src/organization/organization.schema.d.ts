import { z } from "zod";
export declare const CreateOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const CreateOrganizationInviteSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const AcceptOrganizationInviteSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export declare const AddOrganizationMemberSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export declare const OrganizationRoleSchema: z.ZodEnum<{
    OWNER: "OWNER";
    ADMIN: "ADMIN";
    MEMBER: "MEMBER";
}>;
export declare const UpdateOrganizationMemberRoleSchema: z.ZodObject<{
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>;
}, z.core.$strip>;
export declare const OrganizationInviteAdminViewSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    createdAt: z.ZodISODateTime;
    expiresAt: z.ZodISODateTime;
    acceptedAt: z.ZodNullable<z.ZodISODateTime>;
    revokedAt: z.ZodNullable<z.ZodISODateTime>;
    createdById: z.ZodString;
}, z.core.$strip>;
export declare const OrganizationInviteViewSchema: z.ZodObject<{
    inviteUrl: z.ZodString;
    email: z.ZodString;
    expiresAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const PendingInviteViewSchema: z.ZodObject<{
    id: z.ZodString;
    organizationName: z.ZodString;
    email: z.ZodString;
    expiresAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const OrganizationInvitesAdminListViewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        createdAt: z.ZodISODateTime;
        expiresAt: z.ZodISODateTime;
        acceptedAt: z.ZodNullable<z.ZodISODateTime>;
        revokedAt: z.ZodNullable<z.ZodISODateTime>;
        createdById: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const OrganizationViewSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>;
    joinedAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const OrganizationMemberViewSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>;
    joinedAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const PaginatedOrganizationMembersViewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            OWNER: "OWNER";
            ADMIN: "ADMIN";
            MEMBER: "MEMBER";
        }>;
        joinedAt: z.ZodISODateTime;
    }, z.core.$strip>>;
    page: z.ZodNumber;
    pageSize: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export declare const OrganizationSummaryViewSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>;
    joinedAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const OrganizationDetailViewSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>;
    joinedAt: z.ZodISODateTime;
    members: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<{
            OWNER: "OWNER";
            ADMIN: "ADMIN";
            MEMBER: "MEMBER";
        }>;
        joinedAt: z.ZodISODateTime;
    }, z.core.$strip>>;
}, z.core.$strip>;
