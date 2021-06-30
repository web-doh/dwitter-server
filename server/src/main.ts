import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import tweetsRouter from "./routes/tweets";
import authRouter from "./routes/auth";
import { config } from "./config";

const app = express();

app.use(cors());
app.use(logger("tiny"));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);
app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err: any, req: Request, res: Response, nex: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(config.host.port, () => {
  console.log(`server on`);
});
