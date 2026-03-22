import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TaskAssigneeModel = runtime.Types.Result.DefaultSelection<Prisma.$TaskAssigneePayload>;
export type AggregateTaskAssignee = {
    _count: TaskAssigneeCountAggregateOutputType | null;
    _min: TaskAssigneeMinAggregateOutputType | null;
    _max: TaskAssigneeMaxAggregateOutputType | null;
};
export type TaskAssigneeMinAggregateOutputType = {
    taskId: string | null;
    userId: string | null;
    assignedAt: Date | null;
};
export type TaskAssigneeMaxAggregateOutputType = {
    taskId: string | null;
    userId: string | null;
    assignedAt: Date | null;
};
export type TaskAssigneeCountAggregateOutputType = {
    taskId: number;
    userId: number;
    assignedAt: number;
    _all: number;
};
export type TaskAssigneeMinAggregateInputType = {
    taskId?: true;
    userId?: true;
    assignedAt?: true;
};
export type TaskAssigneeMaxAggregateInputType = {
    taskId?: true;
    userId?: true;
    assignedAt?: true;
};
export type TaskAssigneeCountAggregateInputType = {
    taskId?: true;
    userId?: true;
    assignedAt?: true;
    _all?: true;
};
export type TaskAssigneeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskAssigneeWhereInput;
    orderBy?: Prisma.TaskAssigneeOrderByWithRelationInput | Prisma.TaskAssigneeOrderByWithRelationInput[];
    cursor?: Prisma.TaskAssigneeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaskAssigneeCountAggregateInputType;
    _min?: TaskAssigneeMinAggregateInputType;
    _max?: TaskAssigneeMaxAggregateInputType;
};
export type GetTaskAssigneeAggregateType<T extends TaskAssigneeAggregateArgs> = {
    [P in keyof T & keyof AggregateTaskAssignee]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTaskAssignee[P]> : Prisma.GetScalarType<T[P], AggregateTaskAssignee[P]>;
};
export type TaskAssigneeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskAssigneeWhereInput;
    orderBy?: Prisma.TaskAssigneeOrderByWithAggregationInput | Prisma.TaskAssigneeOrderByWithAggregationInput[];
    by: Prisma.TaskAssigneeScalarFieldEnum[] | Prisma.TaskAssigneeScalarFieldEnum;
    having?: Prisma.TaskAssigneeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaskAssigneeCountAggregateInputType | true;
    _min?: TaskAssigneeMinAggregateInputType;
    _max?: TaskAssigneeMaxAggregateInputType;
};
export type TaskAssigneeGroupByOutputType = {
    taskId: string;
    userId: string;
    assignedAt: Date;
    _count: TaskAssigneeCountAggregateOutputType | null;
    _min: TaskAssigneeMinAggregateOutputType | null;
    _max: TaskAssigneeMaxAggregateOutputType | null;
};
type GetTaskAssigneeGroupByPayload<T extends TaskAssigneeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaskAssigneeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaskAssigneeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaskAssigneeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaskAssigneeGroupByOutputType[P]>;
}>>;
export type TaskAssigneeWhereInput = {
    AND?: Prisma.TaskAssigneeWhereInput | Prisma.TaskAssigneeWhereInput[];
    OR?: Prisma.TaskAssigneeWhereInput[];
    NOT?: Prisma.TaskAssigneeWhereInput | Prisma.TaskAssigneeWhereInput[];
    taskId?: Prisma.UuidFilter<"TaskAssignee"> | string;
    userId?: Prisma.UuidFilter<"TaskAssignee"> | string;
    assignedAt?: Prisma.DateTimeFilter<"TaskAssignee"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TaskAssigneeOrderByWithRelationInput = {
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TaskAssigneeWhereUniqueInput = Prisma.AtLeast<{
    taskId_userId?: Prisma.TaskAssigneeTaskIdUserIdCompoundUniqueInput;
    AND?: Prisma.TaskAssigneeWhereInput | Prisma.TaskAssigneeWhereInput[];
    OR?: Prisma.TaskAssigneeWhereInput[];
    NOT?: Prisma.TaskAssigneeWhereInput | Prisma.TaskAssigneeWhereInput[];
    taskId?: Prisma.UuidFilter<"TaskAssignee"> | string;
    userId?: Prisma.UuidFilter<"TaskAssignee"> | string;
    assignedAt?: Prisma.DateTimeFilter<"TaskAssignee"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "taskId_userId">;
export type TaskAssigneeOrderByWithAggregationInput = {
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
    _count?: Prisma.TaskAssigneeCountOrderByAggregateInput;
    _max?: Prisma.TaskAssigneeMaxOrderByAggregateInput;
    _min?: Prisma.TaskAssigneeMinOrderByAggregateInput;
};
export type TaskAssigneeScalarWhereWithAggregatesInput = {
    AND?: Prisma.TaskAssigneeScalarWhereWithAggregatesInput | Prisma.TaskAssigneeScalarWhereWithAggregatesInput[];
    OR?: Prisma.TaskAssigneeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TaskAssigneeScalarWhereWithAggregatesInput | Prisma.TaskAssigneeScalarWhereWithAggregatesInput[];
    taskId?: Prisma.UuidWithAggregatesFilter<"TaskAssignee"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"TaskAssignee"> | string;
    assignedAt?: Prisma.DateTimeWithAggregatesFilter<"TaskAssignee"> | Date | string;
};
export type TaskAssigneeCreateInput = {
    assignedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutAssigneesInput;
    user: Prisma.UserCreateNestedOneWithoutTaskAssigneesInput;
};
export type TaskAssigneeUncheckedCreateInput = {
    taskId: string;
    userId: string;
    assignedAt?: Date | string;
};
export type TaskAssigneeUpdateInput = {
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutAssigneesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutTaskAssigneesNestedInput;
};
export type TaskAssigneeUncheckedUpdateInput = {
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAssigneeCreateManyInput = {
    taskId: string;
    userId: string;
    assignedAt?: Date | string;
};
export type TaskAssigneeUpdateManyMutationInput = {
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAssigneeUncheckedUpdateManyInput = {
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAssigneeListRelationFilter = {
    every?: Prisma.TaskAssigneeWhereInput;
    some?: Prisma.TaskAssigneeWhereInput;
    none?: Prisma.TaskAssigneeWhereInput;
};
export type TaskAssigneeOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TaskAssigneeTaskIdUserIdCompoundUniqueInput = {
    taskId: string;
    userId: string;
};
export type TaskAssigneeCountOrderByAggregateInput = {
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
};
export type TaskAssigneeMaxOrderByAggregateInput = {
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
};
export type TaskAssigneeMinOrderByAggregateInput = {
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
};
export type TaskAssigneeCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutUserInput, Prisma.TaskAssigneeUncheckedCreateWithoutUserInput> | Prisma.TaskAssigneeCreateWithoutUserInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutUserInput | Prisma.TaskAssigneeCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskAssigneeCreateManyUserInputEnvelope;
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
};
export type TaskAssigneeUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutUserInput, Prisma.TaskAssigneeUncheckedCreateWithoutUserInput> | Prisma.TaskAssigneeCreateWithoutUserInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutUserInput | Prisma.TaskAssigneeCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskAssigneeCreateManyUserInputEnvelope;
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
};
export type TaskAssigneeUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutUserInput, Prisma.TaskAssigneeUncheckedCreateWithoutUserInput> | Prisma.TaskAssigneeCreateWithoutUserInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutUserInput | Prisma.TaskAssigneeCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskAssigneeCreateManyUserInputEnvelope;
    set?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    disconnect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    delete?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    update?: Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskAssigneeUpdateManyWithWhereWithoutUserInput | Prisma.TaskAssigneeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskAssigneeScalarWhereInput | Prisma.TaskAssigneeScalarWhereInput[];
};
export type TaskAssigneeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutUserInput, Prisma.TaskAssigneeUncheckedCreateWithoutUserInput> | Prisma.TaskAssigneeCreateWithoutUserInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutUserInput | Prisma.TaskAssigneeCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskAssigneeCreateManyUserInputEnvelope;
    set?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    disconnect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    delete?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    update?: Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskAssigneeUpdateManyWithWhereWithoutUserInput | Prisma.TaskAssigneeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskAssigneeScalarWhereInput | Prisma.TaskAssigneeScalarWhereInput[];
};
export type TaskAssigneeCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutTaskInput, Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput> | Prisma.TaskAssigneeCreateWithoutTaskInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput | Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskAssigneeCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
};
export type TaskAssigneeUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutTaskInput, Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput> | Prisma.TaskAssigneeCreateWithoutTaskInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput | Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskAssigneeCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
};
export type TaskAssigneeUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutTaskInput, Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput> | Prisma.TaskAssigneeCreateWithoutTaskInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput | Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskAssigneeCreateManyTaskInputEnvelope;
    set?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    disconnect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    delete?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    update?: Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskAssigneeUpdateManyWithWhereWithoutTaskInput | Prisma.TaskAssigneeUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskAssigneeScalarWhereInput | Prisma.TaskAssigneeScalarWhereInput[];
};
export type TaskAssigneeUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutTaskInput, Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput> | Prisma.TaskAssigneeCreateWithoutTaskInput[] | Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput | Prisma.TaskAssigneeCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskAssigneeUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskAssigneeCreateManyTaskInputEnvelope;
    set?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    disconnect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    delete?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    connect?: Prisma.TaskAssigneeWhereUniqueInput | Prisma.TaskAssigneeWhereUniqueInput[];
    update?: Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskAssigneeUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskAssigneeUpdateManyWithWhereWithoutTaskInput | Prisma.TaskAssigneeUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskAssigneeScalarWhereInput | Prisma.TaskAssigneeScalarWhereInput[];
};
export type TaskAssigneeCreateWithoutUserInput = {
    assignedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutAssigneesInput;
};
export type TaskAssigneeUncheckedCreateWithoutUserInput = {
    taskId: string;
    assignedAt?: Date | string;
};
export type TaskAssigneeCreateOrConnectWithoutUserInput = {
    where: Prisma.TaskAssigneeWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutUserInput, Prisma.TaskAssigneeUncheckedCreateWithoutUserInput>;
};
export type TaskAssigneeCreateManyUserInputEnvelope = {
    data: Prisma.TaskAssigneeCreateManyUserInput | Prisma.TaskAssigneeCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TaskAssigneeUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskAssigneeWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskAssigneeUpdateWithoutUserInput, Prisma.TaskAssigneeUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutUserInput, Prisma.TaskAssigneeUncheckedCreateWithoutUserInput>;
};
export type TaskAssigneeUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskAssigneeWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskAssigneeUpdateWithoutUserInput, Prisma.TaskAssigneeUncheckedUpdateWithoutUserInput>;
};
export type TaskAssigneeUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TaskAssigneeScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskAssigneeUpdateManyMutationInput, Prisma.TaskAssigneeUncheckedUpdateManyWithoutUserInput>;
};
export type TaskAssigneeScalarWhereInput = {
    AND?: Prisma.TaskAssigneeScalarWhereInput | Prisma.TaskAssigneeScalarWhereInput[];
    OR?: Prisma.TaskAssigneeScalarWhereInput[];
    NOT?: Prisma.TaskAssigneeScalarWhereInput | Prisma.TaskAssigneeScalarWhereInput[];
    taskId?: Prisma.UuidFilter<"TaskAssignee"> | string;
    userId?: Prisma.UuidFilter<"TaskAssignee"> | string;
    assignedAt?: Prisma.DateTimeFilter<"TaskAssignee"> | Date | string;
};
export type TaskAssigneeCreateWithoutTaskInput = {
    assignedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTaskAssigneesInput;
};
export type TaskAssigneeUncheckedCreateWithoutTaskInput = {
    userId: string;
    assignedAt?: Date | string;
};
export type TaskAssigneeCreateOrConnectWithoutTaskInput = {
    where: Prisma.TaskAssigneeWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutTaskInput, Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput>;
};
export type TaskAssigneeCreateManyTaskInputEnvelope = {
    data: Prisma.TaskAssigneeCreateManyTaskInput | Prisma.TaskAssigneeCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type TaskAssigneeUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskAssigneeWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskAssigneeUpdateWithoutTaskInput, Prisma.TaskAssigneeUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.TaskAssigneeCreateWithoutTaskInput, Prisma.TaskAssigneeUncheckedCreateWithoutTaskInput>;
};
export type TaskAssigneeUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskAssigneeWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskAssigneeUpdateWithoutTaskInput, Prisma.TaskAssigneeUncheckedUpdateWithoutTaskInput>;
};
export type TaskAssigneeUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.TaskAssigneeScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskAssigneeUpdateManyMutationInput, Prisma.TaskAssigneeUncheckedUpdateManyWithoutTaskInput>;
};
export type TaskAssigneeCreateManyUserInput = {
    taskId: string;
    assignedAt?: Date | string;
};
export type TaskAssigneeUpdateWithoutUserInput = {
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutAssigneesNestedInput;
};
export type TaskAssigneeUncheckedUpdateWithoutUserInput = {
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAssigneeUncheckedUpdateManyWithoutUserInput = {
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAssigneeCreateManyTaskInput = {
    userId: string;
    assignedAt?: Date | string;
};
export type TaskAssigneeUpdateWithoutTaskInput = {
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTaskAssigneesNestedInput;
};
export type TaskAssigneeUncheckedUpdateWithoutTaskInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAssigneeUncheckedUpdateManyWithoutTaskInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAssigneeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    taskId?: boolean;
    userId?: boolean;
    assignedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskAssignee"]>;
export type TaskAssigneeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    taskId?: boolean;
    userId?: boolean;
    assignedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskAssignee"]>;
export type TaskAssigneeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    taskId?: boolean;
    userId?: boolean;
    assignedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskAssignee"]>;
export type TaskAssigneeSelectScalar = {
    taskId?: boolean;
    userId?: boolean;
    assignedAt?: boolean;
};
export type TaskAssigneeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"taskId" | "userId" | "assignedAt", ExtArgs["result"]["taskAssignee"]>;
export type TaskAssigneeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TaskAssigneeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TaskAssigneeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TaskAssigneePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TaskAssignee";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        taskId: string;
        userId: string;
        assignedAt: Date;
    }, ExtArgs["result"]["taskAssignee"]>;
    composites: {};
};
export type TaskAssigneeGetPayload<S extends boolean | null | undefined | TaskAssigneeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload, S>;
export type TaskAssigneeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TaskAssigneeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaskAssigneeCountAggregateInputType | true;
};
export interface TaskAssigneeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TaskAssignee'];
        meta: {
            name: 'TaskAssignee';
        };
    };
    findUnique<T extends TaskAssigneeFindUniqueArgs>(args: Prisma.SelectSubset<T, TaskAssigneeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TaskAssigneeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TaskAssigneeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TaskAssigneeFindFirstArgs>(args?: Prisma.SelectSubset<T, TaskAssigneeFindFirstArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TaskAssigneeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TaskAssigneeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TaskAssigneeFindManyArgs>(args?: Prisma.SelectSubset<T, TaskAssigneeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TaskAssigneeCreateArgs>(args: Prisma.SelectSubset<T, TaskAssigneeCreateArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TaskAssigneeCreateManyArgs>(args?: Prisma.SelectSubset<T, TaskAssigneeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TaskAssigneeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TaskAssigneeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TaskAssigneeDeleteArgs>(args: Prisma.SelectSubset<T, TaskAssigneeDeleteArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TaskAssigneeUpdateArgs>(args: Prisma.SelectSubset<T, TaskAssigneeUpdateArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TaskAssigneeDeleteManyArgs>(args?: Prisma.SelectSubset<T, TaskAssigneeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TaskAssigneeUpdateManyArgs>(args: Prisma.SelectSubset<T, TaskAssigneeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TaskAssigneeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TaskAssigneeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TaskAssigneeUpsertArgs>(args: Prisma.SelectSubset<T, TaskAssigneeUpsertArgs<ExtArgs>>): Prisma.Prisma__TaskAssigneeClient<runtime.Types.Result.GetResult<Prisma.$TaskAssigneePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TaskAssigneeCountArgs>(args?: Prisma.Subset<T, TaskAssigneeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaskAssigneeCountAggregateOutputType> : number>;
    aggregate<T extends TaskAssigneeAggregateArgs>(args: Prisma.Subset<T, TaskAssigneeAggregateArgs>): Prisma.PrismaPromise<GetTaskAssigneeAggregateType<T>>;
    groupBy<T extends TaskAssigneeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TaskAssigneeGroupByArgs['orderBy'];
    } : {
        orderBy?: TaskAssigneeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TaskAssigneeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskAssigneeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TaskAssigneeFieldRefs;
}
export interface Prisma__TaskAssigneeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TaskAssigneeFieldRefs {
    readonly taskId: Prisma.FieldRef<"TaskAssignee", 'String'>;
    readonly userId: Prisma.FieldRef<"TaskAssignee", 'String'>;
    readonly assignedAt: Prisma.FieldRef<"TaskAssignee", 'DateTime'>;
}
export type TaskAssigneeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
    where: Prisma.TaskAssigneeWhereUniqueInput;
};
export type TaskAssigneeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
    where: Prisma.TaskAssigneeWhereUniqueInput;
};
export type TaskAssigneeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TaskAssigneeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TaskAssigneeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TaskAssigneeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskAssigneeCreateInput, Prisma.TaskAssigneeUncheckedCreateInput>;
};
export type TaskAssigneeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TaskAssigneeCreateManyInput | Prisma.TaskAssigneeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TaskAssigneeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    data: Prisma.TaskAssigneeCreateManyInput | Prisma.TaskAssigneeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TaskAssigneeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TaskAssigneeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskAssigneeUpdateInput, Prisma.TaskAssigneeUncheckedUpdateInput>;
    where: Prisma.TaskAssigneeWhereUniqueInput;
};
export type TaskAssigneeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TaskAssigneeUpdateManyMutationInput, Prisma.TaskAssigneeUncheckedUpdateManyInput>;
    where?: Prisma.TaskAssigneeWhereInput;
    limit?: number;
};
export type TaskAssigneeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskAssigneeUpdateManyMutationInput, Prisma.TaskAssigneeUncheckedUpdateManyInput>;
    where?: Prisma.TaskAssigneeWhereInput;
    limit?: number;
    include?: Prisma.TaskAssigneeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TaskAssigneeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
    where: Prisma.TaskAssigneeWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskAssigneeCreateInput, Prisma.TaskAssigneeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TaskAssigneeUpdateInput, Prisma.TaskAssigneeUncheckedUpdateInput>;
};
export type TaskAssigneeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
    where: Prisma.TaskAssigneeWhereUniqueInput;
};
export type TaskAssigneeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskAssigneeWhereInput;
    limit?: number;
};
export type TaskAssigneeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAssigneeSelect<ExtArgs> | null;
    omit?: Prisma.TaskAssigneeOmit<ExtArgs> | null;
    include?: Prisma.TaskAssigneeInclude<ExtArgs> | null;
};
export {};
