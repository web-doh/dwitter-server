import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorGenerator, respond } from "../util/response";
import * as userRepository from "../model/users";
import { AuthRequest } from "../@customTypes/express";

type resUser = {
  username: string;
  token: string;
  profile_url?: string;
};

// 나중에 옮길 것
const jwtSecretKey = "F2dN7x8HVzBWaQuEEDnhsvHXRWqAR63z";
const jwtExpires = "2d";
const bcryptSaltRounds = 12;

const hashPassword = (password: string) => {
  return bcrypt.hash(password, bcryptSaltRounds);
};

const isValidPassword = (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

const createJwtToken = (userId: string) => {
  return jwt.sign({ userId }, jwtSecretKey, {
    expiresIn: jwtExpires,
  });
};

/**
    Signup: POST /auth/signup
 */
export const signup: RequestHandler = async (req, res) => {
  try {
    const { username, password, name, email, profile_url } = req.body;
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

    const token = createJwtToken(newUserId);

    respond(res, { username, token }, 201);
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

    if (!isValidPassword(password, user.password)) {
      return errorGenerator(res, 401, "Invalid user or password");
    }
    const token = createJwtToken(user.id);

    return respond(res, { username, token });
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
    const id = req.userId || "";
    const user = await userRepository.findById(id);
    if (!user) {
      return errorGenerator(res, 404, "User not found");
    }

    return respond(res, { token: req.token, username: user.username });
  } catch (err) {
    return errorGenerator(res);
  }
};
