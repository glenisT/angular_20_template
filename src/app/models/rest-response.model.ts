export interface RestResponse<T> {
  payload: T;
  errors: ErrorResponse[];
  traceId: string;
}

export interface ErrorResponse {
  code: string;
  field: string;
  validationCode: string;
}
