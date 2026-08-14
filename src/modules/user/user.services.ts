import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { URegister } from "./user.interface";
import config from "../../config";
import { Role } from "../../generated/prisma/enums";

// create user and insert data into database
const registerUserDB = async (payload: URegister) => {
  const { name, email, password, bio, profilePhoto } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw new Error("user already exists!");
  }

  const hasPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      profilePhoto,
      password: hasPassword,
      profile: {
        create: {
          bio,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email: createUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

// ctRequest
const ctRequestDB = async (role: Role, userId: string) => {
  const isExists = await prisma.customerToTechnician.findUnique({
    where: {
      userId,
    },
  });

  if (isExists) {
    return "you already requested!";
  }

  const requestUser = await prisma.customerToTechnician.create({
    data: {
      userId: userId,
      role: role,
    },
  });

  return requestUser;
};

// get only technician
const getAllTechnicianDB = async () => {
  return await prisma.user.findMany({
    where: {
      role: 'TECHNICIAN'
    },
    omit: {
      password: true
    },
    include:{
      profile: true
    }
  });
};

export const userServices = { registerUserDB, ctRequestDB, getAllTechnicianDB };
