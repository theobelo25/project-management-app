import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ProjectMemberModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectMemberPayload>;
export type AggregateProjectMember = {
    _count: ProjectMemberCountAggregateOutputType | null;
    _min: ProjectMemberMinAggregateOutputType | null;
    _max: ProjectMemberMaxAggregateOutputType | null;
};
export type ProjectMemberMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    role: $Enums.ProjectRole | null;
    createdAt: Date | null;
};
export type ProjectMemberMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    role: $Enums.ProjectRole | null;
    createdAt: Date | null;
};
export type ProjectMemberCountAggregateOutputType = {
    id: number;
    projectId: number;
    userId: number;
    role: number;
    createdAt: number;
    _all: number;
};
export type ProjectMemberMinAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
};
export type ProjectMemberMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
};
export type ProjectMemberCountAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
    _all?: true;
};
export type ProjectMemberAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectMemberWhereInput;
    orderBy?: Prisma.ProjectMemberOrderByWithRelationInput | Prisma.ProjectMemberOrderByWithRelationInput[];
    cursor?: Prisma.ProjectMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProjectMemberCountAggregateInputType;
    _min?: ProjectMemberMinAggregateInputType;
    _max?: ProjectMemberMaxAggregateInputType;
};
export type GetProjectMemberAggregateType<T extends ProjectMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectMember]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProjectMember[P]> : Prisma.GetScalarType<T[P], AggregateProjectMember[P]>;
};
export type ProjectMemberGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectMemberWhereInput;
    orderBy?: Prisma.ProjectMemberOrderByWithAggregationInput | Prisma.ProjectMemberOrderByWithAggregationInput[];
    by: Prisma.ProjectMemberScalarFieldEnum[] | Prisma.ProjectMemberScalarFieldEnum;
    having?: Prisma.ProjectMemberScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectMemberCountAggregateInputType | true;
    _min?: ProjectMemberMinAggregateInputType;
    _max?: ProjectMemberMaxAggregateInputType;
};
export type ProjectMemberGroupByOutputType = {
    id: string;
    projectId: string;
    userId: string;
    role: $Enums.ProjectRole;
    createdAt: Date;
    _count: ProjectMemberCountAggregateOutputType | null;
    _min: ProjectMemberMinAggregateOutputType | null;
    _max: ProjectMemberMaxAggregateOutputType | null;
};
type GetProjectMemberGroupByPayload<T extends ProjectMemberGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectMemberGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectMemberGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectMemberGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectMemberGroupByOutputType[P]>;
}>>;
export type ProjectMemberWhereInput = {
    AND?: Prisma.ProjectMemberWhereInput | Prisma.ProjectMemberWhereInput[];
    OR?: Prisma.ProjectMemberWhereInput[];
    NOT?: Prisma.ProjectMemberWhereInput | Prisma.ProjectMemberWhereInput[];
    id?: Prisma.UuidFilter<"ProjectMember"> | string;
    projectId?: Prisma.UuidFilter<"ProjectMember"> | string;
    userId?: Prisma.UuidFilter<"ProjectMember"> | string;
    role?: Prisma.EnumProjectRoleFilter<"ProjectMember"> | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFilter<"ProjectMember"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ProjectMemberOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ProjectMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    projectId_userId?: Prisma.ProjectMemberProjectIdUserIdCompoundUniqueInput;
    AND?: Prisma.ProjectMemberWhereInput | Prisma.ProjectMemberWhereInput[];
    OR?: Prisma.ProjectMemberWhereInput[];
    NOT?: Prisma.ProjectMemberWhereInput | Prisma.ProjectMemberWhereInput[];
    projectId?: Prisma.UuidFilter<"ProjectMember"> | string;
    userId?: Prisma.UuidFilter<"ProjectMember"> | string;
    role?: Prisma.EnumProjectRoleFilter<"ProjectMember"> | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFilter<"ProjectMember"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "projectId_userId">;
export type ProjectMemberOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProjectMemberCountOrderByAggregateInput;
    _max?: Prisma.ProjectMemberMaxOrderByAggregateInput;
    _min?: Prisma.ProjectMemberMinOrderByAggregateInput;
};
export type ProjectMemberScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectMemberScalarWhereWithAggregatesInput | Prisma.ProjectMemberScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectMemberScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectMemberScalarWhereWithAggregatesInput | Prisma.ProjectMemberScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ProjectMember"> | string;
    projectId?: Prisma.UuidWithAggregatesFilter<"ProjectMember"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"ProjectMember"> | string;
    role?: Prisma.EnumProjectRoleWithAggregatesFilter<"ProjectMember"> | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProjectMember"> | Date | string;
};
export type ProjectMemberCreateInput = {
    id?: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutMembersInput;
    user: Prisma.UserCreateNestedOneWithoutProjectMembersInput;
};
export type ProjectMemberUncheckedCreateInput = {
    id?: string;
    projectId: string;
    userId: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
};
export type ProjectMemberUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutMembersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectMembersNestedInput;
};
export type ProjectMemberUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectMemberCreateManyInput = {
    id?: string;
    projectId: string;
    userId: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
};
export type ProjectMemberUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectMemberUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectMemberListRelationFilter = {
    every?: Prisma.ProjectMemberWhereInput;
    some?: Prisma.ProjectMemberWhereInput;
    none?: Prisma.ProjectMemberWhereInput;
};
export type ProjectMemberOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectMemberProjectIdUserIdCompoundUniqueInput = {
    projectId: string;
    userId: string;
};
export type ProjectMemberCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectMemberMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectMemberMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectMemberCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutUserInput, Prisma.ProjectMemberUncheckedCreateWithoutUserInput> | Prisma.ProjectMemberCreateWithoutUserInput[] | Prisma.ProjectMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutUserInput | Prisma.ProjectMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectMemberCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
};
export type ProjectMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutUserInput, Prisma.ProjectMemberUncheckedCreateWithoutUserInput> | Prisma.ProjectMemberCreateWithoutUserInput[] | Prisma.ProjectMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutUserInput | Prisma.ProjectMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectMemberCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
};
export type ProjectMemberUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutUserInput, Prisma.ProjectMemberUncheckedCreateWithoutUserInput> | Prisma.ProjectMemberCreateWithoutUserInput[] | Prisma.ProjectMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutUserInput | Prisma.ProjectMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectMemberCreateManyUserInputEnvelope;
    set?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    disconnect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    delete?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    update?: Prisma.ProjectMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectMemberUpdateManyWithWhereWithoutUserInput | Prisma.ProjectMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectMemberScalarWhereInput | Prisma.ProjectMemberScalarWhereInput[];
};
export type ProjectMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutUserInput, Prisma.ProjectMemberUncheckedCreateWithoutUserInput> | Prisma.ProjectMemberCreateWithoutUserInput[] | Prisma.ProjectMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutUserInput | Prisma.ProjectMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectMemberCreateManyUserInputEnvelope;
    set?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    disconnect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    delete?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    update?: Prisma.ProjectMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectMemberUpdateManyWithWhereWithoutUserInput | Prisma.ProjectMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectMemberScalarWhereInput | Prisma.ProjectMemberScalarWhereInput[];
};
export type ProjectMemberCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutProjectInput, Prisma.ProjectMemberUncheckedCreateWithoutProjectInput> | Prisma.ProjectMemberCreateWithoutProjectInput[] | Prisma.ProjectMemberUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutProjectInput | Prisma.ProjectMemberCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectMemberCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
};
export type ProjectMemberUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutProjectInput, Prisma.ProjectMemberUncheckedCreateWithoutProjectInput> | Prisma.ProjectMemberCreateWithoutProjectInput[] | Prisma.ProjectMemberUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutProjectInput | Prisma.ProjectMemberCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectMemberCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
};
export type ProjectMemberUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutProjectInput, Prisma.ProjectMemberUncheckedCreateWithoutProjectInput> | Prisma.ProjectMemberCreateWithoutProjectInput[] | Prisma.ProjectMemberUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutProjectInput | Prisma.ProjectMemberCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectMemberUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectMemberCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    disconnect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    delete?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    update?: Prisma.ProjectMemberUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectMemberUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectMemberUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectMemberScalarWhereInput | Prisma.ProjectMemberScalarWhereInput[];
};
export type ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectMemberCreateWithoutProjectInput, Prisma.ProjectMemberUncheckedCreateWithoutProjectInput> | Prisma.ProjectMemberCreateWithoutProjectInput[] | Prisma.ProjectMemberUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectMemberCreateOrConnectWithoutProjectInput | Prisma.ProjectMemberCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectMemberUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectMemberCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    disconnect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    delete?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    connect?: Prisma.ProjectMemberWhereUniqueInput | Prisma.ProjectMemberWhereUniqueInput[];
    update?: Prisma.ProjectMemberUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectMemberUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectMemberUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectMemberScalarWhereInput | Prisma.ProjectMemberScalarWhereInput[];
};
export type EnumProjectRoleFieldUpdateOperationsInput = {
    set?: $Enums.ProjectRole;
};
export type ProjectMemberCreateWithoutUserInput = {
    id?: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutMembersInput;
};
export type ProjectMemberUncheckedCreateWithoutUserInput = {
    id?: string;
    projectId: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
};
export type ProjectMemberCreateOrConnectWithoutUserInput = {
    where: Prisma.ProjectMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectMemberCreateWithoutUserInput, Prisma.ProjectMemberUncheckedCreateWithoutUserInput>;
};
export type ProjectMemberCreateManyUserInputEnvelope = {
    data: Prisma.ProjectMemberCreateManyUserInput | Prisma.ProjectMemberCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ProjectMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectMemberUpdateWithoutUserInput, Prisma.ProjectMemberUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ProjectMemberCreateWithoutUserInput, Prisma.ProjectMemberUncheckedCreateWithoutUserInput>;
};
export type ProjectMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectMemberUpdateWithoutUserInput, Prisma.ProjectMemberUncheckedUpdateWithoutUserInput>;
};
export type ProjectMemberUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ProjectMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectMemberUpdateManyMutationInput, Prisma.ProjectMemberUncheckedUpdateManyWithoutUserInput>;
};
export type ProjectMemberScalarWhereInput = {
    AND?: Prisma.ProjectMemberScalarWhereInput | Prisma.ProjectMemberScalarWhereInput[];
    OR?: Prisma.ProjectMemberScalarWhereInput[];
    NOT?: Prisma.ProjectMemberScalarWhereInput | Prisma.ProjectMemberScalarWhereInput[];
    id?: Prisma.UuidFilter<"ProjectMember"> | string;
    projectId?: Prisma.UuidFilter<"ProjectMember"> | string;
    userId?: Prisma.UuidFilter<"ProjectMember"> | string;
    role?: Prisma.EnumProjectRoleFilter<"ProjectMember"> | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFilter<"ProjectMember"> | Date | string;
};
export type ProjectMemberCreateWithoutProjectInput = {
    id?: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutProjectMembersInput;
};
export type ProjectMemberUncheckedCreateWithoutProjectInput = {
    id?: string;
    userId: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
};
export type ProjectMemberCreateOrConnectWithoutProjectInput = {
    where: Prisma.ProjectMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectMemberCreateWithoutProjectInput, Prisma.ProjectMemberUncheckedCreateWithoutProjectInput>;
};
export type ProjectMemberCreateManyProjectInputEnvelope = {
    data: Prisma.ProjectMemberCreateManyProjectInput | Prisma.ProjectMemberCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ProjectMemberUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectMemberUpdateWithoutProjectInput, Prisma.ProjectMemberUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ProjectMemberCreateWithoutProjectInput, Prisma.ProjectMemberUncheckedCreateWithoutProjectInput>;
};
export type ProjectMemberUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectMemberUpdateWithoutProjectInput, Prisma.ProjectMemberUncheckedUpdateWithoutProjectInput>;
};
export type ProjectMemberUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ProjectMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectMemberUpdateManyMutationInput, Prisma.ProjectMemberUncheckedUpdateManyWithoutProjectInput>;
};
export type ProjectMemberCreateManyUserInput = {
    id?: string;
    projectId: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
};
export type ProjectMemberUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutMembersNestedInput;
};
export type ProjectMemberUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectMemberUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectMemberCreateManyProjectInput = {
    id?: string;
    userId: string;
    role?: $Enums.ProjectRole;
    createdAt?: Date | string;
};
export type ProjectMemberUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectMembersNestedInput;
};
export type ProjectMemberUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectMemberUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectMemberSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectMember"]>;
export type ProjectMemberSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectMember"]>;
export type ProjectMemberSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectMember"]>;
export type ProjectMemberSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
};
export type ProjectMemberOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "userId" | "role" | "createdAt", ExtArgs["result"]["projectMember"]>;
export type ProjectMemberInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ProjectMemberIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ProjectMemberIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ProjectMemberPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProjectMember";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        userId: string;
        role: $Enums.ProjectRole;
        createdAt: Date;
    }, ExtArgs["result"]["projectMember"]>;
    composites: {};
};
export type ProjectMemberGetPayload<S extends boolean | null | undefined | ProjectMemberDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload, S>;
export type ProjectMemberCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectMemberCountAggregateInputType | true;
};
export interface ProjectMemberDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProjectMember'];
        meta: {
            name: 'ProjectMember';
        };
    };
    findUnique<T extends ProjectMemberFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectMemberFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProjectMemberFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProjectMemberFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectMemberFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProjectMemberFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProjectMemberFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProjectMemberCreateArgs>(args: Prisma.SelectSubset<T, ProjectMemberCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProjectMemberCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProjectMemberCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProjectMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProjectMemberDeleteArgs>(args: Prisma.SelectSubset<T, ProjectMemberDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProjectMemberUpdateArgs>(args: Prisma.SelectSubset<T, ProjectMemberUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProjectMemberDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProjectMemberUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProjectMemberUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProjectMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProjectMemberUpsertArgs>(args: Prisma.SelectSubset<T, ProjectMemberUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectMemberClient<runtime.Types.Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProjectMemberCountArgs>(args?: Prisma.Subset<T, ProjectMemberCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectMemberCountAggregateOutputType> : number>;
    aggregate<T extends ProjectMemberAggregateArgs>(args: Prisma.Subset<T, ProjectMemberAggregateArgs>): Prisma.PrismaPromise<GetProjectMemberAggregateType<T>>;
    groupBy<T extends ProjectMemberGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectMemberGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectMemberGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProjectMemberFieldRefs;
}
export interface Prisma__ProjectMemberClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProjectMemberFieldRefs {
    readonly id: Prisma.FieldRef<"ProjectMember", 'String'>;
    readonly projectId: Prisma.FieldRef<"ProjectMember", 'String'>;
    readonly userId: Prisma.FieldRef<"ProjectMember", 'String'>;
    readonly role: Prisma.FieldRef<"ProjectMember", 'ProjectRole'>;
    readonly createdAt: Prisma.FieldRef<"ProjectMember", 'DateTime'>;
}
export type ProjectMemberFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
    where: Prisma.ProjectMemberWhereUniqueInput;
};
export type ProjectMemberFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
    where: Prisma.ProjectMemberWhereUniqueInput;
};
export type ProjectMemberFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectMemberFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectMemberFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectMemberCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectMemberCreateInput, Prisma.ProjectMemberUncheckedCreateInput>;
};
export type ProjectMemberCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProjectMemberCreateManyInput | Prisma.ProjectMemberCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProjectMemberCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    data: Prisma.ProjectMemberCreateManyInput | Prisma.ProjectMemberCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProjectMemberIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProjectMemberUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectMemberUpdateInput, Prisma.ProjectMemberUncheckedUpdateInput>;
    where: Prisma.ProjectMemberWhereUniqueInput;
};
export type ProjectMemberUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProjectMemberUpdateManyMutationInput, Prisma.ProjectMemberUncheckedUpdateManyInput>;
    where?: Prisma.ProjectMemberWhereInput;
    limit?: number;
};
export type ProjectMemberUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectMemberUpdateManyMutationInput, Prisma.ProjectMemberUncheckedUpdateManyInput>;
    where?: Prisma.ProjectMemberWhereInput;
    limit?: number;
    include?: Prisma.ProjectMemberIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProjectMemberUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
    where: Prisma.ProjectMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectMemberCreateInput, Prisma.ProjectMemberUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProjectMemberUpdateInput, Prisma.ProjectMemberUncheckedUpdateInput>;
};
export type ProjectMemberDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
    where: Prisma.ProjectMemberWhereUniqueInput;
};
export type ProjectMemberDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectMemberWhereInput;
    limit?: number;
};
export type ProjectMemberDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectMemberSelect<ExtArgs> | null;
    omit?: Prisma.ProjectMemberOmit<ExtArgs> | null;
    include?: Prisma.ProjectMemberInclude<ExtArgs> | null;
};
export {};
