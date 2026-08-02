import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/AppError";

// create checkout session
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

  if (!booking || booking.customerId !== customerId)
    throw new AppError(404, "Booking not found.");

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

  if (isPaymentExists?.status === "PAID")
    throw new AppError(400, "Payment already initiated for this booking.");

  const BDT_USD = 0.0081;
  const priceInUsd = Number(booking.service.price) * BDT_USD;
  const amountInCents = Math.round(priceInUsd * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: booking.service.serviceName,
            description: `Booking for ${booking.service.serviceName}`,
          },

          unit_amount: Number(booking.service.price) * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
    },
    success_url: `${config.app_url}/bookings/${booking.id}/payment-success/session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/bookings/${booking.id}/payment-cancel`,
  });

  if (!isPaymentExists) {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        customerId: customerId,
        amount: booking.service.price,
        provider: "STRIPE",
        transactionId: session.id,
        status: "PENDING",
      },
    });
  } else {
    await prisma.payment.update({
      where: {
        bookingId,
      },
      data: {
        amount: booking.service.price,
        transactionId: session.id,
        status: "PENDING",
      },
    });
  }

  return { checkout: session.url };
};

// handel webhook
const handelWebhookDB = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  const trxResult = await prisma.$transaction(async (tx) => {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const payment = await tx.payment.update({
          where: {
            transactionId: session.id,
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        await tx.booking.update({
          where: {
            id: payment.bookingId,
          },
          data: {
            status: "INPROGRESS",
          },
        });

        break;
      }

      case "checkout.session.expired": {
        const paymentFailed = event.data.object;
        await tx.payment.update({
          where: {
            transactionId: paymentFailed.id,
          },
          data: {
            status: "FAILED",
          },
        });
        break;
      }

      default:
        console.log(`Event dos't match ${event.type}`);
        break;
    }
  });

  return trxResult;
};

export const paymentServices = { createCheckoutSessionDB, handelWebhookDB };
