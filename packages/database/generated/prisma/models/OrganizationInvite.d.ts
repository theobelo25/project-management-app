import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type OrganizationInviteModel = runtime.Types.Result.DefaultSelection<Prisma.$OrganizationInvitePayload>;
export type AggregateOrganizationInvite = {
    _count: OrganizationInviteCountAggregateOutputType | null;
    _min: OrganizationInviteMinAggregateOutputType | null;
    _max: OrganizationInviteMaxAggregateOutputType | null;
};
export type OrganizationInviteMinAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    email: string | null;
    tokenHash: string | null;
    tokenPrefix: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    revokedAt: Date | null;
    createdById: string | null;
    createdAt: Date | null;
    userId: string | null;
};
export type OrganizationInviteMaxAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    email: string | null;
    tokenHash: string | null;
    tokenPrefix: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    revokedAt: Date | null;
    createdById: string | null;
    createdAt: Date | null;
    userId: string | null;
};
export type OrganizationInviteCountAggregateOutputType = {
    id: number;
    organizationId: number;
    email: number;
    tokenHash: number;
    tokenPrefix: number;
    expiresAt: number;
    acceptedAt: number;
    revokedAt: number;
    createdById: number;
    createdAt: number;
    userId: number;
    _all: number;
};
export type OrganizationInviteMinAggregateInputType = {
    id?: true;
    organizationId?: true;
    email?: true;
    tokenHash?: true;
    tokenPrefix?: true;
    expiresAt?: true;
    acceptedAt?: true;
    revokedAt?: true;
    createdById?: true;
    createdAt?: true;
    userId?: true;
};
export type OrganizationInviteMaxAggregateInputType = {
    id?: true;
    organizationId?: true;
    email?: true;
    tokenHash?: true;
    tokenPrefix?: true;
    expiresAt?: true;
    acceptedAt?: true;
    revokedAt?: true;
    createdById?: true;
    createdAt?: true;
    userId?: true;
};
export type OrganizationInviteCountAggregateInputType = {
    id?: true;
    organizationId?: true;
    email?: true;
    tokenHash?: true;
    tokenPrefix?: true;
    expiresAt?: true;
    acceptedAt?: true;
    revokedAt?: true;
    createdById?: true;
    createdAt?: true;
    userId?: true;
    _all?: true;
};
export type OrganizationInviteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationInviteWhereInput;
    orderBy?: Prisma.OrganizationInviteOrderByWithRelationInput | Prisma.OrganizationInviteOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationInviteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrganizationInviteCountAggregateInputType;
    _min?: OrganizationInviteMinAggregateInputType;
    _max?: OrganizationInviteMaxAggregateInputType;
};
export type GetOrganizationInviteAggregateType<T extends OrganizationInviteAggregateArgs> = {
    [P in keyof T & keyof AggregateOrganizationInvite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrganizationInvite[P]> : Prisma.GetScalarType<T[P], AggregateOrganizationInvite[P]>;
};
export type OrganizationInviteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationInviteWhereInput;
    orderBy?: Prisma.OrganizationInviteOrderByWithAggregationInput | Prisma.OrganizationInviteOrderByWithAggregationInput[];
    by: Prisma.OrganizationInviteScalarFieldEnum[] | Prisma.OrganizationInviteScalarFieldEnum;
    having?: Prisma.OrganizationInviteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrganizationInviteCountAggregateInputType | true;
    _min?: OrganizationInviteMinAggregateInputType;
    _max?: OrganizationInviteMaxAggregateInputType;
};
export type OrganizationInviteGroupByOutputType = {
    id: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    revokedAt: Date | null;
    createdById: string;
    createdAt: Date;
    userId: string | null;
    _count: OrganizationInviteCountAggregateOutputType | null;
    _min: OrganizationInviteMinAggregateOutputType | null;
    _max: OrganizationInviteMaxAggregateOutputType | null;
};
type GetOrganizationInviteGroupByPayload<T extends OrganizationInviteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrganizationInviteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrganizationInviteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrganizationInviteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrganizationInviteGroupByOutputType[P]>;
}>>;
export type OrganizationInviteWhereInput = {
    AND?: Prisma.OrganizationInviteWhereInput | Prisma.OrganizationInviteWhereInput[];
    OR?: Prisma.OrganizationInviteWhereInput[];
    NOT?: Prisma.OrganizationInviteWhereInput | Prisma.OrganizationInviteWhereInput[];
    id?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    organizationId?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    email?: Prisma.StringFilter<"OrganizationInvite"> | string;
    tokenHash?: Prisma.StringFilter<"OrganizationInvite"> | string;
    tokenPrefix?: Prisma.StringFilter<"OrganizationInvite"> | string;
    expiresAt?: Prisma.DateTimeFilter<"OrganizationInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"OrganizationInvite"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"OrganizationInvite"> | Date | string | null;
    createdById?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    createdAt?: Prisma.DateTimeFilter<"OrganizationInvite"> | Date | string;
    userId?: Prisma.UuidNullableFilter<"OrganizationInvite"> | string | null;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type OrganizationInviteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    tokenPrefix?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    organization?: Prisma.OrganizationOrderByWithRelationInput;
    createdBy?: Prisma.UserOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type OrganizationInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tokenHash?: string;
    AND?: Prisma.OrganizationInviteWhereInput | Prisma.OrganizationInviteWhereInput[];
    OR?: Prisma.OrganizationInviteWhereInput[];
    NOT?: Prisma.OrganizationInviteWhereInput | Prisma.OrganizationInviteWhereInput[];
    organizationId?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    email?: Prisma.StringFilter<"OrganizationInvite"> | string;
    tokenPrefix?: Prisma.StringFilter<"OrganizationInvite"> | string;
    expiresAt?: Prisma.DateTimeFilter<"OrganizationInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"OrganizationInvite"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"OrganizationInvite"> | Date | string | null;
    createdById?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    createdAt?: Prisma.DateTimeFilter<"OrganizationInvite"> | Date | string;
    userId?: Prisma.UuidNullableFilter<"OrganizationInvite"> | string | null;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "tokenHash">;
export type OrganizationInviteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    tokenPrefix?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.OrganizationInviteCountOrderByAggregateInput;
    _max?: Prisma.OrganizationInviteMaxOrderByAggregateInput;
    _min?: Prisma.OrganizationInviteMinOrderByAggregateInput;
};
export type OrganizationInviteScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrganizationInviteScalarWhereWithAggregatesInput | Prisma.OrganizationInviteScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrganizationInviteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrganizationInviteScalarWhereWithAggregatesInput | Prisma.OrganizationInviteScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"OrganizationInvite"> | string;
    organizationId?: Prisma.UuidWithAggregatesFilter<"OrganizationInvite"> | string;
    email?: Prisma.StringWithAggregatesFilter<"OrganizationInvite"> | string;
    tokenHash?: Prisma.StringWithAggregatesFilter<"OrganizationInvite"> | string;
    tokenPrefix?: Prisma.StringWithAggregatesFilter<"OrganizationInvite"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"OrganizationInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"OrganizationInvite"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"OrganizationInvite"> | Date | string | null;
    createdById?: Prisma.UuidWithAggregatesFilter<"OrganizationInvite"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"OrganizationInvite"> | Date | string;
    userId?: Prisma.UuidNullableWithAggregatesFilter<"OrganizationInvite"> | string | null;
};
export type OrganizationInviteCreateInput = {
    id?: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutOrganizationInvitesInput;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedInvitesInput;
    user?: Prisma.UserCreateNestedOneWithoutOrganizationInvitesInput;
};
export type OrganizationInviteUncheckedCreateInput = {
    id?: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdById: string;
    createdAt?: Date | string;
    userId?: string | null;
};
export type OrganizationInviteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutOrganizationInvitesNestedInput;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedInvitesNestedInput;
    user?: Prisma.UserUpdateOneWithoutOrganizationInvitesNestedInput;
};
export type OrganizationInviteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrganizationInviteCreateManyInput = {
    id?: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdById: string;
    createdAt?: Date | string;
    userId?: string | null;
};
export type OrganizationInviteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizationInviteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrganizationInviteListRelationFilter = {
    every?: Prisma.OrganizationInviteWhereInput;
    some?: Prisma.OrganizationInviteWhereInput;
    none?: Prisma.OrganizationInviteWhereInput;
};
export type OrganizationInviteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrganizationInviteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    tokenPrefix?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type OrganizationInviteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    tokenPrefix?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type OrganizationInviteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    tokenPrefix?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type OrganizationInviteCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput> | Prisma.OrganizationInviteCreateWithoutCreatedByInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput | Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.OrganizationInviteCreateManyCreatedByInputEnvelope;
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
};
export type OrganizationInviteCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutUserInput, Prisma.OrganizationInviteUncheckedCreateWithoutUserInput> | Prisma.OrganizationInviteCreateWithoutUserInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutUserInput | Prisma.OrganizationInviteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OrganizationInviteCreateManyUserInputEnvelope;
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
};
export type OrganizationInviteUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput> | Prisma.OrganizationInviteCreateWithoutCreatedByInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput | Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.OrganizationInviteCreateManyCreatedByInputEnvelope;
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
};
export type OrganizationInviteUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutUserInput, Prisma.OrganizationInviteUncheckedCreateWithoutUserInput> | Prisma.OrganizationInviteCreateWithoutUserInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutUserInput | Prisma.OrganizationInviteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OrganizationInviteCreateManyUserInputEnvelope;
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
};
export type OrganizationInviteUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput> | Prisma.OrganizationInviteCreateWithoutCreatedByInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput | Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.OrganizationInviteCreateManyCreatedByInputEnvelope;
    set?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    disconnect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    delete?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    update?: Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.OrganizationInviteUpdateManyWithWhereWithoutCreatedByInput | Prisma.OrganizationInviteUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
};
export type OrganizationInviteUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutUserInput, Prisma.OrganizationInviteUncheckedCreateWithoutUserInput> | Prisma.OrganizationInviteCreateWithoutUserInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutUserInput | Prisma.OrganizationInviteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutUserInput | Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OrganizationInviteCreateManyUserInputEnvelope;
    set?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    disconnect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    delete?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    update?: Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutUserInput | Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OrganizationInviteUpdateManyWithWhereWithoutUserInput | Prisma.OrganizationInviteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
};
export type OrganizationInviteUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput> | Prisma.OrganizationInviteCreateWithoutCreatedByInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput | Prisma.OrganizationInviteCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.OrganizationInviteCreateManyCreatedByInputEnvelope;
    set?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    disconnect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    delete?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    update?: Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.OrganizationInviteUpdateManyWithWhereWithoutCreatedByInput | Prisma.OrganizationInviteUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
};
export type OrganizationInviteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutUserInput, Prisma.OrganizationInviteUncheckedCreateWithoutUserInput> | Prisma.OrganizationInviteCreateWithoutUserInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutUserInput | Prisma.OrganizationInviteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutUserInput | Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OrganizationInviteCreateManyUserInputEnvelope;
    set?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    disconnect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    delete?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    update?: Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutUserInput | Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OrganizationInviteUpdateManyWithWhereWithoutUserInput | Prisma.OrganizationInviteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
};
export type OrganizationInviteCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput> | Prisma.OrganizationInviteCreateWithoutOrganizationInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput | Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.OrganizationInviteCreateManyOrganizationInputEnvelope;
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
};
export type OrganizationInviteUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput> | Prisma.OrganizationInviteCreateWithoutOrganizationInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput | Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.OrganizationInviteCreateManyOrganizationInputEnvelope;
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
};
export type OrganizationInviteUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput> | Prisma.OrganizationInviteCreateWithoutOrganizationInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput | Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.OrganizationInviteCreateManyOrganizationInputEnvelope;
    set?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    disconnect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    delete?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    update?: Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.OrganizationInviteUpdateManyWithWhereWithoutOrganizationInput | Prisma.OrganizationInviteUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
};
export type OrganizationInviteUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput> | Prisma.OrganizationInviteCreateWithoutOrganizationInput[] | Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput | Prisma.OrganizationInviteCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.OrganizationInviteUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.OrganizationInviteCreateManyOrganizationInputEnvelope;
    set?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    disconnect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    delete?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    connect?: Prisma.OrganizationInviteWhereUniqueInput | Prisma.OrganizationInviteWhereUniqueInput[];
    update?: Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.OrganizationInviteUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.OrganizationInviteUpdateManyWithWhereWithoutOrganizationInput | Prisma.OrganizationInviteUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
};
export type OrganizationInviteCreateWithoutCreatedByInput = {
    id?: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutOrganizationInvitesInput;
    user?: Prisma.UserCreateNestedOneWithoutOrganizationInvitesInput;
};
export type OrganizationInviteUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    userId?: string | null;
};
export type OrganizationInviteCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput>;
};
export type OrganizationInviteCreateManyCreatedByInputEnvelope = {
    data: Prisma.OrganizationInviteCreateManyCreatedByInput | Prisma.OrganizationInviteCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type OrganizationInviteCreateWithoutUserInput = {
    id?: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    organization: Prisma.OrganizationCreateNestedOneWithoutOrganizationInvitesInput;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedInvitesInput;
};
export type OrganizationInviteUncheckedCreateWithoutUserInput = {
    id?: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdById: string;
    createdAt?: Date | string;
};
export type OrganizationInviteCreateOrConnectWithoutUserInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutUserInput, Prisma.OrganizationInviteUncheckedCreateWithoutUserInput>;
};
export type OrganizationInviteCreateManyUserInputEnvelope = {
    data: Prisma.OrganizationInviteCreateManyUserInput | Prisma.OrganizationInviteCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type OrganizationInviteUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrganizationInviteUpdateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedCreateWithoutCreatedByInput>;
};
export type OrganizationInviteUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateWithoutCreatedByInput, Prisma.OrganizationInviteUncheckedUpdateWithoutCreatedByInput>;
};
export type OrganizationInviteUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.OrganizationInviteScalarWhereInput;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateManyMutationInput, Prisma.OrganizationInviteUncheckedUpdateManyWithoutCreatedByInput>;
};
export type OrganizationInviteScalarWhereInput = {
    AND?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
    OR?: Prisma.OrganizationInviteScalarWhereInput[];
    NOT?: Prisma.OrganizationInviteScalarWhereInput | Prisma.OrganizationInviteScalarWhereInput[];
    id?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    organizationId?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    email?: Prisma.StringFilter<"OrganizationInvite"> | string;
    tokenHash?: Prisma.StringFilter<"OrganizationInvite"> | string;
    tokenPrefix?: Prisma.StringFilter<"OrganizationInvite"> | string;
    expiresAt?: Prisma.DateTimeFilter<"OrganizationInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"OrganizationInvite"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"OrganizationInvite"> | Date | string | null;
    createdById?: Prisma.UuidFilter<"OrganizationInvite"> | string;
    createdAt?: Prisma.DateTimeFilter<"OrganizationInvite"> | Date | string;
    userId?: Prisma.UuidNullableFilter<"OrganizationInvite"> | string | null;
};
export type OrganizationInviteUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrganizationInviteUpdateWithoutUserInput, Prisma.OrganizationInviteUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutUserInput, Prisma.OrganizationInviteUncheckedCreateWithoutUserInput>;
};
export type OrganizationInviteUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateWithoutUserInput, Prisma.OrganizationInviteUncheckedUpdateWithoutUserInput>;
};
export type OrganizationInviteUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.OrganizationInviteScalarWhereInput;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateManyMutationInput, Prisma.OrganizationInviteUncheckedUpdateManyWithoutUserInput>;
};
export type OrganizationInviteCreateWithoutOrganizationInput = {
    id?: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedInvitesInput;
    user?: Prisma.UserCreateNestedOneWithoutOrganizationInvitesInput;
};
export type OrganizationInviteUncheckedCreateWithoutOrganizationInput = {
    id?: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdById: string;
    createdAt?: Date | string;
    userId?: string | null;
};
export type OrganizationInviteCreateOrConnectWithoutOrganizationInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput>;
};
export type OrganizationInviteCreateManyOrganizationInputEnvelope = {
    data: Prisma.OrganizationInviteCreateManyOrganizationInput | Prisma.OrganizationInviteCreateManyOrganizationInput[];
    skipDuplicates?: boolean;
};
export type OrganizationInviteUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrganizationInviteUpdateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedUpdateWithoutOrganizationInput>;
    create: Prisma.XOR<Prisma.OrganizationInviteCreateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedCreateWithoutOrganizationInput>;
};
export type OrganizationInviteUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.OrganizationInviteWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateWithoutOrganizationInput, Prisma.OrganizationInviteUncheckedUpdateWithoutOrganizationInput>;
};
export type OrganizationInviteUpdateManyWithWhereWithoutOrganizationInput = {
    where: Prisma.OrganizationInviteScalarWhereInput;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateManyMutationInput, Prisma.OrganizationInviteUncheckedUpdateManyWithoutOrganizationInput>;
};
export type OrganizationInviteCreateManyCreatedByInput = {
    id?: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    userId?: string | null;
};
export type OrganizationInviteCreateManyUserInput = {
    id?: string;
    organizationId: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdById: string;
    createdAt?: Date | string;
};
export type OrganizationInviteUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutOrganizationInvitesNestedInput;
    user?: Prisma.UserUpdateOneWithoutOrganizationInvitesNestedInput;
};
export type OrganizationInviteUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrganizationInviteUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrganizationInviteUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutOrganizationInvitesNestedInput;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedInvitesNestedInput;
};
export type OrganizationInviteUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizationInviteUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrganizationInviteCreateManyOrganizationInput = {
    id?: string;
    email: string;
    tokenHash: string;
    tokenPrefix: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdById: string;
    createdAt?: Date | string;
    userId?: string | null;
};
export type OrganizationInviteUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedInvitesNestedInput;
    user?: Prisma.UserUpdateOneWithoutOrganizationInvitesNestedInput;
};
export type OrganizationInviteUncheckedUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrganizationInviteUncheckedUpdateManyWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenPrefix?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrganizationInviteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    tokenHash?: boolean;
    tokenPrefix?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    revokedAt?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    userId?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.OrganizationInvite$userArgs<ExtArgs>;
}, ExtArgs["result"]["organizationInvite"]>;
export type OrganizationInviteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    tokenHash?: boolean;
    tokenPrefix?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    revokedAt?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    userId?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.OrganizationInvite$userArgs<ExtArgs>;
}, ExtArgs["result"]["organizationInvite"]>;
export type OrganizationInviteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    tokenHash?: boolean;
    tokenPrefix?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    revokedAt?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    userId?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.OrganizationInvite$userArgs<ExtArgs>;
}, ExtArgs["result"]["organizationInvite"]>;
export type OrganizationInviteSelectScalar = {
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    tokenHash?: boolean;
    tokenPrefix?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    revokedAt?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    userId?: boolean;
};
export type OrganizationInviteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "organizationId" | "email" | "tokenHash" | "tokenPrefix" | "expiresAt" | "acceptedAt" | "revokedAt" | "createdById" | "createdAt" | "userId", ExtArgs["result"]["organizationInvite"]>;
export type OrganizationInviteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.OrganizationInvite$userArgs<ExtArgs>;
};
export type OrganizationInviteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.OrganizationInvite$userArgs<ExtArgs>;
};
export type OrganizationInviteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.OrganizationInvite$userArgs<ExtArgs>;
};
export type $OrganizationInvitePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OrganizationInvite";
    objects: {
        organization: Prisma.$OrganizationPayload<ExtArgs>;
        createdBy: Prisma.$UserPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        organizationId: string;
        email: string;
        tokenHash: string;
        tokenPrefix: string;
        expiresAt: Date;
        acceptedAt: Date | null;
        revokedAt: Date | null;
        createdById: string;
        createdAt: Date;
        userId: string | null;
    }, ExtArgs["result"]["organizationInvite"]>;
    composites: {};
};
export type OrganizationInviteGetPayload<S extends boolean | null | undefined | OrganizationInviteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload, S>;
export type OrganizationInviteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrganizationInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrganizationInviteCountAggregateInputType | true;
};
export interface OrganizationInviteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OrganizationInvite'];
        meta: {
            name: 'OrganizationInvite';
        };
    };
    findUnique<T extends OrganizationInviteFindUniqueArgs>(args: Prisma.SelectSubset<T, OrganizationInviteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrganizationInviteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrganizationInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrganizationInviteFindFirstArgs>(args?: Prisma.SelectSubset<T, OrganizationInviteFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrganizationInviteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrganizationInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrganizationInviteFindManyArgs>(args?: Prisma.SelectSubset<T, OrganizationInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrganizationInviteCreateArgs>(args: Prisma.SelectSubset<T, OrganizationInviteCreateArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrganizationInviteCreateManyArgs>(args?: Prisma.SelectSubset<T, OrganizationInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrganizationInviteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrganizationInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrganizationInviteDeleteArgs>(args: Prisma.SelectSubset<T, OrganizationInviteDeleteArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrganizationInviteUpdateArgs>(args: Prisma.SelectSubset<T, OrganizationInviteUpdateArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrganizationInviteDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrganizationInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrganizationInviteUpdateManyArgs>(args: Prisma.SelectSubset<T, OrganizationInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrganizationInviteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrganizationInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrganizationInviteUpsertArgs>(args: Prisma.SelectSubset<T, OrganizationInviteUpsertArgs<ExtArgs>>): Prisma.Prisma__OrganizationInviteClient<runtime.Types.Result.GetResult<Prisma.$OrganizationInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrganizationInviteCountArgs>(args?: Prisma.Subset<T, OrganizationInviteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrganizationInviteCountAggregateOutputType> : number>;
    aggregate<T extends OrganizationInviteAggregateArgs>(args: Prisma.Subset<T, OrganizationInviteAggregateArgs>): Prisma.PrismaPromise<GetOrganizationInviteAggregateType<T>>;
    groupBy<T extends OrganizationInviteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrganizationInviteGroupByArgs['orderBy'];
    } : {
        orderBy?: OrganizationInviteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrganizationInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrganizationInviteFieldRefs;
}
export interface Prisma__OrganizationInviteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    organization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.OrganizationInvite$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationInvite$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrganizationInviteFieldRefs {
    readonly id: Prisma.FieldRef<"OrganizationInvite", 'String'>;
    readonly organizationId: Prisma.FieldRef<"OrganizationInvite", 'String'>;
    readonly email: Prisma.FieldRef<"OrganizationInvite", 'String'>;
    readonly tokenHash: Prisma.FieldRef<"OrganizationInvite", 'String'>;
    readonly tokenPrefix: Prisma.FieldRef<"OrganizationInvite", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"OrganizationInvite", 'DateTime'>;
    readonly acceptedAt: Prisma.FieldRef<"OrganizationInvite", 'DateTime'>;
    readonly revokedAt: Prisma.FieldRef<"OrganizationInvite", 'DateTime'>;
    readonly createdById: Prisma.FieldRef<"OrganizationInvite", 'String'>;
    readonly createdAt: Prisma.FieldRef<"OrganizationInvite", 'DateTime'>;
    readonly userId: Prisma.FieldRef<"OrganizationInvite", 'String'>;
}
export type OrganizationInviteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    where: Prisma.OrganizationInviteWhereUniqueInput;
};
export type OrganizationInviteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    where: Prisma.OrganizationInviteWhereUniqueInput;
};
export type OrganizationInviteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrganizationInviteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrganizationInviteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OrganizationInviteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationInviteCreateInput, Prisma.OrganizationInviteUncheckedCreateInput>;
};
export type OrganizationInviteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrganizationInviteCreateManyInput | Prisma.OrganizationInviteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrganizationInviteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    data: Prisma.OrganizationInviteCreateManyInput | Prisma.OrganizationInviteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OrganizationInviteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OrganizationInviteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateInput, Prisma.OrganizationInviteUncheckedUpdateInput>;
    where: Prisma.OrganizationInviteWhereUniqueInput;
};
export type OrganizationInviteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateManyMutationInput, Prisma.OrganizationInviteUncheckedUpdateManyInput>;
    where?: Prisma.OrganizationInviteWhereInput;
    limit?: number;
};
export type OrganizationInviteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrganizationInviteUpdateManyMutationInput, Prisma.OrganizationInviteUncheckedUpdateManyInput>;
    where?: Prisma.OrganizationInviteWhereInput;
    limit?: number;
    include?: Prisma.OrganizationInviteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OrganizationInviteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    where: Prisma.OrganizationInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrganizationInviteCreateInput, Prisma.OrganizationInviteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrganizationInviteUpdateInput, Prisma.OrganizationInviteUncheckedUpdateInput>;
};
export type OrganizationInviteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
    where: Prisma.OrganizationInviteWhereUniqueInput;
};
export type OrganizationInviteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationInviteWhereInput;
    limit?: number;
};
export type OrganizationInvite$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type OrganizationInviteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationInviteSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationInviteOmit<ExtArgs> | null;
    include?: Prisma.OrganizationInviteInclude<ExtArgs> | null;
};
export {};
