import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../db/database";
export type user = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  created_at: string;
  profile_url?: string;
};

export const findByUsername = async (
  username: string
): Promise<user | undefined> => {
  return db
    .execute("SELECT * FROM users WHERE username=?", [username])
    .then((result) => (result[0] as RowDataPacket)[0]);
};

export const findById = async (id: number): Promise<user | undefined> => {
  return db
    .execute("SELECT * FROM users WHERE id=?", [id])
    .then((result) => (result[0] as RowDataPacket)[0]);
};

export const createUser = async (user: {
  username: string;
  password: string;
  name: string;
  email: string;
  profile_url?: string;
}): Promise<number> => {
  const { username, password, name, email, profile_url } = user;

  return db
    .execute(
      "INSERT INTO users (username, password, name, email, profile_url, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [username, password, name, email, profile_url, new Date()]
    )
    .then((result) => (result[0] as ResultSetHeader).insertId);
};
