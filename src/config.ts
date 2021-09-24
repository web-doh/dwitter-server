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
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN", "*"),
  },
  jwt: {
    secretKey: required("JWT_SECRET_KEY"),
    expiresInDay: required("JWT_EXPIRES", "7d"),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", "12")),
  },
  csrf: {
    plainToken: required("CSRF_SECRET_KEY"),
  },

  port: parseInt(required("HOST_PORT", "8080")),

  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    password: required("DB_PASSWORD"),
    port: parseInt(required("DB_PORT")),
  },

  rateLimit: {
    windowMs: 60 * 1000, // ms
    maxRequest: 100, // ip 별로 제한
  },
};
