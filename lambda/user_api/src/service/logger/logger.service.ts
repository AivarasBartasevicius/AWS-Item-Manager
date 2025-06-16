import winston from "winston";
import { SlackTransport } from "./slack.transport";

interface CustomLogger extends winston.Logger {
  critical: winston.LeveledLogMethod;
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
    critical: 0,
  },
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new SlackTransport({ level: "critical" }),
  ],
});

export { logger };
