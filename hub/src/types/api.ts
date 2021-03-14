export interface IResponse<T> {
  status: number;
  body: T;
}
export interface IRegisterBody {
  message: string;
}

export interface IServicesBody {
  services: string[];
}
export interface IFeaturesBody {
  features: string[];
}
