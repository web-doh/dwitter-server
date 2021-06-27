export type user = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  created_at: string;
  profile_url?: string;
};

// abcd1234: $2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm
export let users: Array<user> = [
  {
    id: "1",
    username: "bob",
    password: "$2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm",
    name: "bob",
    email: "bob@abc.com",
    created_at: "2021-05-09T04:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png",
  },
  {
    id: "2",
    username: "alice",
    password: "$2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm",
    name: "alice",
    email: "alice@abc.com",
    created_at: "2021-06-02T04:20:57.000Z",
    profile_url:
      "https://cdn.expcloud.co/life/uploads/2020/04/27135731/Fee-gentry-hed-shot-1.jpg",
  },
  {
    id: "3",
    username: "haribo",
    password: "$2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm",
    name: "haribo",
    email: "haribo@abc.com",
    created_at: "2021-06-04T10:20:57.000Z",
    profile_url:
      "https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4-300x300.png",
  },
];

export const findByUsername = async (
  username: string
): Promise<user | undefined> => {
  return users.find((user) => user.username === username);
};

export const findById = async (id: string): Promise<user | undefined> => {
  return users.find((user) => user.id === id);
};

export const createUser = async (user: {
  username: string;
  password: string;
  name: string;
  email: string;
  profile_url?: string;
}): Promise<string> => {
  const created = {
    ...user,
    id: Math.max(...users.map((t) => +t.id)) + 1 + "",
    created_at: new Date().toISOString(),
  };
  users.push(created);
  return created.id;
};
