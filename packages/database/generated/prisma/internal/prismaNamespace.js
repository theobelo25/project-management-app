"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.SortOrder = exports.UserNotificationScalarFieldEnum = exports.OrganizationInviteScalarFieldEnum = exports.OrganizationMembershipScalarFieldEnum = exports.OrganizationScalarFieldEnum = exports.TaskAssigneeScalarFieldEnum = exports.TaskScalarFieldEnum = exports.ProjectMemberScalarFieldEnum = exports.ProjectScalarFieldEnum = exports.RefreshTokenScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.4.2",
    engine: "94a226be1cf2967af2541cca5529f0f7ba866919"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    RefreshToken: 'RefreshToken',
    Project: 'Project',
    ProjectMember: 'ProjectMember',
    Task: 'Task',
    TaskAssignee: 'TaskAssignee',
    Organization: 'Organization',
    OrganizationMembership: 'OrganizationMembership',
    OrganizationInvite: 'OrganizationInvite',
    UserNotification: 'UserNotification'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    defaultOrganizationId: 'defaultOrganizationId',
    activeOrganizationId: 'activeOrganizationId'
};
exports.RefreshTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    tokenPrefix: 'tokenPrefix',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    replacedByTokenId: 'replacedByTokenId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProjectScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    ownerId: 'ownerId',
    archivedAt: 'archivedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    organizationId: 'organizationId'
};
exports.ProjectMemberScalarFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    userId: 'userId',
    role: 'role',
    createdAt: 'createdAt'
};
exports.TaskScalarFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    title: 'title',
    description: 'description',
    status: 'status',
    priority: 'priority',
    createdById: 'createdById',
    dueDate: 'dueDate',
    position: 'position',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
};
exports.TaskAssigneeScalarFieldEnum = {
    taskId: 'taskId',
    userId: 'userId',
    assignedAt: 'assignedAt'
};
exports.OrganizationScalarFieldEnum = {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.OrganizationMembershipScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    organizationId: 'organizationId',
    role: 'role',
    createdAt: 'createdAt'
};
exports.OrganizationInviteScalarFieldEnum = {
    id: 'id',
    organizationId: 'organizationId',
    email: 'email',
    tokenHash: 'tokenHash',
    tokenPrefix: 'tokenPrefix',
    expiresAt: 'expiresAt',
    acceptedAt: 'acceptedAt',
    revokedAt: 'revokedAt',
    createdById: 'createdById',
    createdAt: 'createdAt',
    userId: 'userId'
};
exports.UserNotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    body: 'body',
    meta: 'meta',
    createdAt: 'createdAt',
    clearedAt: 'clearedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map