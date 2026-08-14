import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

type CService = {
  serviceName: string;
  price: number;
  categoriesId: string;
  city: string;
  area: string;
  description: string;
  thumbnail: string
};

// create a services
const createServiceDB = async (payload: CService, userId: string) => {
  const { serviceName, price, categoriesId, city, area, description,thumbnail } = payload;

  const technicianProfile = await prisma.technician.findUnique({
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
  if (technicianProfile.user.role !== "TECHNICIAN") {
    throw new Error("You don't have permission to create this service!");
  }

  return await prisma.service.create({
    data: {
      serviceName: serviceName.trim(),
      price,
      categoriesId,
      city: city.trim(),
      area: area.trim(),
      description: description.trim(),
      technicianId: technicianProfile.id,
      thumbnail
    },
    include: {
      category: true,
    },
  });
};

// get all services
const getAllServicesDB = async () => {
  const allServices = await prisma.service.findMany({
    include: {
      technician: {
        select: {
          id: true,
          userId: true
        }
      },
      category: {
        select: {
          name: true,
          id: true
        }
      },
    },
  });
  const count = await prisma.service.count();

  return {
    allServices,
    count,
  };
};

// get single services
const getSingleServicesDB = async (id: string) => {
  const singleService = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      category:{
        select: {
          name: true
        }
      }
    }
  });

  if (!serviceServices) throw new AppError(404, "service not found!");

  return singleService;
};
export const serviceServices = {
  createServiceDB,
  getAllServicesDB,
  getSingleServicesDB,
};
