import { Router } from "express";
import * as authController from "../controller/auth";
import { isAuth } from "../middleware/isAuth";

const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.get("/me", isAuth, authController.me);

export default authRouter;
