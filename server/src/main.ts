import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import logger from "morgan";

const app = express();

app.use(cors());
app.use(logger("tiny"));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err: any, req: Request, res: Response, nex: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(8080, () => {
  console.log(`server on `);
});
