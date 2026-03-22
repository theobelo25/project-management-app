import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type OrganizationModel = runtime.Types.Result.DefaultSelection<Prisma.$OrganizationPayload>;
export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null;
    _min: OrganizationMinAggregateOutputType | null;
    _max: OrganizationMaxAggregateOutputType | null;
};
export type OrganizationMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrganizationMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrganizationCountAggregateOutputType = {
    id: number;
    name: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type OrganizationMinAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrganizationMaxAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrganizationCountAggregateInputType = {
    id?: true;
    name?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type OrganizationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrganizationCountAggregateInputType;
    _min?: OrganizationMinAggregateInputType;
    _max?: OrganizationMaxAggregateInputType;
};
export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
    [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrganization[P]> : Prisma.GetScalarType<T[P], AggregateOrganization[P]>;
};
export type OrganizationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithAggregationInput | Prisma.OrganizationOrderByWithAggregationInput[];
    by: Prisma.OrganizationScalarFieldEnum[] | Prisma.OrganizationScalarFieldEnum;
    having?: Prisma.OrganizationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrganizationCountAggregateInputType | true;
    _min?: OrganizationMinAggregateInputType;
    _max?: OrganizationMaxAggregateInputType;
};
export type OrganizationGroupByOutputType = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    _count: OrganizationCountAggregateOutputType | null;
    _min: OrganizationMinAggregateOutputType | null;
    _max: OrganizationMaxAggregateOutputType | null;
};
type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrganizationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrganizationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrganizationGroupByOutputType[P]>;
}>>;
export type OrganizationWhereInput = {
    AND?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    OR?: Prisma.OrganizationWhereInput[];
    NOT?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    id?: Prisma.UuidFilter<"Organization"> | string;
    name?: Prisma.StringFilter<"Organization"> | string;
    createdAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    projects?: Prisma.ProjectListRelationFilter;
    organizationInvites?: Prisma.OrganizationInviteListRelationFilter;
    organizationMemberships?: Prisma.OrganizationMembershipListRelationFilter;
    defaultUsers?: Prisma.UserListRelationFilter;
    activeUsers?: Prisma.UserListRelationFilter;
};
export type OrganizationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    projects?: Prisma.ProjectOrderByRelationAggregateInput;
    organizationInvites?: Prisma.OrganizationInviteOrderByRelationAggregateInput;
    organizationMemberships?: Prisma.OrganizationMembershipOrderByRelationAggregateInput;
    defaultUsers?: Prisma.UserOrderByRelationAggregateInput;
    activeUsers?: Prisma.UserOrderByRelationAggregateInput;
};
export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    OR?: Prisma.OrganizationWhereInput[];
    NOT?: Prisma.OrganizationWhereInput | Prisma.OrganizationWhereInput[];
    name?: Prisma.StringFilter<"Organization"> | string;
    createdAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Organization"> | Date | string;
    projects?: Prisma.ProjectListRelationFilter;
    organizationInvites?: Prisma.OrganizationInviteListRelationFilter;
    organizationMemberships?: Prisma.OrganizationMembershipListRelationFilter;
    defaultUsers?: Prisma.UserListRelationFilter;
    activeUsers?: Prisma.UserListRelationFilter;
}, "id">;
export type OrganizationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.OrganizationCountOrderByAggregateInput;
    _max?: Prisma.OrganizationMaxOrderByAggregateInput;
    _min?: Prisma.OrganizationMinOrderByAggregateInput;
};
export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrganizationScalarWhereWithAggregatesInput | Prisma.OrganizationScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrganizationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrganizationScalarWhereWithAggregatesInput | Prisma.OrganizationScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Organization"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Organization"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Organization"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Organization"> | Date | string;
};
export type OrganizationCreateInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationUncheckedCreateInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserUncheckedCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserUncheckedCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUncheckedUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUncheckedUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationCreateManyInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrganizationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizationNullableScalarRelationFilter = {
    is?: Prisma.OrganizationWhereInput | null;
    isNot?: Prisma.OrganizationWhereInput | null;
};
export type OrganizationScalarRelationFilter = {
    is?: Prisma.OrganizationWhereInput;
    isNot?: Prisma.OrganizationWhereInput;
};
export type OrganizationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrganizationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrganizationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrganizationCreateNestedOneWithoutDefaultUsersInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutDefaultUsersInput, Prisma.OrganizationUncheckedCreateWithoutDefaultUsersInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutDefaultUsersInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationCreateNestedOneWithoutActiveUsersInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutActiveUsersInput, Prisma.OrganizationUncheckedCreateWithoutActiveUsersInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutActiveUsersInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneWithoutDefaultUsersNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutDefaultUsersInput, Prisma.OrganizationUncheckedCreateWithoutDefaultUsersInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutDefaultUsersInput;
    upsert?: Prisma.OrganizationUpsertWithoutDefaultUsersInput;
    disconnect?: Prisma.OrganizationWhereInput | boolean;
    delete?: Prisma.OrganizationWhereInput | boolean;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutDefaultUsersInput, Prisma.OrganizationUpdateWithoutDefaultUsersInput>, Prisma.OrganizationUncheckedUpdateWithoutDefaultUsersInput>;
};
export type OrganizationUpdateOneRequiredWithoutActiveUsersNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutActiveUsersInput, Prisma.OrganizationUncheckedCreateWithoutActiveUsersInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutActiveUsersInput;
    upsert?: Prisma.OrganizationUpsertWithoutActiveUsersInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutActiveUsersInput, Prisma.OrganizationUpdateWithoutActiveUsersInput>, Prisma.OrganizationUncheckedUpdateWithoutActiveUsersInput>;
};
export type OrganizationCreateNestedOneWithoutProjectsInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutProjectsInput, Prisma.OrganizationUncheckedCreateWithoutProjectsInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutProjectsInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutProjectsInput, Prisma.OrganizationUncheckedCreateWithoutProjectsInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutProjectsInput;
    upsert?: Prisma.OrganizationUpsertWithoutProjectsInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutProjectsInput, Prisma.OrganizationUpdateWithoutProjectsInput>, Prisma.OrganizationUncheckedUpdateWithoutProjectsInput>;
};
export type OrganizationCreateNestedOneWithoutOrganizationMembershipsInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationMembershipsInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationMembershipsInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutOrganizationMembershipsInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutOrganizationMembershipsNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationMembershipsInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationMembershipsInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutOrganizationMembershipsInput;
    upsert?: Prisma.OrganizationUpsertWithoutOrganizationMembershipsInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutOrganizationMembershipsInput, Prisma.OrganizationUpdateWithoutOrganizationMembershipsInput>, Prisma.OrganizationUncheckedUpdateWithoutOrganizationMembershipsInput>;
};
export type OrganizationCreateNestedOneWithoutOrganizationInvitesInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationInvitesInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationInvitesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutOrganizationInvitesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateOneRequiredWithoutOrganizationInvitesNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationInvitesInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationInvitesInput>;
    connectOrCreate?: Prisma.OrganizationCreateOrConnectWithoutOrganizationInvitesInput;
    upsert?: Prisma.OrganizationUpsertWithoutOrganizationInvitesInput;
    connect?: Prisma.OrganizationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OrganizationUpdateToOneWithWhereWithoutOrganizationInvitesInput, Prisma.OrganizationUpdateWithoutOrganizationInvitesInput>, Prisma.OrganizationUncheckedUpdateWithoutOrganizationInvitesInput>;
};
export type OrganizationCreateWithoutDefaultUsersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutOrganizationInput;
    activeUsers?: Prisma.UserCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutDefaultUsersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInput;
    activeUsers?: Prisma.UserUncheckedCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutDefaultUsersInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutDefaultUsersInput, Prisma.OrganizationUncheckedCreateWithoutDefaultUsersInput>;
};
export type OrganizationCreateWithoutActiveUsersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserCreateNestedManyWithoutDefaultOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutActiveUsersInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserUncheckedCreateNestedManyWithoutDefaultOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutActiveUsersInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutActiveUsersInput, Prisma.OrganizationUncheckedCreateWithoutActiveUsersInput>;
};
export type OrganizationUpsertWithoutDefaultUsersInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutDefaultUsersInput, Prisma.OrganizationUncheckedUpdateWithoutDefaultUsersInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutDefaultUsersInput, Prisma.OrganizationUncheckedCreateWithoutDefaultUsersInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutDefaultUsersInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutDefaultUsersInput, Prisma.OrganizationUncheckedUpdateWithoutDefaultUsersInput>;
};
export type OrganizationUpdateWithoutDefaultUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutOrganizationNestedInput;
    activeUsers?: Prisma.UserUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutDefaultUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInput;
    activeUsers?: Prisma.UserUncheckedUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationUpsertWithoutActiveUsersInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutActiveUsersInput, Prisma.OrganizationUncheckedUpdateWithoutActiveUsersInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutActiveUsersInput, Prisma.OrganizationUncheckedCreateWithoutActiveUsersInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutActiveUsersInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutActiveUsersInput, Prisma.OrganizationUncheckedUpdateWithoutActiveUsersInput>;
};
export type OrganizationUpdateWithoutActiveUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUpdateManyWithoutDefaultOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutActiveUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUncheckedUpdateManyWithoutDefaultOrganizationNestedInput;
};
export type OrganizationCreateWithoutProjectsInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutProjectsInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserUncheckedCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserUncheckedCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutProjectsInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutProjectsInput, Prisma.OrganizationUncheckedCreateWithoutProjectsInput>;
};
export type OrganizationUpsertWithoutProjectsInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutProjectsInput, Prisma.OrganizationUncheckedUpdateWithoutProjectsInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutProjectsInput, Prisma.OrganizationUncheckedCreateWithoutProjectsInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutProjectsInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutProjectsInput, Prisma.OrganizationUncheckedUpdateWithoutProjectsInput>;
};
export type OrganizationUpdateWithoutProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUncheckedUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUncheckedUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationCreateWithoutOrganizationMembershipsInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutOrganizationMembershipsInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserUncheckedCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserUncheckedCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutOrganizationMembershipsInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationMembershipsInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationMembershipsInput>;
};
export type OrganizationUpsertWithoutOrganizationMembershipsInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutOrganizationMembershipsInput, Prisma.OrganizationUncheckedUpdateWithoutOrganizationMembershipsInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationMembershipsInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationMembershipsInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutOrganizationMembershipsInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutOrganizationMembershipsInput, Prisma.OrganizationUncheckedUpdateWithoutOrganizationMembershipsInput>;
};
export type OrganizationUpdateWithoutOrganizationMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutOrganizationMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationInvites?: Prisma.OrganizationInviteUncheckedUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUncheckedUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUncheckedUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationCreateWithoutOrganizationInvitesInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationUncheckedCreateWithoutOrganizationInvitesInput = {
    id?: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutOrganizationInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedCreateNestedManyWithoutOrganizationInput;
    defaultUsers?: Prisma.UserUncheckedCreateNestedManyWithoutDefaultOrganizationInput;
    activeUsers?: Prisma.UserUncheckedCreateNestedManyWithoutActiveOrganizationInput;
};
export type OrganizationCreateOrConnectWithoutOrganizationInvitesInput = {
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationInvitesInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationInvitesInput>;
};
export type OrganizationUpsertWithoutOrganizationInvitesInput = {
    update: Prisma.XOR<Prisma.OrganizationUpdateWithoutOrganizationInvitesInput, Prisma.OrganizationUncheckedUpdateWithoutOrganizationInvitesInput>;
    create: Prisma.XOR<Prisma.OrganizationCreateWithoutOrganizationInvitesInput, Prisma.OrganizationUncheckedCreateWithoutOrganizationInvitesInput>;
    where?: Prisma.OrganizationWhereInput;
};
export type OrganizationUpdateToOneWithWhereWithoutOrganizationInvitesInput = {
    where?: Prisma.OrganizationWhereInput;
    data: Prisma.XOR<Prisma.OrganizationUpdateWithoutOrganizationInvitesInput, Prisma.OrganizationUncheckedUpdateWithoutOrganizationInvitesInput>;
};
export type OrganizationUpdateWithoutOrganizationInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationUncheckedUpdateWithoutOrganizationInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutOrganizationNestedInput;
    organizationMemberships?: Prisma.OrganizationMembershipUncheckedUpdateManyWithoutOrganizationNestedInput;
    defaultUsers?: Prisma.UserUncheckedUpdateManyWithoutDefaultOrganizationNestedInput;
    activeUsers?: Prisma.UserUncheckedUpdateManyWithoutActiveOrganizationNestedInput;
};
export type OrganizationCountOutputType = {
    projects: number;
    organizationInvites: number;
    organizationMemberships: number;
    defaultUsers: number;
    activeUsers: number;
};
export type OrganizationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    projects?: boolean | OrganizationCountOutputTypeCountProjectsArgs;
    organizationInvites?: boolean | OrganizationCountOutputTypeCountOrganizationInvitesArgs;
    organizationMemberships?: boolean | OrganizationCountOutputTypeCountOrganizationMembershipsArgs;
    defaultUsers?: boolean | OrganizationCountOutputTypeCountDefaultUsersArgs;
    activeUsers?: boolean | OrganizationCountOutputTypeCountActiveUsersArgs;
};
export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationCountOutputTypeSelect<ExtArgs> | null;
};
export type OrganizationCountOutputTypeCountProjectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectWhereInput;
};
export type OrganizationCountOutputTypeCountOrganizationInvitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationInviteWhereInput;
};
export type OrganizationCountOutputTypeCountOrganizationMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationMembershipWhereInput;
};
export type OrganizationCountOutputTypeCountDefaultUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type OrganizationCountOutputTypeCountActiveUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type OrganizationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    projects?: boolean | Prisma.Organization$projectsArgs<ExtArgs>;
    organizationInvites?: boolean | Prisma.Organization$organizationInvitesArgs<ExtArgs>;
    organizationMemberships?: boolean | Prisma.Organization$organizationMembershipsArgs<ExtArgs>;
    defaultUsers?: boolean | Prisma.Organization$defaultUsersArgs<ExtArgs>;
    activeUsers?: boolean | Prisma.Organization$activeUsersArgs<ExtArgs>;
    _count?: boolean | Prisma.OrganizationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["organization"]>;
