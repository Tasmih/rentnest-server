import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

// Admin Dashboard Handler
const adminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await DashboardService.getAdminDashboard();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin dashboard data retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord Dashboard Handler
const landlordDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await DashboardService.getLandlordDashboard(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Landlord dashboard data retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Tenant Dashboard Handler
const tenantDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await DashboardService.getTenantDashboard(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tenant dashboard data retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const DashboardController = {
  adminDashboard,
  landlordDashboard,
  tenantDashboard,
};
