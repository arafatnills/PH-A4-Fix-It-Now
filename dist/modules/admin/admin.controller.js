import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { adminServices } from "./admin.services";
// handel user to technician
const handelUserRequest = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await adminServices.handelUserRequestDB(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "User role updated successfully!",
        data: result,
    });
});
// create categories
const createCategory = catchAsync(async (req, res) => {
    const { name } = req.body;
    const category = await adminServices.createCategoryDB(name);
    sendResponse(res, {
        success: true,
        status: status.CREATED,
        message: "Category created successfully!",
        data: category,
    });
});
// update categories
const updateCategory = catchAsync(async (req, res) => {
    const { name } = req.body;
    const { catId } = req.params;
    const updatedCategory = await adminServices.updateCategoryDB(name, catId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Category updated successfully!",
        data: updatedCategory,
    });
});
// delete categories
const deleteCategory = catchAsync(async (req, res) => {
    const { catId } = req.params;
    const deletedCategory = await adminServices.deleteCategoryDB(catId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "Category deleted successfully!",
        data: deletedCategory,
    });
});
export const adminControllers = {
    handelUserRequest,
    createCategory,
    updateCategory,
    deleteCategory
};
