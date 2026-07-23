import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status";
import sendResponse from "./sendResponse";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      sendResponse(res, {
        success: false,
        status: status.NOT_FOUND,
        message: "Internal Server Error!!",
        error: (error as Error).message,
      });
    }
  };
};

export default catchAsync;
