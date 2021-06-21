import { RequestHandler, Response } from "express";

type user = {
  username: string;
  token: string;
};

const users = [
  {
    id: 1,
    username: "bob",
    name: "bob",
    created_at: "2021-05-09T04:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png",
  },
  {
    id: 2,
    username: "alice",
    name: "alice",
    created_at: "2021-06-02T04:20:57.000Z",
    profile_url:
      "https://cdn.expcloud.co/life/uploads/2020/04/27135731/Fee-gentry-hed-shot-1.jpg",
  },
  {
    id: 3,
    username: "haribo",
    name: "haribo",
    created_at: "2021-06-04T10:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4-300x300.png",
  },
];

const respond = (res: Response, result: user, statusCode: number = 200) => {
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
    Login: POST /auth/login
 */
export const login: RequestHandler = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;

    // Check whether ID exists
    const user = users.find((user) => user.username === username);

    if (!user) {
      return errorGenerator(res, 404, "NO MATCHING USERNAME");
    }

    // Create token
    const signedUser = {
      username: user.username,
      url: user.profile_url,
      token: "abc1234",
    };

    respond(res, signedUser);
  } catch (err) {
    console.log("login failed!", err);

    next(err);
  }
};
