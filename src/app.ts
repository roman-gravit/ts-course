import express, { NextFunction, Response, Request } from "express";
import { router } from "./routes/todos";
import { json } from "body-parser";

const app = express();

app.use(json());

app.use("/todos", router);

app.use((err: Error, _req: Request, resp: Response, _next: NextFunction) => {
  resp.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
