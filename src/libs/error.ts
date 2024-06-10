export class AppError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    REDIRECT: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
}