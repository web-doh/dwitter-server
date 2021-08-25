import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthRequest } from "../@customTypes/express";
import * as userRepository from "../model/users";
import { errorGenerator } from "../util/response";

const AUTH_ERROR = { message: "Authentication Error" };

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Cookie (for Browser)
  // 2. Header (for Non-Browser)
  let token: string = "";
  // header에 토큰있는지 확인
  const authHeader = req.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // header에 토큰 없으면, 쿠키 확인
  if (!token) {
    token = req.cookies["token"];
  }

  if (!token) {
    return errorGenerator(res, 401, AUTH_ERROR.message);
  }

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return errorGenerator(res, 401, AUTH_ERROR.message);
    }
    const user = await userRepository.findById(decoded?.userId);

    if (!user) {
      return errorGenerator(res, 401, AUTH_ERROR.message);
    }
    req.userId = user.id;
    req.token = token;

    next();
  });
};
