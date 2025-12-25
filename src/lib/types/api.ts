export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type Pagination<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
