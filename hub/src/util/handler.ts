import { NextFunction, Request, Response } from "express";
import { IResponse } from "../types/api";

export function handle<T>(
  action: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<IResponse<T>>
) {
  return async (req: Request, res: Response, next: any) => {
    const response = await action(req, res, next);

    res.statusCode = response.status || 200;
    res.send(response.body || []);
  };
}
