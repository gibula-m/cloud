import { Request } from "express";
import { IRegisterBody, IResponse } from "../types/api";

export const register = async (
  req: Request
): Promise<IResponse<IRegisterBody>> => {
  return {
    status: 200,
    body: {
      message: "OK",
    },
  };
};
