import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid user ID");
    }

    const result = await UserService.getUserById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid user ID");
    }

    const result = await UserService.updateUser(id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid user ID");
    }

    const result = await UserService.deleteUser(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};