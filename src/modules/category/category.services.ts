import { prisma } from "../../lib/prisma";

const getAllCategoriesDB = async () => {
  const allCategories = await prisma.category.findMany({});
  const count = await prisma.category.count();
  return {
    allCategories,
    count,
  };
};

export const categoryServices = {
  getAllCategoriesDB,
};
