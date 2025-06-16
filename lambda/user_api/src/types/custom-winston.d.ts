import winston from "winston";

interface CustomLogger extends winston.Logger {
  critical: winston.LeveledLogMethod;
}

declare module "./../service/logger/logger.service" {
  export const logger: CustomLogger;
}
