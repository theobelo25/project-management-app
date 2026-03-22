import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ProjectModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectPayload>;
export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null;
    _min: ProjectMinAggregateOutputType | null;
    _max: ProjectMaxAggregateOutputType | null;
};
export type ProjectMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    ownerId: string | null;
    archivedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    organizationId: string | null;
};
export type ProjectMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    ownerId: string | null;
    archivedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    organizationId: string | null;
};
export type ProjectCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    ownerId: number;
    archivedAt: number;
    createdAt: number;
    updatedAt: number;
    organizationId: number;
    _all: number;
};
export type ProjectMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    ownerId?: true;
    archivedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    organizationId?: true;
};
export type ProjectMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    ownerId?: true;
    archivedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    organizationId?: true;
};
export type ProjectCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    ownerId?: true;
    archivedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    organizationId?: true;
    _all?: true;
};
export type ProjectAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput | Prisma.ProjectOrderByWithRelationInput[];
    cursor?: Prisma.ProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProjectCountAggregateInputType;
    _min?: ProjectMinAggregateInputType;
    _max?: ProjectMaxAggregateInputType;
};
export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
    [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProject[P]> : Prisma.GetScalarType<T[P], AggregateProject[P]>;
};
export type ProjectGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithAggregationInput | Prisma.ProjectOrderByWithAggregationInput[];
    by: Prisma.ProjectScalarFieldEnum[] | Prisma.ProjectScalarFieldEnum;
    having?: Prisma.ProjectScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectCountAggregateInputType | true;
    _min?: ProjectMinAggregateInputType;
    _max?: ProjectMaxAggregateInputType;
};
export type ProjectGroupByOutputType = {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    archivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    _count: ProjectCountAggregateOutputType | null;
    _min: ProjectMinAggregateOutputType | null;
    _max: ProjectMaxAggregateOutputType | null;
};
type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectGroupByOutputType[P]>;
}>>;
export type ProjectWhereInput = {
    AND?: Prisma.ProjectWhereInput | Prisma.ProjectWhereInput[];
    OR?: Prisma.ProjectWhereInput[];
    NOT?: Prisma.ProjectWhereInput | Prisma.ProjectWhereInput[];
    id?: Prisma.UuidFilter<"Project"> | string;
    name?: Prisma.StringFilter<"Project"> | string;
    description?: Prisma.StringNullableFilter<"Project"> | string | null;
    ownerId?: Prisma.UuidFilter<"Project"> | string;
    archivedAt?: Prisma.DateTimeNullableFilter<"Project"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Project"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Project"> | Date | string;
    organizationId?: Prisma.UuidFilter<"Project"> | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.ProjectMemberListRelationFilter;
    tasks?: Prisma.TaskListRelationFilter;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
};
export type ProjectOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    archivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    owner?: Prisma.UserOrderByWithRelationInput;
    members?: Prisma.ProjectMemberOrderByRelationAggregateInput;
    tasks?: Prisma.TaskOrderByRelationAggregateInput;
    organization?: Prisma.OrganizationOrderByWithRelationInput;
};
export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ProjectWhereInput | Prisma.ProjectWhereInput[];
    OR?: Prisma.ProjectWhereInput[];
    NOT?: Prisma.ProjectWhereInput | Prisma.ProjectWhereInput[];
    name?: Prisma.StringFilter<"Project"> | string;
    description?: Prisma.StringNullableFilter<"Project"> | string | null;
    ownerId?: Prisma.UuidFilter<"Project"> | string;
    archivedAt?: Prisma.DateTimeNullableFilter<"Project"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Project"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Project"> | Date | string;
    organizationId?: Prisma.UuidFilter<"Project"> | string;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.ProjectMemberListRelationFilter;
    tasks?: Prisma.TaskListRelationFilter;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
}, "id">;
export type ProjectOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    archivedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    _count?: Prisma.ProjectCountOrderByAggregateInput;
    _max?: Prisma.ProjectMaxOrderByAggregateInput;
    _min?: Prisma.ProjectMinOrderByAggregateInput;
};
export type ProjectScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectScalarWhereWithAggregatesInput | Prisma.ProjectScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectScalarWhereWithAggregatesInput | Prisma.ProjectScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Project"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Project"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Project"> | string | null;
    ownerId?: Prisma.UuidWithAggregatesFilter<"Project"> | string;
    archivedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Project"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Project"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Project"> | Date | string;
    organizationId?: Prisma.UuidWithAggregatesFilter<"Project"> | string;
};
export type ProjectCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedProjectsInput;
    members?: Prisma.ProjectMemberCreateNestedManyWithoutProjectInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutProjectInput;
    organization: Prisma.OrganizationCreateNestedOneWithoutProjectsInput;
};
export type ProjectUncheckedCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    ownerId: string;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationId: string;
    members?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutProjectInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutProjectInput;
};
export type ProjectUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedProjectsNestedInput;
    members?: Prisma.ProjectMemberUpdateManyWithoutProjectNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutProjectNestedInput;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutProjectsNestedInput;
};
export type ProjectUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    members?: Prisma.ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutProjectNestedInput;
};
export type ProjectCreateManyInput = {
    id?: string;
    name: string;
    description?: string | null;
    ownerId: string;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationId: string;
};
export type ProjectUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectListRelationFilter = {
    every?: Prisma.ProjectWhereInput;
    some?: Prisma.ProjectWhereInput;
    none?: Prisma.ProjectWhereInput;
};
export type ProjectOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    archivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
};
export type ProjectMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    archivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
};
export type ProjectMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    archivedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
};
export type ProjectScalarRelationFilter = {
    is?: Prisma.ProjectWhereInput;
    isNot?: Prisma.ProjectWhereInput;
};
export type ProjectCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOwnerInput, Prisma.ProjectUncheckedCreateWithoutOwnerInput> | Prisma.ProjectCreateWithoutOwnerInput[] | Prisma.ProjectUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOwnerInput | Prisma.ProjectCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.ProjectCreateManyOwnerInputEnvelope;
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
};
export type ProjectUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOwnerInput, Prisma.ProjectUncheckedCreateWithoutOwnerInput> | Prisma.ProjectCreateWithoutOwnerInput[] | Prisma.ProjectUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOwnerInput | Prisma.ProjectCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.ProjectCreateManyOwnerInputEnvelope;
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
};
export type ProjectUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOwnerInput, Prisma.ProjectUncheckedCreateWithoutOwnerInput> | Prisma.ProjectCreateWithoutOwnerInput[] | Prisma.ProjectUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOwnerInput | Prisma.ProjectCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.ProjectUpsertWithWhereUniqueWithoutOwnerInput | Prisma.ProjectUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.ProjectCreateManyOwnerInputEnvelope;
    set?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    disconnect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    delete?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    update?: Prisma.ProjectUpdateWithWhereUniqueWithoutOwnerInput | Prisma.ProjectUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.ProjectUpdateManyWithWhereWithoutOwnerInput | Prisma.ProjectUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.ProjectScalarWhereInput | Prisma.ProjectScalarWhereInput[];
};
export type ProjectUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOwnerInput, Prisma.ProjectUncheckedCreateWithoutOwnerInput> | Prisma.ProjectCreateWithoutOwnerInput[] | Prisma.ProjectUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOwnerInput | Prisma.ProjectCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.ProjectUpsertWithWhereUniqueWithoutOwnerInput | Prisma.ProjectUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.ProjectCreateManyOwnerInputEnvelope;
    set?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    disconnect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    delete?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    update?: Prisma.ProjectUpdateWithWhereUniqueWithoutOwnerInput | Prisma.ProjectUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.ProjectUpdateManyWithWhereWithoutOwnerInput | Prisma.ProjectUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.ProjectScalarWhereInput | Prisma.ProjectScalarWhereInput[];
};
export type ProjectCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutMembersInput, Prisma.ProjectUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutMembersInput;
    connect?: Prisma.ProjectWhereUniqueInput;
};
export type ProjectUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutMembersInput, Prisma.ProjectUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.ProjectUpsertWithoutMembersInput;
    connect?: Prisma.ProjectWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProjectUpdateToOneWithWhereWithoutMembersInput, Prisma.ProjectUpdateWithoutMembersInput>, Prisma.ProjectUncheckedUpdateWithoutMembersInput>;
};
export type ProjectCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutTasksInput, Prisma.ProjectUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutTasksInput;
    connect?: Prisma.ProjectWhereUniqueInput;
};
export type ProjectUpdateOneRequiredWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutTasksInput, Prisma.ProjectUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.ProjectUpsertWithoutTasksInput;
    connect?: Prisma.ProjectWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ProjectUpdateToOneWithWhereWithoutTasksInput, Prisma.ProjectUpdateWithoutTasksInput>, Prisma.ProjectUncheckedUpdateWithoutTasksInput>;
};
export type ProjectCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOrganizationInput, Prisma.ProjectUncheckedCreateWithoutOrganizationInput> | Prisma.ProjectCreateWithoutOrganizationInput[] | Prisma.ProjectUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOrganizationInput | Prisma.ProjectCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.ProjectCreateManyOrganizationInputEnvelope;
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
};
export type ProjectUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOrganizationInput, Prisma.ProjectUncheckedCreateWithoutOrganizationInput> | Prisma.ProjectCreateWithoutOrganizationInput[] | Prisma.ProjectUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOrganizationInput | Prisma.ProjectCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.ProjectCreateManyOrganizationInputEnvelope;
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
};
export type ProjectUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOrganizationInput, Prisma.ProjectUncheckedCreateWithoutOrganizationInput> | Prisma.ProjectCreateWithoutOrganizationInput[] | Prisma.ProjectUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOrganizationInput | Prisma.ProjectCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.ProjectUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.ProjectUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.ProjectCreateManyOrganizationInputEnvelope;
    set?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    disconnect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    delete?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    update?: Prisma.ProjectUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.ProjectUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.ProjectUpdateManyWithWhereWithoutOrganizationInput | Prisma.ProjectUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.ProjectScalarWhereInput | Prisma.ProjectScalarWhereInput[];
};
export type ProjectUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectCreateWithoutOrganizationInput, Prisma.ProjectUncheckedCreateWithoutOrganizationInput> | Prisma.ProjectCreateWithoutOrganizationInput[] | Prisma.ProjectUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.ProjectCreateOrConnectWithoutOrganizationInput | Prisma.ProjectCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.ProjectUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.ProjectUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.ProjectCreateManyOrganizationInputEnvelope;
    set?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    disconnect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    delete?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    connect?: Prisma.ProjectWhereUniqueInput | Prisma.ProjectWhereUniqueInput[];
    update?: Prisma.ProjectUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.ProjectUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.ProjectUpdateManyWithWhereWithoutOrganizationInput | Prisma.ProjectUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.ProjectScalarWhereInput | Prisma.ProjectScalarWhereInput[];
};
export type ProjectCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    description?: string | null;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.ProjectMemberCreateNestedManyWithoutProjectInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutProjectInput;
    organization: Prisma.OrganizationCreateNestedOneWithoutProjectsInput;
};
export type ProjectUncheckedCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    description?: string | null;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationId: string;
    members?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutProjectInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutProjectInput;
};
export type ProjectCreateOrConnectWithoutOwnerInput = {
    where: Prisma.ProjectWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutOwnerInput, Prisma.ProjectUncheckedCreateWithoutOwnerInput>;
};
export type ProjectCreateManyOwnerInputEnvelope = {
    data: Prisma.ProjectCreateManyOwnerInput | Prisma.ProjectCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type ProjectUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.ProjectWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectUpdateWithoutOwnerInput, Prisma.ProjectUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutOwnerInput, Prisma.ProjectUncheckedCreateWithoutOwnerInput>;
};
export type ProjectUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectUpdateWithoutOwnerInput, Prisma.ProjectUncheckedUpdateWithoutOwnerInput>;
};
export type ProjectUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.ProjectScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectUpdateManyMutationInput, Prisma.ProjectUncheckedUpdateManyWithoutOwnerInput>;
};
export type ProjectScalarWhereInput = {
    AND?: Prisma.ProjectScalarWhereInput | Prisma.ProjectScalarWhereInput[];
    OR?: Prisma.ProjectScalarWhereInput[];
    NOT?: Prisma.ProjectScalarWhereInput | Prisma.ProjectScalarWhereInput[];
    id?: Prisma.UuidFilter<"Project"> | string;
    name?: Prisma.StringFilter<"Project"> | string;
    description?: Prisma.StringNullableFilter<"Project"> | string | null;
    ownerId?: Prisma.UuidFilter<"Project"> | string;
    archivedAt?: Prisma.DateTimeNullableFilter<"Project"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Project"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Project"> | Date | string;
    organizationId?: Prisma.UuidFilter<"Project"> | string;
};
export type ProjectCreateWithoutMembersInput = {
    id?: string;
    name: string;
    description?: string | null;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedProjectsInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutProjectInput;
    organization: Prisma.OrganizationCreateNestedOneWithoutProjectsInput;
};
export type ProjectUncheckedCreateWithoutMembersInput = {
    id?: string;
    name: string;
    description?: string | null;
    ownerId: string;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationId: string;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutProjectInput;
};
export type ProjectCreateOrConnectWithoutMembersInput = {
    where: Prisma.ProjectWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutMembersInput, Prisma.ProjectUncheckedCreateWithoutMembersInput>;
};
export type ProjectUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.ProjectUpdateWithoutMembersInput, Prisma.ProjectUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutMembersInput, Prisma.ProjectUncheckedCreateWithoutMembersInput>;
    where?: Prisma.ProjectWhereInput;
};
export type ProjectUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.ProjectWhereInput;
    data: Prisma.XOR<Prisma.ProjectUpdateWithoutMembersInput, Prisma.ProjectUncheckedUpdateWithoutMembersInput>;
};
export type ProjectUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedProjectsNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutProjectNestedInput;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutProjectsNestedInput;
};
export type ProjectUncheckedUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutProjectNestedInput;
};
export type ProjectCreateWithoutTasksInput = {
    id?: string;
    name: string;
    description?: string | null;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedProjectsInput;
    members?: Prisma.ProjectMemberCreateNestedManyWithoutProjectInput;
    organization: Prisma.OrganizationCreateNestedOneWithoutProjectsInput;
};
export type ProjectUncheckedCreateWithoutTasksInput = {
    id?: string;
    name: string;
    description?: string | null;
    ownerId: string;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationId: string;
    members?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutProjectInput;
};
export type ProjectCreateOrConnectWithoutTasksInput = {
    where: Prisma.ProjectWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutTasksInput, Prisma.ProjectUncheckedCreateWithoutTasksInput>;
};
export type ProjectUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.ProjectUpdateWithoutTasksInput, Prisma.ProjectUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutTasksInput, Prisma.ProjectUncheckedCreateWithoutTasksInput>;
    where?: Prisma.ProjectWhereInput;
};
export type ProjectUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.ProjectWhereInput;
    data: Prisma.XOR<Prisma.ProjectUpdateWithoutTasksInput, Prisma.ProjectUncheckedUpdateWithoutTasksInput>;
};
export type ProjectUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedProjectsNestedInput;
    members?: Prisma.ProjectMemberUpdateManyWithoutProjectNestedInput;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutProjectsNestedInput;
};
export type ProjectUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    members?: Prisma.ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput;
};
export type ProjectCreateWithoutOrganizationInput = {
    id?: string;
    name: string;
    description?: string | null;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: Prisma.UserCreateNestedOneWithoutOwnedProjectsInput;
    members?: Prisma.ProjectMemberCreateNestedManyWithoutProjectInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutProjectInput;
};
export type ProjectUncheckedCreateWithoutOrganizationInput = {
    id?: string;
    name: string;
    description?: string | null;
    ownerId: string;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.ProjectMemberUncheckedCreateNestedManyWithoutProjectInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutProjectInput;
};
export type ProjectCreateOrConnectWithoutOrganizationInput = {
    where: Prisma.ProjectWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutOrganizationInput, Prisma.ProjectUncheckedCreateWithoutOrganizationInput>;
};
export type ProjectCreateManyOrganizationInputEnvelope = {
    data: Prisma.ProjectCreateManyOrganizationInput | Prisma.ProjectCreateManyOrganizationInput[];
    skipDuplicates?: boolean;
};
export type ProjectUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.ProjectWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectUpdateWithoutOrganizationInput, Prisma.ProjectUncheckedUpdateWithoutOrganizationInput>;
    create: Prisma.XOR<Prisma.ProjectCreateWithoutOrganizationInput, Prisma.ProjectUncheckedCreateWithoutOrganizationInput>;
};
export type ProjectUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectUpdateWithoutOrganizationInput, Prisma.ProjectUncheckedUpdateWithoutOrganizationInput>;
};
export type ProjectUpdateManyWithWhereWithoutOrganizationInput = {
    where: Prisma.ProjectScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectUpdateManyMutationInput, Prisma.ProjectUncheckedUpdateManyWithoutOrganizationInput>;
};
export type ProjectCreateManyOwnerInput = {
    id?: string;
    name: string;
    description?: string | null;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    organizationId: string;
};
export type ProjectUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.ProjectMemberUpdateManyWithoutProjectNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutProjectNestedInput;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutProjectsNestedInput;
};
export type ProjectUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    members?: Prisma.ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutProjectNestedInput;
};
export type ProjectUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectCreateManyOrganizationInput = {
    id?: string;
    name: string;
    description?: string | null;
    ownerId: string;
    archivedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ProjectUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.UserUpdateOneRequiredWithoutOwnedProjectsNestedInput;
    members?: Prisma.ProjectMemberUpdateManyWithoutProjectNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutProjectNestedInput;
};
export type ProjectUncheckedUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutProjectNestedInput;
};
export type ProjectUncheckedUpdateManyWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    archivedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectCountOutputType = {
    members: number;
    tasks: number;
};
export type ProjectCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | ProjectCountOutputTypeCountMembersArgs;
    tasks?: boolean | ProjectCountOutputTypeCountTasksArgs;
};
export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectCountOutputTypeSelect<ExtArgs> | null;
};
export type ProjectCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectMemberWhereInput;
};
export type ProjectCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
};
export type ProjectSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    ownerId?: boolean;
    archivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organizationId?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Project$membersArgs<ExtArgs>;
    tasks?: boolean | Prisma.Project$tasksArgs<ExtArgs>;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.ProjectCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["project"]>;
