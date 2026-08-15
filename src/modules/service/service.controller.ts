import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ServiceQuery, serviceServices } from "./service.services";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";

// create a services
const createService = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.user?.id;
  const service = await serviceServices.createServiceDB(
    payload,
    userId as string,
  );

  sendResponse(res, {
    success: true,
    status: status.CREATED,
    message: "Service created successfully!",
    data: service,
  });
});

// get all services
const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceServices.getAllServicesDB(
    req.query
  );

  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "Service retrieved successfully!",

    data: service,
  });
});

// get single services
const getSingleServices = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = await serviceServices.getSingleServicesDB(id as string);

  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "Service single successfully!",
    data: service,
  });
});

export const serviceControllers = {
  createService,
  getAllServices,
  getSingleServices,
};
