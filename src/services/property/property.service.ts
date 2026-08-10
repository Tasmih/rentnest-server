import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { PropertyType } from "../../generated/prisma/enums";


type TCreatePropertyPayload = {
  title: string;
  description: string;
  rent: number;
  serviceCharge?: number;
  utilityCharge?: number;
  area: string;
  address: string;
  propertyType: PropertyType;
  categoryId: string;
  floor?: number;
  totalFloors?: number;
  availableFrom?: Date;
  bedrooms?: number;
  bathrooms?: number;
  coverImage?: string;
  furnished?: boolean;
  parking?: boolean;
  lift?: boolean;
  bachelorAllowed?: boolean;
  familyAllowed?: boolean;
};


// Create Property

const createProperty = async (
  userId: string,
  payload: TCreatePropertyPayload
) => {

  const category = await prisma.category.findFirst({
    where: {
      id: payload.categoryId,
      isDeleted: false,
    },
  });


  if (!category) {
    throw new AppError(404, "Category not found");
  }


  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId: userId,
    },

    select: {
      id: true,
      title: true,
      description: true,
      rent: true,
      serviceCharge: true,
      utilityCharge: true,
      area: true,
      address: true,
      propertyType: true,
      status: true,
      landlordId: true,
      categoryId: true,
      createdAt: true,
    },
  });


  return property;
};



// Get All Properties with Search Filter Pagination

const getAllProperties = async (query: any) => {

  const {
    page = "1",
    limit = "10",
    area,
    minRent,
    maxRent,
    propertyType,
    categoryId,
  } = query;


  const skip = (Number(page) - 1) * Number(limit);



  const whereCondition = {
    isDeleted: false,
    status: "AVAILABLE",

    ...(area && {
      area: {
        contains: area,
        mode: "insensitive",
      },
    }),


    ...(propertyType && {
      propertyType,
    }),


    ...(categoryId && {
      categoryId,
    }),


    ...(minRent || maxRent
      ? {
          rent: {
            ...(minRent && {
              gte: Number(minRent),
            }),

            ...(maxRent && {
              lte: Number(maxRent),
            }),
          },
        }
      : {}),
  };



  const properties = await prisma.property.findMany({

    where: whereCondition,

    skip,

    take: Number(limit),


    select: {
      id: true,
      title: true,
      rent: true,
      serviceCharge: true,
      utilityCharge: true,
      area: true,
      address: true,
      propertyType: true,
      coverImage: true,
      status: true,

      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },


    orderBy: {
      createdAt: "desc",
    },

  });



  const total = await prisma.property.count({
    where: whereCondition,
  });



  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },

    data: properties,
  };
};




// Get Property By ID

const getPropertyById = async (id: string) => {

  const property = await prisma.property.findFirst({

    where: {
      id,
      isDeleted: false,
    },


    select: {
      id: true,
      title: true,
      description: true,
      rent: true,
      serviceCharge: true,
      utilityCharge: true,
      area: true,
      address: true,
      propertyType: true,
      floor: true,
      totalFloors: true,
      availableFrom: true,
      bedrooms: true,
      bathrooms: true,
      coverImage: true,
      furnished: true,
      parking: true,
      lift: true,
      bachelorAllowed: true,
      familyAllowed: true,
      status: true,
      createdAt: true,
      updatedAt: true,


      category: {
        select: {
          id: true,
          name: true,
        },
      },


      landlord: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },

    },

  });



  if (!property) {
    throw new AppError(404, "Property not found");
  }


  return property;
};




// Update Property

type TUpdatePropertyPayload = {
  title?: string;
  description?: string;
  rent?: number;
  serviceCharge?: number;
  utilityCharge?: number;
  area?: string;
  address?: string;
  propertyType?: PropertyType;
  floor?: number;
  totalFloors?: number;
  availableFrom?: Date;
  bedrooms?: number;
  bathrooms?: number;
  coverImage?: string;
  furnished?: boolean;
  parking?: boolean;
  lift?: boolean;
  bachelorAllowed?: boolean;
  familyAllowed?: boolean;
};



const updateProperty = async (
  id: string,
  userId: string,
  role: string,
  payload: TUpdatePropertyPayload
) => {


  const property = await prisma.property.findFirst({

    where: {
      id,
      isDeleted: false,
    },

  });



  if (!property) {
    throw new AppError(404, "Property not found");
  }



  if (
    role === "LANDLORD" &&
    property.landlordId !== userId
  ) {

    throw new AppError(
      403,
      "You cannot update this property"
    );

  }



  const updatedProperty = await prisma.property.update({

    where: {
      id,
    },


    data: payload,


    select: {
      id: true,
      title: true,
      description: true,
      rent: true,
      serviceCharge: true,
      utilityCharge: true,
      area: true,
      address: true,
      propertyType: true,
      status: true,
      updatedAt: true,
    },

  });



  return updatedProperty;

};




// Delete Property

const deleteProperty = async (
  id: string,
  userId: string,
  role: string
) => {


  const property = await prisma.property.findFirst({

    where: {
      id,
      isDeleted: false,
    },

  });



  if (!property) {
    throw new AppError(404, "Property not found");
  }



  if (
    role === "LANDLORD" &&
    property.landlordId !== userId
  ) {

    throw new AppError(
      403,
      "You cannot delete this property"
    );

  }



  const deletedProperty = await prisma.property.update({

    where: {
      id,
    },


    data: {
      isDeleted: true,
      status: "INACTIVE",
    },


    select: {
      id: true,
      title: true,
      status: true,
      isDeleted: true,
    },

  });



  return deletedProperty;

};




export const PropertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};