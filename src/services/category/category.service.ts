import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";


type TCreateCategoryPayload = {
  name: string;
  description?: string;
};


//create category
const createCategory = async (
  payload: TCreateCategoryPayload
) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });


  if (existingCategory) {
    throw new AppError(
      409,
      "Category already exists"
    );
  }


  const category = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });


  return category;
};


const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};


export const CategoryService = {
  createCategory,
  getAllCategories,
};