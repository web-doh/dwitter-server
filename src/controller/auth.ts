import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorGenerator, respond } from "../util/response";
import * as userRepository from "../model/auth";
import { AuthRequest } from "../@customTypes/express";
import { config } from "../config";
import { CookieOptions, Response } from "express-serve-static-core";

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, config.bcrypt.saltRounds);
};

const isValidPassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

const createJwtToken = async (userId: number) => {
  return jwt.sign({ userId }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInDay,
  });
};

//  xss 보안
const setToken = (res: Response, token: string) => {
  const options: CookieOptions = {
    maxAge: +config.jwt.expiresInDay.replace(/[a-z]/gi, "") * 3600 * 24 * 1000, // ms 단위
    httpOnly: true,
    sameSite: "none", // server-client의 도메인이 달라도 동작하도록
    secure: true, // sameSite: 'none'이면 secure: true
    // -> https 프로토콜이나 localhost 에서만 쿠키가 헤더에 담겨서 보내짐
  };

  res.cookie("token", token, options);
};

/**
    Signup: POST /auth/signup
 */
export const signup: RequestHandler = async (req, res) => {
  try {
    const {
      username,
      password1: password,
      name,
      email,
      profile_url,
    } = req.body;

    const found = await userRepository.findByUsername(username);
    if (found) {
      return errorGenerator(res, 409, "already exists");
    }
    const hashed = await hashPassword(password);
    const newUserId = await userRepository.createUser({
      username,
      password: hashed,
      name,
      email,
      profile_url,
    });

    const token = await createJwtToken(newUserId); // cookie header
    setToken(res, token);
    respond(res, { username, token, profile_url }, 201); // 모바일 등을 위해 여전히 바디에도 token 전달
  } catch (err) {
    return errorGenerator(res);
  }
};

/**
    Login: POST /auth/login
 */
export const login: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      return errorGenerator(res, 401, "Invalid user or password");
    }

    if (!(await isValidPassword(password, user.password))) {
      return errorGenerator(res, 401, "Invalid user or password");
    }
    const token = await createJwtToken(user.id);
    setToken(res, token);
    return respond(res, { username, token, profile_url: user?.profile_url });
  } catch (err) {
    console.log("login failed!", err);

    next(err);
  }
};

/**
    Logout: POST /auth/logout
 */
export const logout: RequestHandler = async (req: AuthRequest, res) => {
  res.cookie("token", "");
  respond(res, { message: "Success Logout!" });
};

/**
    Me: GET /auth/me
 */
export const me: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const id = req.userId || -1;
    const user = await userRepository.findById(id);
    if (!user) {
      return errorGenerator(res, 404, "User not found");
    }

    return respond(res, {
      token: req.token,
      username: user.username,
      profile_url: user?.profile_url,
    });
  } catch (err) {
    return errorGenerator(res);
  }
};

/**
  CSRFToken: GET /auth/csrf-token
 */

export const csrfToken: RequestHandler = async (req: AuthRequest, res) => {
  const csrfToken = await generateCSRFToken();
  respond(res, { csrfToken });
};

const generateCSRFToken = async () => {
  return bcrypt.hash(config.csrf.plainToken, 1); // 랜덤한 토큰을 만들기 위해 사용
};
