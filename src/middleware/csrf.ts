import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import { AuthRequest } from "../@customTypes/express";
import { config } from "../config";
import { errorGenerator } from "../util/response";

const CSRF_ERROR = { message: "Failed CSRF check" };

export const csrfCheck = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    req.method === "GET" ||
    req.method === "OPTIONS" ||
    req.method === "HEAD"
  ) {
    return next();
  }

  const csrfHeader = req.get("dwitter-csrf-token");
  if (!csrfHeader) {
    console.warn(
      'Missing required "dwitter-csrf-token" header',
      req.headers.origin
    );
    return errorGenerator(res, 403, CSRF_ERROR.message);
  }

  validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "dwitter-csrf-token" header does not validate.',
          req.headers.origin,
          csrfHeader
        );
        return errorGenerator(res, 403, CSRF_ERROR.message);
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return errorGenerator(res, 500, "Server Error");
    });
};

const validateCsrfToken = async (csrfHeader: string): Promise<boolean> => {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
};
