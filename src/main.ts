import express, { json, Request, Response, urlencoded } from "express";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";

import { config } from "./config";
import tweetsRouter from "./routes/tweets";
import authRouter from "./routes/auth";
import { sequelize } from "./db/database";
import { csrfCheck } from "./middleware/csrf";
import rateLimit from "./middleware/rate-limiter";
import { Socket } from "./connection/socket";

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials
};

app.use(cors(corsOptions));
app.use(logger("tiny"));
app.use(json());
app.use(cookieParser()); // httpOnly 쿠키를 위함
app.use(urlencoded({ extended: false }));
app.use(rateLimit);
app.use(csrfCheck);

app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.sendStatus(500);
});

sequelize.sync().then(() => {
  console.log(`Server is started.... ${new Date()}`);
  const server = app.listen(process.env.PORT || config.port || 80);
  Socket.init(server);
});
