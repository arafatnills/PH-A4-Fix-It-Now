import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "../user/user.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { adminServices } from "./admin.services";

const handelUserRequest = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await adminServices.handelUserRequestDB(userId as string);

  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "User role updated successfully!",
    data: result,
  });
});

export const adminControllers = {
  handelUserRequest,
};
