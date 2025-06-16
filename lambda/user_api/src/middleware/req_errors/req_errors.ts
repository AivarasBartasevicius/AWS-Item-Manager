export class ReqError extends Error {
  public originalError?: Error;

  constructor(
    public message: string,
    public statusCode: number,
    originalError?: Error
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    if (originalError) {
      this.originalError = originalError;
      if (originalError.stack) {
        this.stack = `${originalError.stack}\n---ReqError---\n${this.stack}`;
      }
      if (originalError.message) {
        this.message = originalError.message + " " + this.message;
      }
    }
  }
}

export class BadRequestError extends ReqError {
  constructor(message = "Bad Request", originalError?: Error) {
    super(message, 400, originalError);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends ReqError {
  constructor(message = "Unauthorized", originalError?: Error) {
    super(message, 401, originalError);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class NotFoundError extends ReqError {
  constructor(message = "Not Found", originalError?: Error) {
    super(message, 404, originalError);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InternalServerError extends ReqError {
  constructor(message = "Internal Server Error", originalError?: Error) {
    super(message, 500, originalError);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
