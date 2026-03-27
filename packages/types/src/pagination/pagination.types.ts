export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationParams extends PaginationQuery {
  skip: number;
  take: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}
