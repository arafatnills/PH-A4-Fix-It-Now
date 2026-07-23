import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { URegister } from "./user.interface";
import config from "../../config";


// create user and insert data into database
const registerUserDB = async (payload: URegister) => {
  const { name, email, password, bio } = payload;

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

export const userServices = { registerUserDB };
