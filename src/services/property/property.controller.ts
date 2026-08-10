import { Request, Response, NextFunction } from "express";
import { PropertyService } from "./property.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";


const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await PropertyService.createProperty(
      userId,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Property created successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

//get all properties
//get all properties
const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const result = await PropertyService.getAllProperties(
      req.query
    );


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Properties retrieved successfully",
      data: result,
    });


  } catch (error) {
    next(error);
  }
};

// get properties:id (details page )

const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid property ID");
    }

    const result = await PropertyService.getPropertyById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Property retrieved successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};
//update property
const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid property ID");
    }


    const user = res.locals.user;


    const result = await PropertyService.updateProperty(
      id,
      user.id,
      user.role,
      req.body
    );


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Property updated successfully",
      data: result,
    });


  } catch (error) {
    next(error);
  }
};


//delete property

const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid property ID");
    }

    const user = res.locals.user;

    const result = await PropertyService.deleteProperty(
      id,
      user.id,
      user.role
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Property deleted successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

export const PropertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};