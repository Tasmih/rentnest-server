import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { UserRole } from "../generated/prisma/enums";

const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return next(new AppError(401, "You are not authorized"));
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      return next(
        new AppError(403, "You do not have permission to perform this action")
      );
    }

    next();
  };

export default authorize;