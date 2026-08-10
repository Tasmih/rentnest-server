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



//get property

const getAllProperties = async () => {
  const properties = await prisma.property.findMany({
    where: {
      isDeleted: false,
      status: "AVAILABLE",
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

    orderBy: {
      createdAt: "desc",
    },
  });


  return properties;
};

// get properties:id (details page)

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


//update property 

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


  // landlord can update only own property
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

//delete  property

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


  // landlord can delete only own property
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