import { Response } from "express";

export const respond = (
  res: Response,
  result?: any,
  statusCode: number = 200
) => {
  return res.status(statusCode).json(result);
};

export const errorGenerator = (
  res: Response,
  statusCode: number = 500,
  errorMsg: string = "SERVER ERROR"
) => {
  return res.status(statusCode).send(errorMsg);
};
