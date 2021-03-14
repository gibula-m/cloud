import { Request } from "express";
import { registerService } from "../repositories/service";
import { IRegisterBody, IResponse } from "../types/api";

export const register = async (
  req: Request
): Promise<IResponse<IRegisterBody>> => {
  const service = req.params.id;
  const features = req.body;
  const result = await registerService(service, features);
  return {
    status: 200,
    body: {
      message: "OK",
    },
  };
};
