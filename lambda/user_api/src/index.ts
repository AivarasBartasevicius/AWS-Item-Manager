import express from "express";
import serverless from "serverless-http";
import routes from "./routes/routes";
import { authMiddleware } from "./middleware/auth.middleware";
import { Context, S3Event } from "aws-lambda";
import handleError from "./middleware/req_errors/req_errors.middleware";
import { NotFoundError } from "./middleware/req_errors/req_errors";

const app = express();
const basePath = "/api";

app.use(express.json());
app.use(authMiddleware);
app.use(routes);

app.use((req, res, next) => {
  next(
    new NotFoundError(`Resource not found: ${req.method} ${req.originalUrl}`)
  );
});

app.use(handleError);

const handleRequest = serverless(app, {
  basePath: basePath,
});

export const handler = async (event: S3Event, context: Context) => {
  return await handleRequest(event, context);
};
