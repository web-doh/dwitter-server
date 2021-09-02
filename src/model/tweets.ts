import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./../db/database";

export type tweet = {
  id: number;
  username: string;
  name: string;
  body: string;
  created_at: string;
  modified_at: string | null;
  profile_url?: string;
  userId: number;
};

const SELECT_JOIN =
  "SELECT tw.id, tw.body, tw.created_at, tw.modified_at, tw.userId, us.username, us.name, us.profile_url FROM tweets as tw JOIN users as us ON tw.userId=us.id";
const ORDER_DESC = "ORDER BY tw.created_at DESC";
export const getAll = async (): Promise<Array<tweet>> => {
  return db
    .execute(`${SELECT_JOIN} ${ORDER_DESC}`) //
    .then((result) => (result as RowDataPacket)[0]);
};

export const getAllByUsername = async (
  username: string
): Promise<Array<tweet>> => {
  return db
    .execute(`${SELECT_JOIN} WHERE username=? ${ORDER_DESC}`, [username]) //
    .then((result) => (result as RowDataPacket)[0]);
};

export const getOne = async (id: number): Promise<tweet | null> => {
  return db
    .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id]) //
    .then((result) => (result[0] as RowDataPacket)[0]);
};

export const create = async (
  body: string,
  userId: number
): Promise<tweet | null> => {
  return db
    .execute("INSERT INTO tweets (body, created_at, userId) VALUES(?, ?, ?)", [
      body,
      new Date(),
      userId,
    ])
    .then((result) => getOne((result[0] as ResultSetHeader).insertId));
};

export const update = async (
  id: number,
  body: string
): Promise<tweet | null> => {
  return db
    .execute("UPDATE tweets SET body=?, modified_at=? WHERE id=?", [
      body,
      new Date(),
      id,
    ])
    .then(() => getOne(id));
};

export const remove = async (id: number) => {
  return db.execute("DELETE FROM tweets WHERE id=?", [id]);
};
