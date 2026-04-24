export interface IResponse<T = any> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
}

export interface IPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
