import express from "express";
import serverless from "serverless-http";
import routes from "./routes/routes";
import { authMiddleware } from "./middleware/auth.middleware";
import { APIGatewayProxyEventV2, Context, S3Event } from "aws-lambda";

const app = express();
const basePath = "/user";

app.use(express.json());
app.use(authMiddleware);
app.use(basePath, routes);

const handleRequest = serverless(app, {
  basePath: basePath,
});

export const handler = async (event: S3Event, context: Context) => {
  console.log("Basic console.log for now", event);
  return await handleRequest(event, context);
};
