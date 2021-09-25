import SQ, { FindOptions } from "sequelize";
import { sequelize } from "../db/database";
import { User } from "./auth";

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const Tweet = sequelize.define(
  "tweet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    modified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false }
);

Tweet.belongsTo(User);

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

const INCLUDE_USER: FindOptions = {
  attributes: [
    "id",
    "body",
    "userId",
    "created_at",
    [Sequelize.col("user.username"), "username"],
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.profile_url"), "profile_url"],
  ],

  include: {
    model: User,
    attributes: [],
  },
};
const ORDER_DESC: FindOptions = { order: [["created_at", "DESC"]] };

export const getAll = async (): Promise<Array<any>> => {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
};

export const getAllByUsername = async (
  username: string
): Promise<Array<any>> => {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      model: User,
      attributes: [],
      where: { username },
    },
  });
};

export const getOne = async (id: number): Promise<any> => {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
};

export const create = async (body: string, userId: number): Promise<any> => {
  return Tweet.create({ body, userId, created_at: new Date() }).then((data) =>
    getOne((data as any).dataValues.id)
  );
};

export const update = async (id: number, body: string): Promise<any> => {
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then((tweet) => {
      (tweet as any).body = body;
      (tweet as any)["modified_at"] = new Date();
      return (tweet as any).save();
    });
};

export const remove = async (id: number) => {
  return Tweet.findByPk(id) //
    .then((tweet) => {
      (tweet as any).destroy();
    });
};
