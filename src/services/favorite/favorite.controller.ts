import { Request, Response, NextFunction } from "express";
import { FavoriteService } from "./favorite.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

// Add Favorite
const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const propertyId = req.params.propertyId;

    if (typeof propertyId !== "string") {
      throw new AppError(400, "Invalid property ID");
    }

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await FavoriteService.addFavorite(userId, propertyId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Property added to favorites successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Remove Favorite
const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const propertyId = req.params.propertyId;

    if (typeof propertyId !== "string") {
      throw new AppError(400, "Invalid property ID");
    }

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await FavoriteService.removeFavorite(userId, propertyId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Favorite removed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Favorites
const getMyFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await FavoriteService.getMyFavorites(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Favorites retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const FavoriteController = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
