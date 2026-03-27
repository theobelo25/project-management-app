import {
  PaginationParams,
  PaginationQuery,
  PaginationResult,
} from '@repo/types';

export function getPaginationParams(query: PaginationQuery): PaginationParams {
  const page = query.page;
  const limit = query.limit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPaginationResult<T>(
  data: T[],
  total: number,
  query: PaginationQuery,
): PaginationResult<T> {
  const pageCount = total === 0 ? 0 : Math.ceil(total / query.limit);

  return {
    data,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      pageCount,
      hasNextPage: query.page < pageCount,
      hasPreviousPage: query.page > 1,
    },
  };
}
