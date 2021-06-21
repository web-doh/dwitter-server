import { Router } from "express";
import {
  deleteTweet,
  editTweet,
  saveTweet,
  sendTweets,
} from "./tweets.controller";

const tweetsRouter = Router();

tweetsRouter.get("/", sendTweets);
tweetsRouter.get("/:username", sendTweets);
tweetsRouter.post("/", saveTweet);
tweetsRouter.put("/:id", editTweet);
tweetsRouter.delete("/:id", deleteTweet);

export default tweetsRouter;
