import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";


// Create Rental Request (Tenant)

const createRentalRequest = async (
  tenantId: string,
  payload: {
    propertyId: string;
    moveInDate?: Date;
    message?: string;
  }
) => {

  const property = await prisma.property.findFirst({
    where: {
      id: payload.propertyId,
      isDeleted: false,
      status: "AVAILABLE",
    },
  });


  if (!property) {
    throw new AppError(
      404,
      "Property not found or unavailable"
    );
  }



  const existingRequest =
    await prisma.rentalRequest.findFirst({
      where: {
        tenantId,
        propertyId: payload.propertyId,
        isDeleted: false,
      },
    });



  if (existingRequest) {
    throw new AppError(
      409,
      "You already requested this property"
    );
  }



  const request =
    await prisma.rentalRequest.create({

      data: {
        tenantId,
        propertyId: payload.propertyId,
        moveInDate: payload.moveInDate,
        message: payload.message,
      },


      select: {

        id: true,
        moveInDate: true,
        message: true,
        status: true,
        createdAt: true,


        property: {
          select: {
            id: true,
            title: true,
            rent: true,
          },
        },

      },

    });



  return request;

};




// Tenant: My Requests

const getMyRentalRequests = async (
  tenantId: string
) => {


  const requests =
    await prisma.rentalRequest.findMany({

      where: {
        tenantId,
        isDeleted: false,
      },


      select: {

        id: true,
        moveInDate: true,
        message: true,
        status: true,
        createdAt: true,


        property: {
          select: {
            id: true,
            title: true,
            rent: true,
            area: true,
          },
        },

      },


      orderBy: {
        createdAt: "desc",
      },

    });



  return requests;

};



export const RentalRequestService = {
  createRentalRequest,
  getMyRentalRequests,

  // Landlord: Get Rental Requests for Landlord's properties
  getLandlordRentalRequests: async (userId: string, role: string) => {
    const whereCondition: any = {
      isDeleted: false,
      property: {
        isDeleted: false,
        ...(role === "LANDLORD" && { landlordId: userId }),
      },
    };

    const requests = await prisma.rentalRequest.findMany({
      where: whereCondition,
      select: {
        id: true,
        moveInDate: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        property: {
          select: {
            id: true,
            title: true,
            rent: true,
            area: true,
            address: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return requests;
  },

  // Accept Rental Request
  acceptRentalRequest: async (id: string, userId: string, role: string) => {
    const rentalRequest = await prisma.rentalRequest.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        property: true,
      },
    });

    if (!rentalRequest) {
      throw new AppError(404, "Rental request not found");
    }

    if (role !== "ADMIN" && rentalRequest.property.landlordId !== userId) {
      throw new AppError(
        403,
        "You do not have permission to manage this rental request"
      );
    }

    if (rentalRequest.status !== "PENDING") {
      throw new AppError(
        400,
        "Only pending rental requests can be accepted"
      );
    }

    const [updatedRequest] = await prisma.$transaction([
      prisma.rentalRequest.update({
        where: { id },
        data: { status: "ACCEPTED" },
        select: {
          id: true,
          moveInDate: true,
          message: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          property: {
            select: {
              id: true,
              title: true,
              rent: true,
              status: true,
            },
          },
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      prisma.property.update({
        where: { id: rentalRequest.propertyId },
        data: { status: "RENTED" },
      }),
      prisma.rentalRequest.updateMany({
        where: {
          propertyId: rentalRequest.propertyId,
          id: { not: id },
          status: "PENDING",
          isDeleted: false,
        },
        data: { status: "REJECTED" },
      }),
    ]);

    return updatedRequest;
  },

  // Reject Rental Request
  rejectRentalRequest: async (id: string, userId: string, role: string) => {
    const rentalRequest = await prisma.rentalRequest.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        property: true,
      },
    });

    if (!rentalRequest) {
      throw new AppError(404, "Rental request not found");
    }

    if (role !== "ADMIN" && rentalRequest.property.landlordId !== userId) {
      throw new AppError(
        403,
        "You do not have permission to manage this rental request"
      );
    }

    if (rentalRequest.status !== "PENDING") {
      throw new AppError(
        400,
        "Only pending rental requests can be rejected"
      );
    }

    const updatedRequest = await prisma.rentalRequest.update({
      where: { id },
      data: { status: "REJECTED" },
      select: {
        id: true,
        moveInDate: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        property: {
          select: {
            id: true,
            title: true,
            rent: true,
            status: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updatedRequest;
  },
};