export type OrganizationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["organization"]>;
export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["organization"]>;
export type OrganizationSelectScalar = {
    id?: boolean;
    name?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type OrganizationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["organization"]>;
export type OrganizationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    projects?: boolean | Prisma.Organization$projectsArgs<ExtArgs>;
    organizationInvites?: boolean | Prisma.Organization$organizationInvitesArgs<ExtArgs>;
    organizationMemberships?: boolean | Prisma.Organization$organizationMembershipsArgs<ExtArgs>;
    defaultUsers?: boolean | Prisma.Organization$defaultUsersArgs<ExtArgs>;
    activeUsers?: boolean | Prisma.Organization$activeUsersArgs<ExtArgs>;
    _count?: boolean | Prisma.OrganizationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $OrganizationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Organization";
    objects: {
        projects: Prisma.$ProjectPayload<ExtArgs>[];
        organizationInvites: Prisma.$OrganizationInvitePayload<ExtArgs>[];
        organizationMemberships: Prisma.$OrganizationMembershipPayload<ExtArgs>[];
        defaultUsers: Prisma.$UserPayload<ExtArgs>[];
        activeUsers: Prisma.$UserPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["organization"]>;
    composites: {};
};
export type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrganizationPayload, S>;
export type OrganizationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrganizationCountAggregateInputType | true;
};
export interface OrganizationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Organization'];
        meta: {
            name: 'Organization';
        };
    };
    findUnique<T extends OrganizationFindUniqueArgs>(args: Prisma.SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrganizationFindFirstArgs>(args?: Prisma.SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrganizationFindManyArgs>(args?: Prisma.SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrganizationCreateArgs>(args: Prisma.SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrganizationCreateManyArgs>(args?: Prisma.SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrganizationDeleteArgs>(args: Prisma.SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrganizationUpdateArgs>(args: Prisma.SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrganizationUpdateManyArgs>(args: Prisma.SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrganizationUpsertArgs>(args: Prisma.SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrganizationCountArgs>(args?: Prisma.Subset<T, OrganizationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrganizationCountAggregateOutputType> : number>;
    aggregate<T extends OrganizationAggregateArgs>(args: Prisma.Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>;
    groupBy<T extends OrganizationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrganizationGroupByArgs['orderBy'];
    } : {
        orderBy?: OrganizationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrganizationFieldRefs;
}
export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    projects<T extends Prisma.Organization$projectsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    organizationInvites<T extends Prisma.Organization$organizationInvitesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$organizationInvitesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    organizationMemberships<T extends Prisma.Organization$organizationMembershipsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$organizationMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    defaultUsers<T extends Prisma.Organization$defaultUsersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$defaultUsersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    activeUsers<T extends Prisma.Organization$activeUsersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Organization$activeUsersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrganizationFieldRefs {
    readonly id: Prisma.FieldRef<"Organization", 'String'>;
    readonly name: Prisma.FieldRef<"Organization", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Organization", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Organization", 'DateTime'>;
}
export type OrganizationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationScalarFieldEnum | Prisma.OrganizationScalarFieldEnum[];
};
export type OrganizationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationScalarFieldEnum | Prisma.OrganizationScalarFieldEnum[];
};
export type OrganizationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput | Prisma.OrganizationOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationScalarFieldEnum | Prisma.OrganizationScalarFieldEnum[];
};
export type OrganizationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationCreateInput, Prisma.OrganizationUncheckedCreateInput>;
};
export type OrganizationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrganizationCreateManyInput | Prisma.OrganizationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrganizationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    data: Prisma.OrganizationCreateManyInput | Prisma.OrganizationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrganizationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationUpdateInput, Prisma.OrganizationUncheckedUpdateInput>;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrganizationUpdateManyMutationInput, Prisma.OrganizationUncheckedUpdateManyInput>;
    where?: Prisma.OrganizationWhereInput;
    limit?: number;
};
export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationUpdateManyMutationInput, Prisma.OrganizationUncheckedUpdateManyInput>;
    where?: Prisma.OrganizationWhereInput;
    limit?: number;
};
export type OrganizationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationCreateInput, Prisma.OrganizationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrganizationUpdateInput, Prisma.OrganizationUncheckedUpdateInput>;
};
export type OrganizationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
    where: Prisma.OrganizationWhereUniqueInput;
};
export type OrganizationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationWhereInput;
    limit?: number;
};
export type Organization$projectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Organization$organizationInvitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Organization$organizationMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Organization$defaultUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Organization$activeUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrganizationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInclude<ExtArgs> | null;
};
export {};
