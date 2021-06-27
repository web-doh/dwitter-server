import { RequestHandler } from "express";
import { AuthRequest } from "../@customTypes/express";
import * as tweetRepository from "../model/tweets";
import { errorGenerator, respond } from "../util/response";

// type result = tweet | Array<tweet> | number;

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
    const tweet = await tweetRepository.create(body, req.userId || "");
    return respond(res, tweet, 201);
  } catch (err) {
    return errorGenerator(res);
  }
};

/**
  Edit tweets: PUT /tweets/:id
 */
export const editTweet: RequestHandler = async (req: AuthRequest, res) => {
  const id = req.params.id;
  const { body } = req.body;

  try {
    const tweet = await tweetRepository.getOne(id);
    if (!tweet) {
      return errorGenerator(res, 404, `Tweet not found: ${id}`);
    }

    if (tweet.userId !== req.userId) {
      return errorGenerator(res, 403);
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
  const id = req.params.id;

  try {
    const tweet = await tweetRepository.getOne(id);
    if (!tweet) {
      return errorGenerator(res, 404, `Tweet not found: ${id}`);
    }

    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    await tweetRepository.remove(id);

    return respond(res, id);
  } catch (err) {
    return errorGenerator(res);
  }
};
