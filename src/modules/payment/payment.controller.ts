import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

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
      message: "Service retrieved successfully!",
      data: paymentResult,
    });
  },
);

export const paymentControllers = { createCheckoutSession };
