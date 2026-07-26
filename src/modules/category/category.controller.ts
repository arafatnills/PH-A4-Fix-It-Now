import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { categoryServices } from "./category.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryServices.getAllCategoriesDB();
  sendResponse(res, {
    success: true,
    status: status.OK,
    message: "all categories retrieved successfully!",
    total: categories.count,
    data: categories.allCategories,
  });
});


export const categoryControllers = {getAllCategories}