import { RequestHandler, Response } from "express";

type tweet = {
  id: number;
  username: string;
  name: string;
  body: string;
  created_at: string;
  modified_at: string;
  profile_url?: string;
};

type tweets = Array<tweet>;
type result = tweet | tweets | number;

let initialTweets: tweets = [
  {
    id: 1,
    username: "bob",
    name: "bob",
    body: "드림코딩에서 강의 들으면 너무 좋으다",
    created_at: "2021-05-09T04:20:57.000Z",
    modified_at: "2021-05-11T04:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png",
  },
  {
    id: 2,
    username: "alice",
    name: "alice",
    body: "안녕!",
    created_at: "2021-06-02T04:20:57.000Z",
    modified_at: "2021-06-02T04:20:57.000Z",
    profile_url: "",
  },
  {
    id: 3,
    username: "bob",
    name: "bob",
    body: "주말!",
    created_at: "2021-06-03T04:20:57.000Z",
    modified_at: "2021-06-04T04:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png",
  },
  {
    id: 4,
    username: "haribo",
    name: "haribo",
    body: "오늘도 좋은 하루!",
    created_at: "2021-06-04T10:20:57.000Z",
    modified_at: "2021-06-04T10:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4-300x300.png",
  },
  {
    id: 5,
    username: "haribo",
    name: "haribo",
    body: "젤리좋아",
    created_at: "2021-06-04T20:20:57.000Z",
    modified_at: "2021-06-04T20:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4-300x300.png",
  },
];

const respond = (res: Response, result?: result, statusCode: number = 200) => {
  console.log(result);
  return res.status(statusCode).json(result);
};

const errorGenerator = (
  res: Response,
  statusCode: number = 500,
  errorMsg: string = "SERVER ERROR"
) => {
  return res.status(statusCode).send(errorMsg);
};

/**
  Send all tweets: GET /tweets
  Send tweets by username: GET /tweets/:username
 */

export const sendTweets: RequestHandler = async (req, res) => {
  const { username } = req.params;

  try {
    let tweets: tweets;
    if (username) {
      tweets = initialTweets.filter((tweet) => tweet.username === username);
    } else {
      tweets = [...initialTweets];
    }

    respond(res, tweets);
  } catch (err) {
    errorGenerator(res);
  }
};

/**
  Create tweets: POST /tweets
 */

export const saveTweet: RequestHandler = async (req, res) => {
  const { username, name, body, profile_url } = req.body;

  try {
    const newTweet = {
      id: 6,
      username,
      name,
      body,
      created_at: "2021-05-09T04:20:57.000Z",
      modified_at: "2021-05-11T04:20:57.000Z",
      profile_url,
    };
    initialTweets = [newTweet, ...initialTweets];
    respond(res, newTweet, 201);
  } catch (err) {
    errorGenerator(res);
  }
};

/**
  Edit tweets: PUT /tweets/:id
 */

export const editTweet: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const { body } = req.body;

  try {
    const original = initialTweets.find((tweet) => tweet.id === parseInt(id));
    if (!original) {
      return errorGenerator(res, 404, "NOT FOUND");
    }

    const update = { ...original, body, modified_at: Date.now().toString() };

    respond(res, update, 200);
  } catch (err) {
    errorGenerator(res);
  }
};

/**
  Delete tweets: DELETE /tweets/:id
 */

export const deleteTweet: RequestHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const tweetId = initialTweets.find(
      (tweet) => tweet.id === parseInt(id)
    )?.id;
    if (!tweetId) {
      return errorGenerator(res, 404, "NOT FOUND");
    }

    initialTweets = initialTweets.filter((tweet) => tweet.id !== tweetId);

    respond(res, tweetId, 204);
  } catch (err) {
    errorGenerator(res);
  }
};
