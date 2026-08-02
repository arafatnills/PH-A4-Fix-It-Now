import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

// create checkout session
const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user?.id;
    const { bookingId } = req.body;
    const paymentResult = await paymentServices.createCheckoutSessionDB(
      bookingId,
      customerId,
    );
    sendResponse(res, {
      success: true,
      status: status.CREATED,
      message: "checkout url created successfully!",
      data: paymentResult,
    });
  },
);

const handelWebhook = catchAsync(async (req: Request, res: Response) => {
  const rawPayload = req.body;
  const signature = req.headers["stripe-signature"];
  await paymentServices.handelWebhookDB(rawPayload, signature as string);
  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "webhook triggered successfully!",
  });
});

export const paymentControllers = { createCheckoutSession, handelWebhook };
