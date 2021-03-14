import { Request } from "express";
import { getConnection } from "typeorm";
import {
  registerService,
  getAllServices,
  getAllFeatures,
} from "../repositories/service";
import {
  IFeaturesBody,
  IRegisterBody,
  IResponse,
  IServicesBody,
} from "../types/api";

export const register = async (
  req: Request
): Promise<IResponse<IRegisterBody>> => {
  const service = req.params.id;
  const features = req.body;
  await registerService(service, features);
  return {
    status: 200,
    body: {
      message: "OK",
    },
  };
};

export const getServices = async (
  req: Request
): Promise<IResponse<IServicesBody>> => {
  const result = await getAllServices(getConnection());
  return {
    status: 200,
    body: {
      services: result,
    },
  };
};
export const getFeatures = async (
  req: Request
): Promise<IResponse<IFeaturesBody | string>> => {
  const result = await getAllFeatures(getConnection(), req.params.name);
  if (result) {
    return {
      status: 200,
      body: {
        features: result,
      },
    };
  } else {
    return {
      status: 400,
      body: "Wrong service",
    };
  }
};
