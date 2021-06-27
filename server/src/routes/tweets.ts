import { Router } from "express";
import * as tweetsController from "../controller/tweets";
import { isAuth } from "../middleware/isAuth";

const tweetsRouter = Router();

tweetsRouter.get("/", isAuth, tweetsController.sendTweets);
tweetsRouter.get("/:username", isAuth, tweetsController.sendTweets);
tweetsRouter.post("/", isAuth, tweetsController.createTweet);
tweetsRouter.put("/:id", isAuth, tweetsController.editTweet);
tweetsRouter.delete("/:id", isAuth, tweetsController.deleteTweet);

export default tweetsRouter;
