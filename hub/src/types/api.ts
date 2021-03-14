export interface IResponse<T> {
  status: number;
  body: T;
}
export interface IRegisterBody {
  message: string;
}
