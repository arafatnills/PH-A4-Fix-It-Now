import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

type CService = {
  serviceName: string;
  price: number;
  categoriesId: string;
  city: string;
  area: string;
  description: string;
  thumbnail: string;
};

export type ServiceQuery = {
  q?: string;
  city?: string;
  area?: string;
  categoriesId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

// get all services
const SORT_MAP: Record<string, Prisma.ServiceOrderByWithRelationInput[]> = {
  newest: [{ createdAt: "desc" }, { id: "asc" }],
  oldest: [{ createdAt: "asc" }, { id: "asc" }],
  price_low: [{ price: "asc" }, { id: "asc" }],
  price_high: [{ price: "desc" }, { id: "asc" }],
  name_az: [{ serviceName: "asc" }, { id: "asc" }],
};
const getAllServicesDB = async (query: ServiceQuery = {}) => {
  const { q, city, area, categoriesId, minPrice, maxPrice, sort, page, limit } =
    query;

  const currentPage = Math.max(1, Number(page) || 1);
  const parPage = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (currentPage - 1) * parPage;

  const where: Prisma.ServiceWhereInput = {};

  // search
  if (q?.trim()) {
    const term = q.trim();
    where.OR = [
      { serviceName: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { city: { contains: term, mode: "insensitive" } },
      { area: { contains: term, mode: "insensitive" } },
      { category: { name: { contains: term, mode: "insensitive" } } },
    ];
  }

  // filter
  if (city) where.city = { equals: city, mode: "insensitive" };
  if (city) where.area = { equals: area, mode: "insensitive" };
  if (city) where.categoriesId = categoriesId;

  // filter using price
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  // order by
  const orderBy = SORT_MAP[sort ?? ""] ?? SORT_MAP.newest;

  const [allServices, count] = await prisma.$transaction([
    prisma.service.findMany({
      where,
      orderBy,
      skip,
      take: parPage,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        technician: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.service.count({ where }),
  ]);

  return {
    meta: {
      page: currentPage,
      limit: parPage,
      total: count,
      totalPages: Math.ceil(count / parPage),
    },
    allServices,
  };
};

// create a services
const createServiceDB = async (payload: CService, userId: string) => {
  const {
    serviceName,
    price,
    categoriesId,
    city,
    area,
    description,
    thumbnail,
  } = payload;

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
      thumbnail,
    },
    include: {
      category: true,
    },
  });
};

// get single services
const getSingleServicesDB = async (id: string) => {
  const singleService = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!serviceServices) throw new AppError(404, "service not found!");

  return singleService;
};
export const serviceServices = {
  createServiceDB,
  getAllServicesDB,
  getSingleServicesDB,
};
