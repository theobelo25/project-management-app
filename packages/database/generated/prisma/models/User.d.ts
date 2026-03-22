import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    passwordHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    defaultOrganizationId: string | null;
    activeOrganizationId: string | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    passwordHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    defaultOrganizationId: string | null;
    activeOrganizationId: string | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    name: number;
    passwordHash: number;
    createdAt: number;
    updatedAt: number;
    defaultOrganizationId: number;
    activeOrganizationId: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
    defaultOrganizationId?: true;
    activeOrganizationId?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
    defaultOrganizationId?: true;
    activeOrganizationId?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
    defaultOrganizationId?: true;
    activeOrganizationId?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    defaultOrganizationId: string | null;
    activeOrganizationId: string;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.UuidFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    defaultOrganizationId?: Prisma.UuidNullableFilter<"User"> | string | null;
    activeOrganizationId?: Prisma.UuidFilter<"User"> | string;
    refreshTokens?: Prisma.RefreshTokenListRelationFilter;
    ownedProjects?: Prisma.ProjectListRelationFilter;
    projectMembers?: Prisma.ProjectMemberListRelationFilter;
    createdTasks?: Prisma.TaskListRelationFilter;
    taskAssignees?: Prisma.TaskAssigneeListRelationFilter;
    tasks?: Prisma.TaskListRelationFilter;
    organizationMemberships?: Prisma.OrganizationMembershipListRelationFilter;
    defaultOrganization?: Prisma.XOR<Prisma.OrganizationNullableScalarRelationFilter, Prisma.OrganizationWhereInput> | null;
    activeOrganization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    createdInvites?: Prisma.OrganizationInviteListRelationFilter;
    organizationInvites?: Prisma.OrganizationInviteListRelationFilter;
    userNotifications?: Prisma.UserNotificationListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    defaultOrganizationId?: Prisma.SortOrderInput | Prisma.SortOrder;
    activeOrganizationId?: Prisma.SortOrder;
    refreshTokens?: Prisma.RefreshTokenOrderByRelationAggregateInput;
    ownedProjects?: Prisma.ProjectOrderByRelationAggregateInput;
    projectMembers?: Prisma.ProjectMemberOrderByRelationAggregateInput;
    createdTasks?: Prisma.TaskOrderByRelationAggregateInput;
    taskAssignees?: Prisma.TaskAssigneeOrderByRelationAggregateInput;
    tasks?: Prisma.TaskOrderByRelationAggregateInput;
    organizationMemberships?: Prisma.OrganizationMembershipOrderByRelationAggregateInput;
    defaultOrganization?: Prisma.OrganizationOrderByWithRelationInput;
    activeOrganization?: Prisma.OrganizationOrderByWithRelationInput;
    createdInvites?: Prisma.OrganizationInviteOrderByRelationAggregateInput;
    organizationInvites?: Prisma.OrganizationInviteOrderByRelationAggregateInput;
    userNotifications?: Prisma.UserNotificationOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    name?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    defaultOrganizationId?: Prisma.UuidNullableFilter<"User"> | string | null;
    activeOrganizationId?: Prisma.UuidFilter<"User"> | string;
    refreshTokens?: Prisma.RefreshTokenListRelationFilter;
    ownedProjects?: Prisma.ProjectListRelationFilter;
    projectMembers?: Prisma.ProjectMemberListRelationFilter;
    createdTasks?: Prisma.TaskListRelationFilter;
    taskAssignees?: Prisma.TaskAssigneeListRelationFilter;
    tasks?: Prisma.TaskListRelationFilter;
    organizationMemberships?: Prisma.OrganizationMembershipListRelationFilter;
    defaultOrganization?: Prisma.XOR<Prisma.OrganizationNullableScalarRelationFilter, Prisma.OrganizationWhereInput> | null;
    activeOrganization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    createdInvites?: Prisma.OrganizationInviteListRelationFilter;
    organizationInvites?: Prisma.OrganizationInviteListRelationFilter;
    userNotifications?: Prisma.UserNotificationListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    defaultOrganizationId?: Prisma.SortOrderInput | Prisma.SortOrder;
    activeOrganizationId?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    defaultOrganizationId?: Prisma.UuidNullableWithAggregatesFilter<"User"> | string | null;
    activeOrganizationId?: Prisma.UuidWithAggregatesFilter<"User"> | string;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    defaultOrganizationId?: Prisma.SortOrder;
    activeOrganizationId?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    defaultOrganizationId?: Prisma.SortOrder;
    activeOrganizationId?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    defaultOrganizationId?: Prisma.SortOrder;
    activeOrganizationId?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type UserListRelationFilter = {
    every?: Prisma.UserWhereInput;
    some?: Prisma.UserWhereInput;
    none?: Prisma.UserWhereInput;
};
export type UserOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRefreshTokensInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRefreshTokensInput;
    upsert?: Prisma.UserUpsertWithoutRefreshTokensInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutRefreshTokensInput, Prisma.UserUpdateWithoutRefreshTokensInput>, Prisma.UserUncheckedUpdateWithoutRefreshTokensInput>;
};
export type UserCreateNestedOneWithoutOwnedProjectsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOwnedProjectsInput, Prisma.UserUncheckedCreateWithoutOwnedProjectsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOwnedProjectsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutOwnedProjectsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOwnedProjectsInput, Prisma.UserUncheckedCreateWithoutOwnedProjectsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOwnedProjectsInput;
    upsert?: Prisma.UserUpsertWithoutOwnedProjectsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOwnedProjectsInput, Prisma.UserUpdateWithoutOwnedProjectsInput>, Prisma.UserUncheckedUpdateWithoutOwnedProjectsInput>;
};
export type UserCreateNestedOneWithoutProjectMembersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutProjectMembersInput, Prisma.UserUncheckedCreateWithoutProjectMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutProjectMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutProjectMembersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutProjectMembersInput, Prisma.UserUncheckedCreateWithoutProjectMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutProjectMembersInput;
    upsert?: Prisma.UserUpsertWithoutProjectMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutProjectMembersInput, Prisma.UserUpdateWithoutProjectMembersInput>, Prisma.UserUncheckedUpdateWithoutProjectMembersInput>;
};
export type UserCreateNestedOneWithoutCreatedTasksInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCreatedTasksInput, Prisma.UserUncheckedCreateWithoutCreatedTasksInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCreatedTasksInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTasksInput, Prisma.UserUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTasksInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCreatedTasksNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCreatedTasksInput, Prisma.UserUncheckedCreateWithoutCreatedTasksInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCreatedTasksInput;
    upsert?: Prisma.UserUpsertWithoutCreatedTasksInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCreatedTasksInput, Prisma.UserUpdateWithoutCreatedTasksInput>, Prisma.UserUncheckedUpdateWithoutCreatedTasksInput>;
};
export type UserUpdateOneWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTasksInput, Prisma.UserUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.UserUpsertWithoutTasksInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTasksInput, Prisma.UserUpdateWithoutTasksInput>, Prisma.UserUncheckedUpdateWithoutTasksInput>;
};
export type UserCreateNestedOneWithoutTaskAssigneesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTaskAssigneesInput, Prisma.UserUncheckedCreateWithoutTaskAssigneesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTaskAssigneesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutTaskAssigneesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTaskAssigneesInput, Prisma.UserUncheckedCreateWithoutTaskAssigneesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTaskAssigneesInput;
    upsert?: Prisma.UserUpsertWithoutTaskAssigneesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTaskAssigneesInput, Prisma.UserUpdateWithoutTaskAssigneesInput>, Prisma.UserUncheckedUpdateWithoutTaskAssigneesInput>;
};
export type UserCreateNestedManyWithoutDefaultOrganizationInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDefaultOrganizationInput, Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput> | Prisma.UserCreateWithoutDefaultOrganizationInput[] | Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput | Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput[];
    createMany?: Prisma.UserCreateManyDefaultOrganizationInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserCreateNestedManyWithoutActiveOrganizationInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutActiveOrganizationInput, Prisma.UserUncheckedCreateWithoutActiveOrganizationInput> | Prisma.UserCreateWithoutActiveOrganizationInput[] | Prisma.UserUncheckedCreateWithoutActiveOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutActiveOrganizationInput | Prisma.UserCreateOrConnectWithoutActiveOrganizationInput[];
    createMany?: Prisma.UserCreateManyActiveOrganizationInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUncheckedCreateNestedManyWithoutDefaultOrganizationInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDefaultOrganizationInput, Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput> | Prisma.UserCreateWithoutDefaultOrganizationInput[] | Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput | Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput[];
    createMany?: Prisma.UserCreateManyDefaultOrganizationInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUncheckedCreateNestedManyWithoutActiveOrganizationInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutActiveOrganizationInput, Prisma.UserUncheckedCreateWithoutActiveOrganizationInput> | Prisma.UserCreateWithoutActiveOrganizationInput[] | Prisma.UserUncheckedCreateWithoutActiveOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutActiveOrganizationInput | Prisma.UserCreateOrConnectWithoutActiveOrganizationInput[];
    createMany?: Prisma.UserCreateManyActiveOrganizationInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUpdateManyWithoutDefaultOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDefaultOrganizationInput, Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput> | Prisma.UserCreateWithoutDefaultOrganizationInput[] | Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput | Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutDefaultOrganizationInput | Prisma.UserUpsertWithWhereUniqueWithoutDefaultOrganizationInput[];
    createMany?: Prisma.UserCreateManyDefaultOrganizationInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutDefaultOrganizationInput | Prisma.UserUpdateWithWhereUniqueWithoutDefaultOrganizationInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutDefaultOrganizationInput | Prisma.UserUpdateManyWithWhereWithoutDefaultOrganizationInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserUpdateManyWithoutActiveOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutActiveOrganizationInput, Prisma.UserUncheckedCreateWithoutActiveOrganizationInput> | Prisma.UserCreateWithoutActiveOrganizationInput[] | Prisma.UserUncheckedCreateWithoutActiveOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutActiveOrganizationInput | Prisma.UserCreateOrConnectWithoutActiveOrganizationInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutActiveOrganizationInput | Prisma.UserUpsertWithWhereUniqueWithoutActiveOrganizationInput[];
    createMany?: Prisma.UserCreateManyActiveOrganizationInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutActiveOrganizationInput | Prisma.UserUpdateWithWhereUniqueWithoutActiveOrganizationInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutActiveOrganizationInput | Prisma.UserUpdateManyWithWhereWithoutActiveOrganizationInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserUncheckedUpdateManyWithoutDefaultOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDefaultOrganizationInput, Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput> | Prisma.UserCreateWithoutDefaultOrganizationInput[] | Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput | Prisma.UserCreateOrConnectWithoutDefaultOrganizationInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutDefaultOrganizationInput | Prisma.UserUpsertWithWhereUniqueWithoutDefaultOrganizationInput[];
    createMany?: Prisma.UserCreateManyDefaultOrganizationInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutDefaultOrganizationInput | Prisma.UserUpdateWithWhereUniqueWithoutDefaultOrganizationInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutDefaultOrganizationInput | Prisma.UserUpdateManyWithWhereWithoutDefaultOrganizationInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserUncheckedUpdateManyWithoutActiveOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutActiveOrganizationInput, Prisma.UserUncheckedCreateWithoutActiveOrganizationInput> | Prisma.UserCreateWithoutActiveOrganizationInput[] | Prisma.UserUncheckedCreateWithoutActiveOrganizationInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutActiveOrganizationInput | Prisma.UserCreateOrConnectWithoutActiveOrganizationInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutActiveOrganizationInput | Prisma.UserUpsertWithWhereUniqueWithoutActiveOrganizationInput[];
    createMany?: Prisma.UserCreateManyActiveOrganizationInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutActiveOrganizationInput | Prisma.UserUpdateWithWhereUniqueWithoutActiveOrganizationInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutActiveOrganizationInput | Prisma.UserUpdateManyWithWhereWithoutActiveOrganizationInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserCreateNestedOneWithoutOrganizationMembershipsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOrganizationMembershipsInput, Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOrganizationMembershipsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutOrganizationMembershipsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOrganizationMembershipsInput, Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOrganizationMembershipsInput;
    upsert?: Prisma.UserUpsertWithoutOrganizationMembershipsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOrganizationMembershipsInput, Prisma.UserUpdateWithoutOrganizationMembershipsInput>, Prisma.UserUncheckedUpdateWithoutOrganizationMembershipsInput>;
};
export type UserCreateNestedOneWithoutCreatedInvitesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCreatedInvitesInput, Prisma.UserUncheckedCreateWithoutCreatedInvitesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCreatedInvitesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutOrganizationInvitesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOrganizationInvitesInput, Prisma.UserUncheckedCreateWithoutOrganizationInvitesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOrganizationInvitesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCreatedInvitesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCreatedInvitesInput, Prisma.UserUncheckedCreateWithoutCreatedInvitesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCreatedInvitesInput;
    upsert?: Prisma.UserUpsertWithoutCreatedInvitesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCreatedInvitesInput, Prisma.UserUpdateWithoutCreatedInvitesInput>, Prisma.UserUncheckedUpdateWithoutCreatedInvitesInput>;
};
export type UserUpdateOneWithoutOrganizationInvitesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOrganizationInvitesInput, Prisma.UserUncheckedCreateWithoutOrganizationInvitesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOrganizationInvitesInput;
    upsert?: Prisma.UserUpsertWithoutOrganizationInvitesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOrganizationInvitesInput, Prisma.UserUpdateWithoutOrganizationInvitesInput>, Prisma.UserUncheckedUpdateWithoutOrganizationInvitesInput>;
};
export type UserCreateNestedOneWithoutUserNotificationsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUserNotificationsInput, Prisma.UserUncheckedCreateWithoutUserNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUserNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutUserNotificationsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUserNotificationsInput, Prisma.UserUncheckedCreateWithoutUserNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUserNotificationsInput;
    upsert?: Prisma.UserUpsertWithoutUserNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutUserNotificationsInput, Prisma.UserUpdateWithoutUserNotificationsInput>, Prisma.UserUncheckedUpdateWithoutUserNotificationsInput>;
};
export type UserCreateWithoutRefreshTokensInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
};
export type UserUpsertWithoutRefreshTokensInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutRefreshTokensInput, Prisma.UserUncheckedUpdateWithoutRefreshTokensInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutRefreshTokensInput, Prisma.UserUncheckedUpdateWithoutRefreshTokensInput>;
};
export type UserUpdateWithoutRefreshTokensInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutOwnedProjectsInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutOwnedProjectsInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutOwnedProjectsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOwnedProjectsInput, Prisma.UserUncheckedCreateWithoutOwnedProjectsInput>;
};
export type UserUpsertWithoutOwnedProjectsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOwnedProjectsInput, Prisma.UserUncheckedUpdateWithoutOwnedProjectsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOwnedProjectsInput, Prisma.UserUncheckedCreateWithoutOwnedProjectsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOwnedProjectsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOwnedProjectsInput, Prisma.UserUncheckedUpdateWithoutOwnedProjectsInput>;
};
export type UserUpdateWithoutOwnedProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutOwnedProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutProjectMembersInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutProjectMembersInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutProjectMembersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutProjectMembersInput, Prisma.UserUncheckedCreateWithoutProjectMembersInput>;
};
export type UserUpsertWithoutProjectMembersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutProjectMembersInput, Prisma.UserUncheckedUpdateWithoutProjectMembersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutProjectMembersInput, Prisma.UserUncheckedCreateWithoutProjectMembersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutProjectMembersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutProjectMembersInput, Prisma.UserUncheckedUpdateWithoutProjectMembersInput>;
};
export type UserUpdateWithoutProjectMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutProjectMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutCreatedTasksInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutCreatedTasksInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutCreatedTasksInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCreatedTasksInput, Prisma.UserUncheckedCreateWithoutCreatedTasksInput>;
};
export type UserCreateWithoutTasksInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTasksInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTasksInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTasksInput, Prisma.UserUncheckedCreateWithoutTasksInput>;
};
export type UserUpsertWithoutCreatedTasksInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCreatedTasksInput, Prisma.UserUncheckedUpdateWithoutCreatedTasksInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCreatedTasksInput, Prisma.UserUncheckedCreateWithoutCreatedTasksInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCreatedTasksInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCreatedTasksInput, Prisma.UserUncheckedUpdateWithoutCreatedTasksInput>;
};
export type UserUpdateWithoutCreatedTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutCreatedTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTasksInput, Prisma.UserUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTasksInput, Prisma.UserUncheckedCreateWithoutTasksInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTasksInput, Prisma.UserUncheckedUpdateWithoutTasksInput>;
};
export type UserUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTaskAssigneesInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTaskAssigneesInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTaskAssigneesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTaskAssigneesInput, Prisma.UserUncheckedCreateWithoutTaskAssigneesInput>;
};
export type UserUpsertWithoutTaskAssigneesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTaskAssigneesInput, Prisma.UserUncheckedUpdateWithoutTaskAssigneesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTaskAssigneesInput, Prisma.UserUncheckedCreateWithoutTaskAssigneesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTaskAssigneesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTaskAssigneesInput, Prisma.UserUncheckedUpdateWithoutTaskAssigneesInput>;
};
export type UserUpdateWithoutTaskAssigneesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTaskAssigneesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutDefaultOrganizationInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutDefaultOrganizationInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutDefaultOrganizationInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutDefaultOrganizationInput, Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput>;
};
export type UserCreateManyDefaultOrganizationInputEnvelope = {
    data: Prisma.UserCreateManyDefaultOrganizationInput | Prisma.UserCreateManyDefaultOrganizationInput[];
    skipDuplicates?: boolean;
};
export type UserCreateWithoutActiveOrganizationInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutActiveOrganizationInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutActiveOrganizationInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutActiveOrganizationInput, Prisma.UserUncheckedCreateWithoutActiveOrganizationInput>;
};
export type UserCreateManyActiveOrganizationInputEnvelope = {
    data: Prisma.UserCreateManyActiveOrganizationInput | Prisma.UserCreateManyActiveOrganizationInput[];
    skipDuplicates?: boolean;
};
export type UserUpsertWithWhereUniqueWithoutDefaultOrganizationInput = {
    where: Prisma.UserWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserUpdateWithoutDefaultOrganizationInput, Prisma.UserUncheckedUpdateWithoutDefaultOrganizationInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutDefaultOrganizationInput, Prisma.UserUncheckedCreateWithoutDefaultOrganizationInput>;
};
export type UserUpdateWithWhereUniqueWithoutDefaultOrganizationInput = {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutDefaultOrganizationInput, Prisma.UserUncheckedUpdateWithoutDefaultOrganizationInput>;
};
export type UserUpdateManyWithWhereWithoutDefaultOrganizationInput = {
    where: Prisma.UserScalarWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyWithoutDefaultOrganizationInput>;
};
export type UserScalarWhereInput = {
    AND?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    OR?: Prisma.UserScalarWhereInput[];
    NOT?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    id?: Prisma.UuidFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    defaultOrganizationId?: Prisma.UuidNullableFilter<"User"> | string | null;
    activeOrganizationId?: Prisma.UuidFilter<"User"> | string;
};
export type UserUpsertWithWhereUniqueWithoutActiveOrganizationInput = {
    where: Prisma.UserWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserUpdateWithoutActiveOrganizationInput, Prisma.UserUncheckedUpdateWithoutActiveOrganizationInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutActiveOrganizationInput, Prisma.UserUncheckedCreateWithoutActiveOrganizationInput>;
};
export type UserUpdateWithWhereUniqueWithoutActiveOrganizationInput = {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutActiveOrganizationInput, Prisma.UserUncheckedUpdateWithoutActiveOrganizationInput>;
};
export type UserUpdateManyWithWhereWithoutActiveOrganizationInput = {
    where: Prisma.UserScalarWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyWithoutActiveOrganizationInput>;
};
export type UserCreateWithoutOrganizationMembershipsInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutOrganizationMembershipsInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutOrganizationMembershipsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOrganizationMembershipsInput, Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput>;
};
export type UserUpsertWithoutOrganizationMembershipsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOrganizationMembershipsInput, Prisma.UserUncheckedUpdateWithoutOrganizationMembershipsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOrganizationMembershipsInput, Prisma.UserUncheckedCreateWithoutOrganizationMembershipsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOrganizationMembershipsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOrganizationMembershipsInput, Prisma.UserUncheckedUpdateWithoutOrganizationMembershipsInput>;
};
export type UserUpdateWithoutOrganizationMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutOrganizationMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutCreatedInvitesInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutCreatedInvitesInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutCreatedInvitesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCreatedInvitesInput, Prisma.UserUncheckedCreateWithoutCreatedInvitesInput>;
};
export type UserCreateWithoutOrganizationInvitesInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    userNotifications?: Prisma.UserNotificationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutOrganizationInvitesInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    userNotifications?: Prisma.UserNotificationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutOrganizationInvitesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOrganizationInvitesInput, Prisma.UserUncheckedCreateWithoutOrganizationInvitesInput>;
};
export type UserUpsertWithoutCreatedInvitesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCreatedInvitesInput, Prisma.UserUncheckedUpdateWithoutCreatedInvitesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCreatedInvitesInput, Prisma.UserUncheckedCreateWithoutCreatedInvitesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCreatedInvitesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCreatedInvitesInput, Prisma.UserUncheckedUpdateWithoutCreatedInvitesInput>;
};
export type UserUpdateWithoutCreatedInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutCreatedInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserUpsertWithoutOrganizationInvitesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOrganizationInvitesInput, Prisma.UserUncheckedUpdateWithoutOrganizationInvitesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOrganizationInvitesInput, Prisma.UserUncheckedCreateWithoutOrganizationInvitesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOrganizationInvitesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOrganizationInvitesInput, Prisma.UserUncheckedUpdateWithoutOrganizationInvitesInput>;
};
export type UserUpdateWithoutOrganizationInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutOrganizationInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutUserNotificationsInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutUserInput;
    defaultOrganization?: Prisma.OrganizationCreateNestedOneWithoutDefaultUsersInput;
    activeOrganization: Prisma.OrganizationCreateNestedOneWithoutActiveUsersInput;
    createdInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutUserNotificationsInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
    activeOrganizationId: string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    ownedProjects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOwnerInput;
    projectMembers?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutUserInput;
    createdTasks?: Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedCreateNestedManyWithoutUserInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutUserInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutUserNotificationsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutUserNotificationsInput, Prisma.UserUncheckedCreateWithoutUserNotificationsInput>;
};
export type UserUpsertWithoutUserNotificationsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutUserNotificationsInput, Prisma.UserUncheckedUpdateWithoutUserNotificationsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutUserNotificationsInput, Prisma.UserUncheckedCreateWithoutUserNotificationsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutUserNotificationsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutUserNotificationsInput, Prisma.UserUncheckedUpdateWithoutUserNotificationsInput>;
};
export type UserUpdateWithoutUserNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutUserNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyDefaultOrganizationInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    activeOrganizationId: string;
};
export type UserCreateManyActiveOrganizationInput = {
    id?: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    defaultOrganizationId?: string | null;
};
export type UserUpdateWithoutDefaultOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    activeOrganization?: Prisma.OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutDefaultOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateManyWithoutDefaultOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    activeOrganizationId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserUpdateWithoutActiveOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutUserNestedInput;
    defaultOrganization?: Prisma.OrganizationUpdateOneWithoutDefaultUsersNestedInput;
    createdInvites?: Prisma.OrganizationInviteUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutActiveOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    ownedProjects?: Prisma.ProjectUncheckedUpdateManyWithoutOwnerNestedInput;
    projectMembers?: Prisma.ProjectMemberUncheckedUpdateManyWithoutUserNestedInput;
    createdTasks?: Prisma.TaskUncheckedUpdateManyWithoutCreatedByNestedInput;
    taskAssignees?: Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutUserNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutUserNestedInput;
    createdInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput;
    userNotifications?: Prisma.UserNotificationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateManyWithoutActiveOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    defaultOrganizationId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type UserCountOutputType = {
    refreshTokens: number;
    ownedProjects: number;
    projectMembers: number;
    createdTasks: number;
    taskAssignees: number;
    tasks: number;
    organizationMemberships: number;
    createdInvites: number;
    organizationInvites: number;
    userNotifications: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs;
    ownedProjects?: boolean | UserCountOutputTypeCountOwnedProjectsArgs;
    projectMembers?: boolean | UserCountOutputTypeCountProjectMembersArgs;
    createdTasks?: boolean | UserCountOutputTypeCountCreatedTasksArgs;
    taskAssignees?: boolean | UserCountOutputTypeCountTaskAssigneesArgs;
    tasks?: boolean | UserCountOutputTypeCountTasksArgs;
    organizationMemberships?: boolean | UserCountOutputTypeCountOrganizationMembershipsArgs;
    createdInvites?: boolean | UserCountOutputTypeCountCreatedInvitesArgs;
    organizationInvites?: boolean | UserCountOutputTypeCountOrganizationInvitesArgs;
    userNotifications?: boolean | UserCountOutputTypeCountUserNotificationsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefreshTokenWhereInput;
};
export type UserCountOutputTypeCountOwnedProjectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectWhereInput;
};
export type UserCountOutputTypeCountProjectMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectMemberWhereInput;
};
export type UserCountOutputTypeCountCreatedTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
};
export type UserCountOutputTypeCountTaskAssigneesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskAssigneeWhereInput;
};
export type UserCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
};
export type UserCountOutputTypeCountOrganizationMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationMembershipWhereInput;
};
export type UserCountOutputTypeCountCreatedInvitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationInviteWhereInput;
};
export type UserCountOutputTypeCountOrganizationInvitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationInviteWhereInput;
};
export type UserCountOutputTypeCountUserNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserNotificationWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    defaultOrganizationId?: boolean;
    activeOrganizationId?: boolean;
    refreshTokens?: boolean | Prisma.User$refreshTokensArgs<ExtArgs>;
    ownedProjects?: boolean | Prisma.User$ownedProjectsArgs<ExtArgs>;
    projectMembers?: boolean | Prisma.User$projectMembersArgs<ExtArgs>;
    createdTasks?: boolean | Prisma.User$createdTasksArgs<ExtArgs>;
    taskAssignees?: boolean | Prisma.User$taskAssigneesArgs<ExtArgs>;
    tasks?: boolean | Prisma.User$tasksArgs<ExtArgs>;
    organizationMemberships?: boolean | Prisma.User$organizationMembershipsArgs<ExtArgs>;
    defaultOrganization?: boolean | Prisma.User$defaultOrganizationArgs<ExtArgs>;
    activeOrganization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdInvites?: boolean | Prisma.User$createdInvitesArgs<ExtArgs>;
    organizationInvites?: boolean | Prisma.User$organizationInvitesArgs<ExtArgs>;
    userNotifications?: boolean | Prisma.User$userNotificationsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    defaultOrganizationId?: boolean;
    activeOrganizationId?: boolean;
    defaultOrganization?: boolean | Prisma.User$defaultOrganizationArgs<ExtArgs>;
    activeOrganization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    defaultOrganizationId?: boolean;
    activeOrganizationId?: boolean;
    defaultOrganization?: boolean | Prisma.User$defaultOrganizationArgs<ExtArgs>;
    activeOrganization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    name?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    defaultOrganizationId?: boolean;
    activeOrganizationId?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "createdAt" | "updatedAt" | "defaultOrganizationId" | "activeOrganizationId", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    refreshTokens?: boolean | Prisma.User$refreshTokensArgs<ExtArgs>;
    ownedProjects?: boolean | Prisma.User$ownedProjectsArgs<ExtArgs>;
    projectMembers?: boolean | Prisma.User$projectMembersArgs<ExtArgs>;
    createdTasks?: boolean | Prisma.User$createdTasksArgs<ExtArgs>;
    taskAssignees?: boolean | Prisma.User$taskAssigneesArgs<ExtArgs>;
    tasks?: boolean | Prisma.User$tasksArgs<ExtArgs>;
    organizationMemberships?: boolean | Prisma.User$organizationMembershipsArgs<ExtArgs>;
    defaultOrganization?: boolean | Prisma.User$defaultOrganizationArgs<ExtArgs>;
    activeOrganization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdInvites?: boolean | Prisma.User$createdInvitesArgs<ExtArgs>;
    organizationInvites?: boolean | Prisma.User$organizationInvitesArgs<ExtArgs>;
    userNotifications?: boolean | Prisma.User$userNotificationsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    defaultOrganization?: boolean | Prisma.User$defaultOrganizationArgs<ExtArgs>;
    activeOrganization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    defaultOrganization?: boolean | Prisma.User$defaultOrganizationArgs<ExtArgs>;
    activeOrganization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[];
        ownedProjects: Prisma.$ProjectPayload<ExtArgs>[];
        projectMembers: Prisma.$ProjectMemberPayload<ExtArgs>[];
        createdTasks: Prisma.$TaskPayload<ExtArgs>[];
        taskAssignees: Prisma.$TaskAssigneePayload<ExtArgs>[];
        tasks: Prisma.$TaskPayload<ExtArgs>[];
        organizationMemberships: Prisma.$OrganizationMembershipPayload<ExtArgs>[];
        defaultOrganization: Prisma.$OrganizationPayload<ExtArgs> | null;
        activeOrganization: Prisma.$OrganizationPayload<ExtArgs>;
        createdInvites: Prisma.$OrganizationInvitePayload<ExtArgs>[];
        organizationInvites: Prisma.$OrganizationInvitePayload<ExtArgs>[];
        userNotifications: Prisma.$UserNotificationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
        defaultOrganizationId: string | null;
        activeOrganizationId: string;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    refreshTokens<T extends Prisma.User$refreshTokensArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    ownedProjects<T extends Prisma.User$ownedProjectsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$ownedProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    projectMembers<T extends Prisma.User$projectMembersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$projectMembersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    createdTasks<T extends Prisma.User$createdTasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$createdTasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    taskAssignees<T extends Prisma.User$taskAssigneesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$taskAssigneesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tasks<T extends Prisma.User$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    organizationMemberships<T extends Prisma.User$organizationMembershipsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$organizationMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    defaultOrganization<T extends Prisma.User$defaultOrganizationArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$defaultOrganizationArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    activeOrganization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdInvites<T extends Prisma.User$createdInvitesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$createdInvitesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    organizationInvites<T extends Prisma.User$organizationInvitesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$organizationInvitesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    userNotifications<T extends Prisma.User$userNotificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$userNotificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly defaultOrganizationId: Prisma.FieldRef<"User", 'String'>;
    readonly activeOrganizationId: Prisma.FieldRef<"User", 'String'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
    include?: Prisma.UserIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$refreshTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefreshTokenSelect<ExtArgs> | null;
    omit?: Prisma.RefreshTokenOmit<ExtArgs> | null;
    include?: Prisma.RefreshTokenInclude<ExtArgs> | null;
    where?: Prisma.RefreshTokenWhereInput;
    orderBy?: Prisma.RefreshTokenOrderByWithRelationInput | Prisma.RefreshTokenOrderByWithRelationInput[];
    cursor?: Prisma.RefreshTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefreshTokenScalarFieldEnum | Prisma.RefreshTokenScalarFieldEnum[];
};
export type User$ownedProjectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput | Prisma.ProjectOrderByWithRelationInput[];
    cursor?: Prisma.ProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectScalarFieldEnum | Prisma.ProjectScalarFieldEnum[];
};
export type User$projectMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
    where?: Prisma.ProjectMemberWhereInput;
    orderBy?: Prisma.ProjectMemberOrderByWithRelationInput | Prisma.ProjectMemberOrderByWithRelationInput[];
    cursor?: Prisma.ProjectMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectMemberScalarFieldEnum | Prisma.ProjectMemberScalarFieldEnum[];
};
export type User$createdTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskScalarFieldEnum | Prisma.TaskScalarFieldEnum[];
};
export type User$taskAssigneesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
    where?: Prisma.TaskAssigneeWhereInput;
    orderBy?: Prisma.TaskAssigneeOrderByWithRelationInput | Prisma.TaskAssigneeOrderByWithRelationInput[];
    cursor?: Prisma.TaskAssigneeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskAssigneeScalarFieldEnum | Prisma.TaskAssigneeScalarFieldEnum[];
};
export type User$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskScalarFieldEnum | Prisma.TaskScalarFieldEnum[];
};
export type User$organizationMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationMembershipSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationMembershipOmit<ExtArgs> | null;
    include?: Prisma.OrganizationMembershipInclude<ExtArgs> | null;
    where?: Prisma.OrganizationMembershipWhereInput;
    orderBy?: Prisma.OrganizationMembershipOrderByWithRelationInput | Prisma.OrganizationMembershipOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationMembershipScalarFieldEnum | Prisma.OrganizationMembershipScalarFieldEnum[];
};
export type User$defaultOrganizationArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where?: Prisma.OrganizationWhereInput;
};
export type User$createdInvitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    where?: Prisma.OrganizationInviteWhereInput;
    orderBy?: Prisma.OrganizationInviteOrderByWithRelationInput | Prisma.OrganizationInviteOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationInviteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationInviteScalarFieldEnum | Prisma.OrganizationInviteScalarFieldEnum[];
};
export type User$organizationInvitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    where?: Prisma.OrganizationInviteWhereInput;
    orderBy?: Prisma.OrganizationInviteOrderByWithRelationInput | Prisma.OrganizationInviteOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationInviteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationInviteScalarFieldEnum | Prisma.OrganizationInviteScalarFieldEnum[];
};
export type User$userNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
    where?: Prisma.UserNotificationWhereInput;
    orderBy?: Prisma.UserNotificationOrderByWithRelationInput | Prisma.UserNotificationOrderByWithRelationInput[];
    cursor?: Prisma.UserNotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserNotificationScalarFieldEnum | Prisma.UserNotificationScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
