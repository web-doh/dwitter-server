import { Socket } from "./../connection/socket";
import { RequestHandler } from "express";
import { AuthRequest } from "../@customTypes/express";
import * as tweetRepository from "../model/tweets";
import { errorGenerator, respond } from "../util/response";

/**
  Send all tweets: GET /tweets
  Send tweets by username: GET /tweets/:username
 */
export const sendTweets: RequestHandler = async (req, res) => {
  const { username } = req.params;

  try {
    const tweets = await (username
      ? tweetRepository.getAllByUsername(username)
      : tweetRepository.getAll());

    return respond(res, tweets);
  } catch (err) {
    return errorGenerator(res);
  }
};

/**
  Create tweets: POST /tweets
 */
export const createTweet: RequestHandler = async (req: AuthRequest, res) => {
  const { body } = req.body;

  try {
    const tweet = await tweetRepository.create(body, req.userId as number);
    Socket.getSoketIO().emit("tweets-post", tweet); // 새로운 트윗을 브로드캐스팅!

    return respond(res, tweet, 201);
  } catch (err) {
    return errorGenerator(res);
  }
};

/**
  Edit tweets: PUT /tweets/:id
 */
export const editTweet: RequestHandler = async (req: AuthRequest, res) => {
  const id: number = +req.params.id;
  const { body } = req.body;

  try {
    const tweet = await tweetRepository.getOne(id);
    if (!tweet) {
      return errorGenerator(res, 404, `Tweet not found`);
    }

    if (tweet.userId !== req.userId) {
      return errorGenerator(res, 403, "Author and login user do not match.");
    }

    const updated = await tweetRepository.update(id, body);

    return respond(res, updated);
  } catch (err) {
    return errorGenerator(res);
  }
};

/**
  Delete tweets: DELETE /tweets/:id
 */

export const deleteTweet: RequestHandler = async (req: AuthRequest, res) => {
  const id: number = +req.params.id;

  try {
    const tweet = await tweetRepository.getOne(id);
    if (!tweet) {
      return errorGenerator(res, 404, `Tweet not found.`);
    }

    if (tweet.userId !== req.userId) {
      return errorGenerator(res, 403, "Author and login user do not match.");
    }
    await tweetRepository.remove(id);

    return respond(res, id);
  } catch (err) {
    return errorGenerator(res);
  }
};
