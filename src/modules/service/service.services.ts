import { prisma } from "../../lib/prisma";

type CService = {
  serviceName: string;
  price: number;
  categoryId: string;
};

// create a services
const createServiceDB = async (payload: CService, userId: string) => {
  const { serviceName, price, categoryId } = payload;

  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });

  if (!technicianProfile) {
    throw new Error(
      "Technician profile not found! Please request a TECHNICIAN profile first.",
    );
  }
  if(technicianProfile.user.role !== 'TECHNICIAN'){
    throw new Error("You don't have permission to create this service!")
  }


  return await prisma.service.create({
    data: {
      serviceName: serviceName.trim(),
      price,
      categoriesId: categoryId,
      technicianId: technicianProfile.id,
    },
    include: {
      category: true,
    },
  });
};

export const serviceServices = { createServiceDB };
