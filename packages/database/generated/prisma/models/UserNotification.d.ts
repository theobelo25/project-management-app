import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type UserNotificationModel = runtime.Types.Result.DefaultSelection<Prisma.$UserNotificationPayload>;
export type AggregateUserNotification = {
    _count: UserNotificationCountAggregateOutputType | null;
    _min: UserNotificationMinAggregateOutputType | null;
    _max: UserNotificationMaxAggregateOutputType | null;
};
export type UserNotificationMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: string | null;
    title: string | null;
    body: string | null;
    createdAt: Date | null;
    clearedAt: Date | null;
};
export type UserNotificationMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: string | null;
    title: string | null;
    body: string | null;
    createdAt: Date | null;
    clearedAt: Date | null;
};
export type UserNotificationCountAggregateOutputType = {
    id: number;
    userId: number;
    type: number;
    title: number;
    body: number;
    meta: number;
    createdAt: number;
    clearedAt: number;
    _all: number;
};
export type UserNotificationMinAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    title?: true;
    body?: true;
    createdAt?: true;
    clearedAt?: true;
};
export type UserNotificationMaxAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    title?: true;
    body?: true;
    createdAt?: true;
    clearedAt?: true;
};
export type UserNotificationCountAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    title?: true;
    body?: true;
    meta?: true;
    createdAt?: true;
    clearedAt?: true;
    _all?: true;
};
export type UserNotificationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserNotificationWhereInput;
    orderBy?: Prisma.UserNotificationOrderByWithRelationInput | Prisma.UserNotificationOrderByWithRelationInput[];
    cursor?: Prisma.UserNotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserNotificationCountAggregateInputType;
    _min?: UserNotificationMinAggregateInputType;
    _max?: UserNotificationMaxAggregateInputType;
};
export type GetUserNotificationAggregateType<T extends UserNotificationAggregateArgs> = {
    [P in keyof T & keyof AggregateUserNotification]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserNotification[P]> : Prisma.GetScalarType<T[P], AggregateUserNotification[P]>;
};
export type UserNotificationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserNotificationWhereInput;
    orderBy?: Prisma.UserNotificationOrderByWithAggregationInput | Prisma.UserNotificationOrderByWithAggregationInput[];
    by: Prisma.UserNotificationScalarFieldEnum[] | Prisma.UserNotificationScalarFieldEnum;
    having?: Prisma.UserNotificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserNotificationCountAggregateInputType | true;
    _min?: UserNotificationMinAggregateInputType;
    _max?: UserNotificationMaxAggregateInputType;
};
export type UserNotificationGroupByOutputType = {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string | null;
    meta: runtime.JsonValue | null;
    createdAt: Date;
    clearedAt: Date | null;
    _count: UserNotificationCountAggregateOutputType | null;
    _min: UserNotificationMinAggregateOutputType | null;
    _max: UserNotificationMaxAggregateOutputType | null;
};
type GetUserNotificationGroupByPayload<T extends UserNotificationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserNotificationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserNotificationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserNotificationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserNotificationGroupByOutputType[P]>;
}>>;
export type UserNotificationWhereInput = {
    AND?: Prisma.UserNotificationWhereInput | Prisma.UserNotificationWhereInput[];
    OR?: Prisma.UserNotificationWhereInput[];
    NOT?: Prisma.UserNotificationWhereInput | Prisma.UserNotificationWhereInput[];
    id?: Prisma.UuidFilter<"UserNotification"> | string;
    userId?: Prisma.UuidFilter<"UserNotification"> | string;
    type?: Prisma.StringFilter<"UserNotification"> | string;
    title?: Prisma.StringFilter<"UserNotification"> | string;
    body?: Prisma.StringNullableFilter<"UserNotification"> | string | null;
    meta?: Prisma.JsonNullableFilter<"UserNotification">;
    createdAt?: Prisma.DateTimeFilter<"UserNotification"> | Date | string;
    clearedAt?: Prisma.DateTimeNullableFilter<"UserNotification"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserNotificationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrderInput | Prisma.SortOrder;
    meta?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    clearedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type UserNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.UserNotificationWhereInput | Prisma.UserNotificationWhereInput[];
    OR?: Prisma.UserNotificationWhereInput[];
    NOT?: Prisma.UserNotificationWhereInput | Prisma.UserNotificationWhereInput[];
    userId?: Prisma.UuidFilter<"UserNotification"> | string;
    type?: Prisma.StringFilter<"UserNotification"> | string;
    title?: Prisma.StringFilter<"UserNotification"> | string;
    body?: Prisma.StringNullableFilter<"UserNotification"> | string | null;
    meta?: Prisma.JsonNullableFilter<"UserNotification">;
    createdAt?: Prisma.DateTimeFilter<"UserNotification"> | Date | string;
    clearedAt?: Prisma.DateTimeNullableFilter<"UserNotification"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type UserNotificationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrderInput | Prisma.SortOrder;
    meta?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    clearedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.UserNotificationCountOrderByAggregateInput;
    _max?: Prisma.UserNotificationMaxOrderByAggregateInput;
    _min?: Prisma.UserNotificationMinOrderByAggregateInput;
};
export type UserNotificationScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserNotificationScalarWhereWithAggregatesInput | Prisma.UserNotificationScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserNotificationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserNotificationScalarWhereWithAggregatesInput | Prisma.UserNotificationScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"UserNotification"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"UserNotification"> | string;
    type?: Prisma.StringWithAggregatesFilter<"UserNotification"> | string;
    title?: Prisma.StringWithAggregatesFilter<"UserNotification"> | string;
    body?: Prisma.StringNullableWithAggregatesFilter<"UserNotification"> | string | null;
    meta?: Prisma.JsonNullableWithAggregatesFilter<"UserNotification">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserNotification"> | Date | string;
    clearedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"UserNotification"> | Date | string | null;
};
export type UserNotificationCreateInput = {
    id?: string;
    type: string;
    title: string;
    body?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    clearedAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutUserNotificationsInput;
};
export type UserNotificationUncheckedCreateInput = {
    id?: string;
    userId: string;
    type: string;
    title: string;
    body?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    clearedAt?: Date | string | null;
};
export type UserNotificationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clearedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutUserNotificationsNestedInput;
};
export type UserNotificationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clearedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserNotificationCreateManyInput = {
    id?: string;
    userId: string;
    type: string;
    title: string;
    body?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    clearedAt?: Date | string | null;
};
export type UserNotificationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clearedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserNotificationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clearedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserNotificationListRelationFilter = {
    every?: Prisma.UserNotificationWhereInput;
    some?: Prisma.UserNotificationWhereInput;
    none?: Prisma.UserNotificationWhereInput;
};
export type UserNotificationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserNotificationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    meta?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    clearedAt?: Prisma.SortOrder;
};
export type UserNotificationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    clearedAt?: Prisma.SortOrder;
};
export type UserNotificationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    clearedAt?: Prisma.SortOrder;
};
export type UserNotificationCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserNotificationCreateWithoutUserInput, Prisma.UserNotificationUncheckedCreateWithoutUserInput> | Prisma.UserNotificationCreateWithoutUserInput[] | Prisma.UserNotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserNotificationCreateOrConnectWithoutUserInput | Prisma.UserNotificationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserNotificationCreateManyUserInputEnvelope;
    connect?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
};
export type UserNotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserNotificationCreateWithoutUserInput, Prisma.UserNotificationUncheckedCreateWithoutUserInput> | Prisma.UserNotificationCreateWithoutUserInput[] | Prisma.UserNotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserNotificationCreateOrConnectWithoutUserInput | Prisma.UserNotificationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserNotificationCreateManyUserInputEnvelope;
    connect?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
};
export type UserNotificationUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserNotificationCreateWithoutUserInput, Prisma.UserNotificationUncheckedCreateWithoutUserInput> | Prisma.UserNotificationCreateWithoutUserInput[] | Prisma.UserNotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserNotificationCreateOrConnectWithoutUserInput | Prisma.UserNotificationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserNotificationUpsertWithWhereUniqueWithoutUserInput | Prisma.UserNotificationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserNotificationCreateManyUserInputEnvelope;
    set?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    disconnect?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    delete?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    connect?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    update?: Prisma.UserNotificationUpdateWithWhereUniqueWithoutUserInput | Prisma.UserNotificationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserNotificationUpdateManyWithWhereWithoutUserInput | Prisma.UserNotificationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserNotificationScalarWhereInput | Prisma.UserNotificationScalarWhereInput[];
};
export type UserNotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserNotificationCreateWithoutUserInput, Prisma.UserNotificationUncheckedCreateWithoutUserInput> | Prisma.UserNotificationCreateWithoutUserInput[] | Prisma.UserNotificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserNotificationCreateOrConnectWithoutUserInput | Prisma.UserNotificationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserNotificationUpsertWithWhereUniqueWithoutUserInput | Prisma.UserNotificationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserNotificationCreateManyUserInputEnvelope;
    set?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    disconnect?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    delete?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    connect?: Prisma.UserNotificationWhereUniqueInput | Prisma.UserNotificationWhereUniqueInput[];
    update?: Prisma.UserNotificationUpdateWithWhereUniqueWithoutUserInput | Prisma.UserNotificationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserNotificationUpdateManyWithWhereWithoutUserInput | Prisma.UserNotificationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserNotificationScalarWhereInput | Prisma.UserNotificationScalarWhereInput[];
};
export type UserNotificationCreateWithoutUserInput = {
    id?: string;
    type: string;
    title: string;
    body?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    clearedAt?: Date | string | null;
};
export type UserNotificationUncheckedCreateWithoutUserInput = {
    id?: string;
    type: string;
    title: string;
    body?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    clearedAt?: Date | string | null;
};
export type UserNotificationCreateOrConnectWithoutUserInput = {
    where: Prisma.UserNotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserNotificationCreateWithoutUserInput, Prisma.UserNotificationUncheckedCreateWithoutUserInput>;
};
export type UserNotificationCreateManyUserInputEnvelope = {
    data: Prisma.UserNotificationCreateManyUserInput | Prisma.UserNotificationCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserNotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserNotificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserNotificationUpdateWithoutUserInput, Prisma.UserNotificationUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserNotificationCreateWithoutUserInput, Prisma.UserNotificationUncheckedCreateWithoutUserInput>;
};
export type UserNotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserNotificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserNotificationUpdateWithoutUserInput, Prisma.UserNotificationUncheckedUpdateWithoutUserInput>;
};
export type UserNotificationUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserNotificationScalarWhereInput;
    data: Prisma.XOR<Prisma.UserNotificationUpdateManyMutationInput, Prisma.UserNotificationUncheckedUpdateManyWithoutUserInput>;
};
export type UserNotificationScalarWhereInput = {
    AND?: Prisma.UserNotificationScalarWhereInput | Prisma.UserNotificationScalarWhereInput[];
    OR?: Prisma.UserNotificationScalarWhereInput[];
    NOT?: Prisma.UserNotificationScalarWhereInput | Prisma.UserNotificationScalarWhereInput[];
    id?: Prisma.UuidFilter<"UserNotification"> | string;
    userId?: Prisma.UuidFilter<"UserNotification"> | string;
    type?: Prisma.StringFilter<"UserNotification"> | string;
    title?: Prisma.StringFilter<"UserNotification"> | string;
    body?: Prisma.StringNullableFilter<"UserNotification"> | string | null;
    meta?: Prisma.JsonNullableFilter<"UserNotification">;
    createdAt?: Prisma.DateTimeFilter<"UserNotification"> | Date | string;
    clearedAt?: Prisma.DateTimeNullableFilter<"UserNotification"> | Date | string | null;
};
export type UserNotificationCreateManyUserInput = {
    id?: string;
    type: string;
    title: string;
    body?: string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    clearedAt?: Date | string | null;
};
export type UserNotificationUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clearedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserNotificationUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clearedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserNotificationUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    meta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clearedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserNotificationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    body?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    clearedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userNotification"]>;
export type UserNotificationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    body?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    clearedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userNotification"]>;
export type UserNotificationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    body?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    clearedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userNotification"]>;
export type UserNotificationSelectScalar = {
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    body?: boolean;
    meta?: boolean;
    createdAt?: boolean;
    clearedAt?: boolean;
};
export type UserNotificationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "type" | "title" | "body" | "meta" | "createdAt" | "clearedAt", ExtArgs["result"]["userNotification"]>;
export type UserNotificationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserNotificationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserNotificationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserNotificationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserNotification";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        type: string;
        title: string;
        body: string | null;
        meta: runtime.JsonValue | null;
        createdAt: Date;
        clearedAt: Date | null;
    }, ExtArgs["result"]["userNotification"]>;
    composites: {};
};
export type UserNotificationGetPayload<S extends boolean | null | undefined | UserNotificationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload, S>;
export type UserNotificationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserNotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserNotificationCountAggregateInputType | true;
};
export interface UserNotificationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserNotification'];
        meta: {
            name: 'UserNotification';
        };
    };
    findUnique<T extends UserNotificationFindUniqueArgs>(args: Prisma.SelectSubset<T, UserNotificationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserNotificationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserNotificationFindFirstArgs>(args?: Prisma.SelectSubset<T, UserNotificationFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserNotificationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserNotificationFindManyArgs>(args?: Prisma.SelectSubset<T, UserNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserNotificationCreateArgs>(args: Prisma.SelectSubset<T, UserNotificationCreateArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserNotificationCreateManyArgs>(args?: Prisma.SelectSubset<T, UserNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserNotificationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserNotificationDeleteArgs>(args: Prisma.SelectSubset<T, UserNotificationDeleteArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserNotificationUpdateArgs>(args: Prisma.SelectSubset<T, UserNotificationUpdateArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserNotificationDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserNotificationUpdateManyArgs>(args: Prisma.SelectSubset<T, UserNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserNotificationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserNotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserNotificationUpsertArgs>(args: Prisma.SelectSubset<T, UserNotificationUpsertArgs<ExtArgs>>): Prisma.Prisma__UserNotificationClient<runtime.Types.Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserNotificationCountArgs>(args?: Prisma.Subset<T, UserNotificationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserNotificationCountAggregateOutputType> : number>;
    aggregate<T extends UserNotificationAggregateArgs>(args: Prisma.Subset<T, UserNotificationAggregateArgs>): Prisma.PrismaPromise<GetUserNotificationAggregateType<T>>;
    groupBy<T extends UserNotificationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserNotificationGroupByArgs['orderBy'];
    } : {
        orderBy?: UserNotificationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserNotificationFieldRefs;
}
export interface Prisma__UserNotificationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserNotificationFieldRefs {
    readonly id: Prisma.FieldRef<"UserNotification", 'String'>;
    readonly userId: Prisma.FieldRef<"UserNotification", 'String'>;
    readonly type: Prisma.FieldRef<"UserNotification", 'String'>;
    readonly title: Prisma.FieldRef<"UserNotification", 'String'>;
    readonly body: Prisma.FieldRef<"UserNotification", 'String'>;
    readonly meta: Prisma.FieldRef<"UserNotification", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"UserNotification", 'DateTime'>;
    readonly clearedAt: Prisma.FieldRef<"UserNotification", 'DateTime'>;
}
export type UserNotificationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
    where: Prisma.UserNotificationWhereUniqueInput;
};
export type UserNotificationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
    where: Prisma.UserNotificationWhereUniqueInput;
};
export type UserNotificationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserNotificationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserNotificationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserNotificationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserNotificationCreateInput, Prisma.UserNotificationUncheckedCreateInput>;
};
export type UserNotificationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserNotificationCreateManyInput | Prisma.UserNotificationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserNotificationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    data: Prisma.UserNotificationCreateManyInput | Prisma.UserNotificationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserNotificationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserNotificationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserNotificationUpdateInput, Prisma.UserNotificationUncheckedUpdateInput>;
    where: Prisma.UserNotificationWhereUniqueInput;
};
export type UserNotificationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserNotificationUpdateManyMutationInput, Prisma.UserNotificationUncheckedUpdateManyInput>;
    where?: Prisma.UserNotificationWhereInput;
    limit?: number;
};
export type UserNotificationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserNotificationUpdateManyMutationInput, Prisma.UserNotificationUncheckedUpdateManyInput>;
    where?: Prisma.UserNotificationWhereInput;
    limit?: number;
    include?: Prisma.UserNotificationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserNotificationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
    where: Prisma.UserNotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserNotificationCreateInput, Prisma.UserNotificationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserNotificationUpdateInput, Prisma.UserNotificationUncheckedUpdateInput>;
};
export type UserNotificationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
    where: Prisma.UserNotificationWhereUniqueInput;
};
export type UserNotificationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserNotificationWhereInput;
    limit?: number;
};
export type UserNotificationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserNotificationSelect<ExtArgs> | null;
    omit?: Prisma.UserNotificationOmit<ExtArgs> | null;
    include?: Prisma.UserNotificationInclude<ExtArgs> | null;
};
export {};