export type ProjectSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    ownerId?: boolean;
    archivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organizationId?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["project"]>;
export type ProjectSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    ownerId?: boolean;
    archivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organizationId?: boolean;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["project"]>;
export type ProjectSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    ownerId?: boolean;
    archivedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    organizationId?: boolean;
};
export type ProjectOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "ownerId" | "archivedAt" | "createdAt" | "updatedAt" | "organizationId", ExtArgs["result"]["project"]>;
export type ProjectInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Project$membersArgs<ExtArgs>;
    tasks?: boolean | Prisma.Project$tasksArgs<ExtArgs>;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.ProjectCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ProjectIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type $ProjectPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Project";
    objects: {
        owner: Prisma.$UserPayload<ExtArgs>;
        members: Prisma.$ProjectMemberPayload<ExtArgs>[];
        tasks: Prisma.$TaskPayload<ExtArgs>[];
        organization: Prisma.$OrganizationPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        archivedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
    }, ExtArgs["result"]["project"]>;
    composites: {};
};
export type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectPayload, S>;
export type ProjectCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectCountAggregateInputType | true;
};
export interface ProjectDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Project'];
        meta: {
            name: 'Project';
        };
    };
    findUnique<T extends ProjectFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProjectFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProjectFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProjectCreateArgs>(args: Prisma.SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProjectCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProjectDeleteArgs>(args: Prisma.SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProjectUpdateArgs>(args: Prisma.SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProjectDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProjectUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProjectUpsertArgs>(args: Prisma.SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProjectCountArgs>(args?: Prisma.Subset<T, ProjectCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectCountAggregateOutputType> : number>;
    aggregate<T extends ProjectAggregateArgs>(args: Prisma.Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>;
    groupBy<T extends ProjectGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProjectFieldRefs;
}
export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    owner<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Project$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Project$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tasks<T extends Prisma.Project$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Project$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    organization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProjectFieldRefs {
    readonly id: Prisma.FieldRef<"Project", 'String'>;
    readonly name: Prisma.FieldRef<"Project", 'String'>;
    readonly description: Prisma.FieldRef<"Project", 'String'>;
    readonly ownerId: Prisma.FieldRef<"Project", 'String'>;
    readonly archivedAt: Prisma.FieldRef<"Project", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Project", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Project", 'DateTime'>;
    readonly organizationId: Prisma.FieldRef<"Project", 'String'>;
}
export type ProjectFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where: Prisma.ProjectWhereUniqueInput;
};
export type ProjectFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where: Prisma.ProjectWhereUniqueInput;
};
export type ProjectFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectCreateInput, Prisma.ProjectUncheckedCreateInput>;
};
export type ProjectCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProjectCreateManyInput | Prisma.ProjectCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProjectCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    data: Prisma.ProjectCreateManyInput | Prisma.ProjectCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProjectIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProjectUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUpdateInput, Prisma.ProjectUncheckedUpdateInput>;
    where: Prisma.ProjectWhereUniqueInput;
};
export type ProjectUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProjectUpdateManyMutationInput, Prisma.ProjectUncheckedUpdateManyInput>;
    where?: Prisma.ProjectWhereInput;
    limit?: number;
};
export type ProjectUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUpdateManyMutationInput, Prisma.ProjectUncheckedUpdateManyInput>;
    where?: Prisma.ProjectWhereInput;
    limit?: number;
    include?: Prisma.ProjectIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProjectUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where: Prisma.ProjectWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectCreateInput, Prisma.ProjectUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProjectUpdateInput, Prisma.ProjectUncheckedUpdateInput>;
};
export type ProjectDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where: Prisma.ProjectWhereUniqueInput;
};
export type ProjectDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectWhereInput;
    limit?: number;
};
export type Project$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Project$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
};
export {};
