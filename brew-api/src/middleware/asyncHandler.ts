import type { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 doesn't catch rejected promises from async handlers. Without this
// wrapper, a thrown error in an async controller hangs the request instead of
// reaching the error middleware.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
