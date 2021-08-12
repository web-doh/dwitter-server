import dotenv from "dotenv";
dotenv.config();

function required(key: string, defaultValue?: string) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: required("JWT_SECRET_KEY"),
    expires: required("JWT_EXPIRES", "2d"),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", "12")),
  },
  host: {
    port: parseInt(required("HOST_PORT", "8080")),
  },

  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    password: required("DB_PASSWORD"),
  },
};
