import { Request, Response, NextFunction } from "express";
import { InternalServerError, ReqError } from "./req_errors";
import { logger } from "../../service/logger/logger.service";

const handleReqErrorLogging = (err: ReqError, req: Request) => {
  const commonLogMetadata = {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  };
  if (err.statusCode >= 500) {
    logger.critical(`API Error (Status ${err.statusCode}): ${err.message}`, {
      error: err,
      originalError: err.originalError,
      ...commonLogMetadata,
      body: req.body,
      query: req.query,
    });
  } else {
    logger.error(`API Error (Status ${err.statusCode}): ${err.message}`, {
      error: err,
      ...commonLogMetadata,
    });
  }
};

const handleError = (err: Error | ReqError, req: Request, res: Response) => {
  if (err instanceof ReqError) {
    handleReqErrorLogging(err, req);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  handleReqErrorLogging(
    new InternalServerError("An unexpected error occurred.", err),
    req
  );
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
  });
};

export default handleError;
