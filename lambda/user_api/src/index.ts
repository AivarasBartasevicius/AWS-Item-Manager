import express from "express";
import serverless from "serverless-http";
import routes from "./routes/routes";
import { authMiddleware } from "./middleware/auth.middleware";
import { Context, S3Event } from "aws-lambda";

const app = express();
const port = 8000;

app.use(express.json());
app.use(authMiddleware);
app.use(routes);

const handleRequest = serverless(app);

export const handler = async (event: S3Event, context: Context) => {
  return await handleRequest(event, context);
};
