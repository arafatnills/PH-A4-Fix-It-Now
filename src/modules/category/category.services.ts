import { prisma } from "../../lib/prisma";

const getAllCategoriesDB = async () => {
  const allCategories = await prisma.category.findMany({});
  const count = await prisma.category.count();
  return {
    allCategories,
    count,
  };
};

// delete category
const deleteCategoryDB = async (categoryId: string) => {
  const deletedCategory = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return deletedCategory;
};

export const categoryServices = {
  getAllCategoriesDB,
  deleteCategoryDB,
};
