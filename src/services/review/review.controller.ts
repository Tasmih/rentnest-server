import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

// Create Review
const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await ReviewService.createReview(userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get Property Reviews
const getPropertyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.propertyId;

    if (typeof propertyId !== "string") {
      throw new AppError(400, "Invalid property ID");
    }

    const result = await ReviewService.getPropertyReviews(propertyId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update Review
const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid review ID");
    }

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await ReviewService.updateReview(id, userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Review
const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid review ID");
    }

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await ReviewService.deleteReview(id, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
};
