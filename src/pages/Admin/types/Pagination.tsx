export type Pagination = {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRow: number;
  keyword: string;
};

export const defaultPagination: Pagination = {
  pageIndex: 1,
  pageSize: 10,
  totalPages: 0,
  totalRow: 0,
  keyword: "",
};

