import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
const loginUser = catchAsync(async (req, res) => {
    const { accessToken, refreshToken } = await authServices.loginUserDB(req.body);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24, // 1 days
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "login successfully!",
        data: { accessToken, refreshToken },
    });
});
// generate accessToken using refreshToken
export const refreshToken = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await authServices.genAccessToken(refreshToken);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24, // 1 days
    });
    sendResponse(res, {
        success: true,
        status: status.CREATED,
        message: "Token refreshed successfully!",
        data: { accessToken },
    });
});
// my profile
const myProfile = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const me = await authServices.myProfileDB(userId);
    sendResponse(res, {
        success: true,
        status: status.OK,
        message: "my profile retrieved successfully!",
        data: me,
    });
});
export const authControllers = {
    loginUser,
    refreshToken,
    myProfile
};
