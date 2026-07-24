import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { Role } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const auth = (...roles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers?.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!accessToken) {
      throw new Error(
        "You are not logged in. Please login to access this resource",
      );
    }

    const verifiedToken = await jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { id, name, email, role } = verifiedToken.data;

    if (roles.length && !roles.includes(role as Role)) {
      throw new Error(
        "Forbidden : You don't have permission to access this resource!",
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        name,
        email,
        role: role as Role,
      },
    });

    if (!user) {
      throw new Error("User not found. Please register and login again.");
    }

    if (user.status === "BLOCKED") {
      throw new Error("Your account has been blocked. Please contact support!");
    }

    req.user = {
      id: verifiedToken.data.id,
      name: verifiedToken.data.name,
      email: verifiedToken.data.email,
      role: verifiedToken.data.role,
    };

    next();
  });
};
