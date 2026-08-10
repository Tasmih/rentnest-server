import { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode =
    err instanceof AppError ? err.statusCode : 500;

  const message =
    err instanceof Error ? err.message : "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

export default globalErrorHandler;