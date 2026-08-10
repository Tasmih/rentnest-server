import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "../utils/jwt";
import AppError from "../utils/AppError";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new AppError(401, "You are not authorized");
    }

    const token = authorization.split(" ")[1];

    const decoded = JwtUtils.verifyToken(token);

    res.locals.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError(401, "Invalid or expired token")
    );
  }
};

export default auth;