import catchAsync from "../../utils/catchAsync";
import { serviceServices } from "./service.services";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
// create a services
const createService = catchAsync(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id;
    const service = await serviceServices.createServiceDB(payload, userId);
    sendResponse(res, {
        success: true,
        status: status.CREATED,
        message: "Service created successfully!",
        data: service,
    });
});
// get all services
const getAllServices = catchAsync(async (req, res) => {
    const service = await serviceServices.getAllServicesDB();
    sendResponse(res, {
        success: true,
        status: status.CREATED,
        message: "Service created successfully!",
        total: service.count,
        data: service.allServices,
    });
});
export const serviceControllers = {
    createService,
    getAllServices
};
