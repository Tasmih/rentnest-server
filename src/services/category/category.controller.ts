import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";


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


export const CategoryController = {
  createCategory,
  getAllCategories,
};