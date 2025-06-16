import { postCriticalError } from "../slack.service";
import Transport, { TransportStreamOptions } from "winston-transport";
import type { LogEntry } from "winston";

export class SlackTransport extends Transport {
  constructor(options: TransportStreamOptions) {
    super(options);
  }

  log(info: LogEntry, callback: any) {
    if (info.level === "critical") {
      const message = info.message;
      const errorDetails = info.error
        ? {
            name: info.error.name,
            message: info.error.message,
            stack: info.error.stack,
            ...info.details,
          }
        : info.details;

      postCriticalError(message, errorDetails)
        .then(() => {
          callback();
        })
        .catch((error) => {
          console.error(
            "Failed to send Slack notification via Winston transport:",
            error
          );
          callback();
        });
    } else {
      callback();
    }
  }
}
