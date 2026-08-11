import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

const getUserNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await NotificationService.getUserNotifications(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Notifications retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const { id } = req.params;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await NotificationService.markAsRead(id as string, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Notification marked as read",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await NotificationService.markAllAsRead(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const { id } = req.params;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await NotificationService.deleteNotification(id as string, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Notification deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const NotificationController = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
