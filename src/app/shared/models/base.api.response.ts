export interface BaseApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: BaseApiErrorResponse;
}

export interface BaseApiErrorResponse {
  code: string;
  message: string;
  details?: any[];
}
