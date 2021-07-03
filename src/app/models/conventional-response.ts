export interface ConventionalResponse<T> {
  data: T | null;
  errors: {errorCode: string}[] | null;
}
