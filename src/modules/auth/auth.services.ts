import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ULogin } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Status } from "../../generated/prisma/enums";

// login user
const loginUserDB = async (payload: ULogin) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("user not fund! please register");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid Password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    { expiresIn: config.jwt_access_expire_in } as SignOptions,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    { expiresIn: config.jwt_refresh_expire_in } as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// generate accessToken using refreshToken
const genAccessToken = async (token: string) => {
  const verifiedRefreshToken = await jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }
  const { id } = verifiedRefreshToken.data;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === Status.BLOCKED) {
    throw new Error("user is blocked!");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    { expiresIn: config.jwt_access_expire_in } as SignOptions,
  );

  return { accessToken };
};

// my profile
const myProfileDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  });

  if (!user) {
    throw new Error("user not found!");
  }

  return user;
};

export const authServices = {
  loginUserDB,
  genAccessToken,
  myProfileDB,
};
