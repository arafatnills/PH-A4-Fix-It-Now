import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { bookingServices } from "./booking.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const payload = req.body;
  const result = await bookingServices.createBookingDB(payload, customerId);
  sendResponse(res, {
    success: true,
    status: status.CREATED,
    message: "booking created successfully!",
    data: result,
  });
});

// get all customer bookings
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await bookingServices.getMyBookingsDB(userId);
  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "my bookings retrieved successfully!",
    data: result,
  });
});

// cancel booking
const cancelMyBooking = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const userId = req.user?.id;

  const result = await bookingServices.cancelMyBookingsDB(
    bookingId as string,
    userId,
  );
  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "booking cancel successfully!",
    data: result,
  });
});

// get technician bookings
const getTechnicianBookings = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await bookingServices.getTechnicianBookingsDB(userId);
    sendResponse(res, {
      success: true,
      status: status.OK,
      message: "bookings retrieved successfully!",
      data: result,
    });
  },
);

// accept booking
const acceptBooking = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { bookingId } = req.params;
  const bookingAccepted = await bookingServices.acceptBookingDB(userId, bookingId as string);

  sendResponse(res, {
    success: true,
    status: status.CREATED,
    message: "booking accepted successfully!",
    data: bookingAccepted
  });
});

export const bookingControllers = {
  createBooking,
  getMyBookings,
  cancelMyBooking,
  getTechnicianBookings,
  acceptBooking
};
