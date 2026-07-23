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

export const userControllers = {
  registerUser,
};
