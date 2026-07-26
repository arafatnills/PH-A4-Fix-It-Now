import status from "http-status";
import sendResponse from "./sendResponse";
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            sendResponse(res, {
                success: false,
                status: status.NOT_FOUND,
                message: "Internal Server Error!!",
                error: error.message,
            });
        }
    };
};
export default catchAsync;
