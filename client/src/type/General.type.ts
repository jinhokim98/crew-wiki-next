export type PaginationResponse<T> = {
  page: number;
  totalPage: number;
  data: T;
};

export type PaginationParams = {
  pageNumber: number;
  pageSize: number;
  sort: string;
  sortDirection: 'ASC' | 'DESC';
};
