import { Request } from "express";
import { IRegisterBody, IResponse } from "../types/api";

export const register = async (
  req: Request
): Promise<IResponse<IRegisterBody>> => {
  const service = req.params.id;
  const features = req.body;
  console.log(features);
  return {
    status: 200,
    body: {
      message: "OK",
    },
  };
};
