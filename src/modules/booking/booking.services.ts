import { prisma } from "../../lib/prisma";
import { CBooking } from "./booking.interface";

// create bookings
const createBookingDB = async (payload: CBooking, customerId: string) => {
  const { technicianId, serviceId, scheduledAt } = payload;
  const scheduledDate = new Date(scheduledAt);
  const currentDate = new Date();

  if (scheduledDate < currentDate) {
    throw new Error("Scheduled time cannot be in the past!");
  }

  return await prisma.booking.create({
    data: {
      customerId,
      technicianId,
      serviceId,
      scheduledAt,
    },
  });
};

// get customer all bookings
const getMyBookingsDB = async (customerId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      customerId,
    },
    include: {
      service: {
        select: {
          serviceName: true
        }
      }
    }
  });

  return result;
};

// cancel my booking
const cancelMyBookingsDB = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found!");
  }

  if (userId !== booking.customerId) {
    throw new Error("Forbidden: you don't have permission!");
  }

  const nonCancellableStatuses = ["COMPLETED", "CANCELLED", "REJECTED"];
  if (nonCancellableStatuses.includes(booking.status)) {
    throw new Error("You cannot cancel this booking at this stage!");
  }

  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
  });
};

// accept booking only technician
const acceptBookingDB = async (userId: string, bookingId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found!");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });



  if (!booking) {
    throw new Error("booking not found!");
  }
  
  if (booking.technicianId !== technicianProfile.id) {
    throw new Error("Forbidden: you don't have permission!");
  }
  
  if(booking.status === 'ACCEPTED'){
    throw new Error('this booking was already accepted!')
  }


  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "ACCEPTED",
    },
  });
};

// get all bookings for technician
const getTechnicianBookingsDB = async (userId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found!");
  }

  const technicianBookings = await prisma.booking.findMany({
    where: {
      technicianId: technicianProfile.id,
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      service: {
        select: {
          serviceName: true,
        },
      },
    },
  });

  return technicianBookings;
};

export const bookingServices = {
  createBookingDB,
  getMyBookingsDB,
  cancelMyBookingsDB,
  getTechnicianBookingsDB,
  acceptBookingDB,
};
