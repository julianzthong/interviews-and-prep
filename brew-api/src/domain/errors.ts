// Errors carry an HTTP status so the error middleware can map them to responses.
// Services throw these; controllers never build error responses by hand.

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

export class ValidationError extends HttpError {
  constructor(details: unknown) {
    super(400, "Invalid request", details);
  }
}
