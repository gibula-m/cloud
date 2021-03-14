import { NextFunction, Request } from "express";

export const handle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await next();
};
