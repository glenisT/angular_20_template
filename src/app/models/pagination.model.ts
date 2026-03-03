// Used for mapping backend response
export interface Pagination<T> {
  content: T[];
  pageIndex: number;
  pageSize: number;
  length: number;
  totalPages: number;
}