import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.registerUser(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.loginUser(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.googleLogin(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.requiresRoleSelection
        ? "Role selection required for new Google user"
        : "Google login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const completeGoogleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.completeGoogleSignup(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Google registration successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  registerUser,
  loginUser,
  googleLogin,
  completeGoogleSignup,
};