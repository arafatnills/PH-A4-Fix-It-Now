import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

// create user
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.registerUserDB(req.body);

  sendResponse(res, {
    success: true,
    status: status.CREATED,
    message: "user created successfully!",
    data: user,
  });
});

// request be a technician
const ctRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const {role} = req.body;
  const requestedUser = await userServices.ctRequestDB(role, userId);

  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "thanks for requesting",
    data: requestedUser,
  });
});

// get all technicians
const getAllTechnician = catchAsync(async (req: Request, res: Response)=>{
  const result = await userServices.getAllTechnicianDB()
    sendResponse(res, {
    success: true,
    status: status.OK,
    message: "thanks for requesting",
    data: result,
  });
} )

export const userControllers = {
  registerUser,
  ctRequest,
  getAllTechnician
};
