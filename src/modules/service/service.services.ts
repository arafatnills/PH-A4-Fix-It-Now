import { prisma } from "../../lib/prisma";

type CService = {
  serviceName: string;
  price: number;
  categoryId: string;
  city: string;
  area: string
};

// create a services
const createServiceDB = async (payload: CService, userId: string) => {
  const { serviceName, price, categoryId,city, area } = payload;

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
      area: area.trim(),
      city: city.trim()
    },
    include: {
      category: true,
    },
  });
};

// get all services
const getAllServicesDB = async ()=>{
  const allServices = await prisma.service.findMany({
    include: {
      technician: true,
      category: true
    }
  })
  const count = await prisma.service.count()

  return {
    allServices,
    count
  }
}

export const serviceServices = { createServiceDB ,getAllServicesDB};
