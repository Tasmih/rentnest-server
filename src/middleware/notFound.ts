import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new AppError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`
    )
  );
};

export default notFound;