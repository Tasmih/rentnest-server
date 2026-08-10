import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CategoryService.getAllCategories();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid category ID");
    }

    const result = await CategoryService.getCategoryById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid category ID");
    }

    const result = await CategoryService.updateCategory(id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid category ID");
    }

    const result = await CategoryService.deleteCategory(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};