import { Request, Response, NextFunction } from "express";
import { RentalRequestService } from "./rentalRequest.service";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";



// Create Rental Request

const createRentalRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const tenantId = res.locals.user.id;


    if (!tenantId) {
      throw new AppError(
        401,
        "Unauthorized user"
      );
    }


    const result =
      await RentalRequestService.createRentalRequest(
        tenantId,
        req.body
      );


    sendResponse(res, {

      statusCode: 201,

      success: true,

      message:
      "Rental request created successfully",

      data: result,

    });


  } catch(error) {

    next(error);

  }

};





// Get My Requests (Tenant)

const getMyRentalRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {


    const tenantId = res.locals.user.id;


    if (!tenantId) {
      throw new AppError(
        401,
        "Unauthorized user"
      );
    }



    const result =
      await RentalRequestService.getMyRentalRequests(
        tenantId
      );



    sendResponse(res, {

      statusCode: 200,

      success: true,

      message:
      "Rental requests retrieved successfully",

      data: result,

    });



  } catch(error) {

    next(error);

  }

};




// Get Landlord Rental Requests
const getLandlordRentalRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const role = res.locals.user.role;

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await RentalRequestService.getLandlordRentalRequests(
      userId,
      role
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Accept Rental Request
const acceptRentalRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const role = res.locals.user.role;
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid rental request ID");
    }

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await RentalRequestService.acceptRentalRequest(
      id,
      userId,
      role
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Rental request accepted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Reject Rental Request
const rejectRentalRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const role = res.locals.user.role;
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError(400, "Invalid rental request ID");
    }

    if (!userId) {
      throw new AppError(401, "Unauthorized user");
    }

    const result = await RentalRequestService.rejectRentalRequest(
      id,
      userId,
      role
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Rental request rejected successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const RentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getLandlordRentalRequests,
  acceptRentalRequest,
  rejectRentalRequest,
};