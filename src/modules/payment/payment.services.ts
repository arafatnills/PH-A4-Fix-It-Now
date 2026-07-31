import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const createCheckoutSessionDB = async (
  bookingId: string,
  customerId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: {
        select: {
          serviceName: true,
          price: true,
        },
      },
    },
  });

  if (!booking) throw new AppError(404, "booking not found!");

  if (booking.status === "REJECTED")
    throw new AppError(403, "Booking is rejected by the technician.");

  if (booking.status !== "ACCEPTED")
    throw new AppError(
      400,
      "Booking must be accepted by technician before payment.",
    );

  const isPaymentExists = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });

  const BDT_USD = 0.0081;
  const priceInUsd = Number(booking.service.price) * BDT_USD;
  const amountInCents = Math.round(priceInUsd * 1000);

  
  
};

export const paymentServices = { createCheckoutSessionDB };
