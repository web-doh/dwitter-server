import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorGenerator, respond } from "../util/response";
import * as userRepository from "../model/users";
import { AuthRequest } from "../@customTypes/express";
import { config } from "../config";

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, config.bcrypt.saltRounds);
};

const isValidPassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

const createJwtToken = async (userId: number) => {
  return jwt.sign({ userId }, config.jwt.secretKey, {
    expiresIn: config.jwt.expires,
  });
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
    console.log(newUserId, " id");
    const token = await createJwtToken(newUserId);

    respond(res, { username, token, profile_url }, 201);
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

    return respond(res, { username, token, profile_url: user?.profile_url });
  } catch (err) {
    console.log("login failed!", err);

    next(err);
  }
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
