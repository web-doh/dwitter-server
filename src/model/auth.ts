import SQ from "sequelize";
import { sequelize } from "../db/database";

const DataTypes = SQ.DataTypes;
export const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  create_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  profile_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}); // , {timestamps: false}

export type user = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  created_at: string;
  profile_url?: string;
};

export const findByUsername = async (username: string): Promise<any> => {
  return User.findOne({ where: { username } });
};

export const findById = async (id: number): Promise<any> => {
  return User.findByPk(id);
};

export const createUser = async (user: {
  username: string;
  password: string;
  name: string;
  email: string;
  profile_url?: string;
}): Promise<number> => {
  return User.create(user).then((data) => (data as any).dataValues.id);
};
