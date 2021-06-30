import { user, users } from "./users";

export type tweet = {
  id: string;
  username: string;
  name: string;
  body: string;
  created_at: string;
  modified_at: string | null;
  profile_url?: string;
  userId: string;
};

export type tweets = Array<{
  id: string;
  body: string;
  created_at: string;
  modified_at: string | null;
  userId: string;
}>;

export let initialTweets: tweets = [
  {
    id: "1",
    body: "드림코딩에서 강의 들으면 너무 좋으다",
    created_at: "2021-05-09T04:20:57.000Z",
    modified_at: "2021-05-11T04:20:57.000Z",
    userId: "1",
  },
  {
    id: "2",
    body: "안녕!",
    created_at: "2021-06-02T04:20:57.000Z",
    modified_at: "2021-06-02T04:20:57.000Z",
    userId: "2",
  },
  {
    id: "3",

    body: "주말!",
    created_at: "2021-06-03T04:20:57.000Z",
    modified_at: "2021-06-04T04:20:57.000Z",
    userId: "1",
  },
  {
    id: "4",
    body: "오늘도 좋은 하루!",
    created_at: "2021-06-04T10:20:57.000Z",
    modified_at: "2021-06-04T10:20:57.000Z",
    userId: "3",
  },
  {
    id: "5",
    body: "젤리좋아",
    created_at: "2020-06-04T20:20:57.000Z",
    modified_at: "2020-06-04T20:20:57.000Z",
    userId: "3",
  },
];

export const getAll = async (): Promise<Array<tweet>> => {
  return initialTweets.map((tweet) => {
    const { username, name, profile_url } = users.find(
      (user) => user.id === tweet.userId
    ) as user;
    return { ...tweet, username, name, profile_url };
  });
};

export const getAllByUsername = async (
  username: string
): Promise<Array<tweet>> => {
  return getAll().then((tweets) =>
    tweets.filter((tweet) => tweet.username === username)
  );
};

export const getOne = async (id: string): Promise<tweet | null> => {
  const found = initialTweets.find((tweet) => tweet.id === id);
  if (!found) {
    return null;
  }
  const { username, name, profile_url } = (await users.find(
    (user) => user.id === found.userId
  )) as user;
  return { ...found, username, name, profile_url };
};

export const create = async (
  body: string,
  userId: string
): Promise<tweet | null> => {
  const tweet = {
    id: Math.max(...initialTweets.map((t) => +t.id)) + 1 + "",
    body,
    created_at: new Date().toISOString(),
    modified_at: null,
    userId,
  };
  initialTweets = [tweet, ...initialTweets];
  return getOne(tweet.id);
};

export const update = async (
  id: string,
  body: string
): Promise<tweet | null> => {
  const tweet = initialTweets.find((tweet) => tweet.id === id);
  if (tweet) {
    tweet.body = body;
    tweet.modified_at = new Date().toISOString();
  } else {
    return null;
  }
  return getOne(tweet.id);
};

export const remove = async (id: string) => {
  initialTweets = initialTweets.filter((tweet) => tweet.id !== id);
};
