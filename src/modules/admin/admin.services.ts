import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const handelUserRequestDB = async (userId: string) => {
  const transitionResult = await prisma.$transaction(async (tx) => {
    const foundRequest = await tx.customerToTechnician.findUnique({
      where: {
        userId,
      },
    });

    if (!foundRequest) {
      throw new Error("request not found!");
    }
    const updatedUser = await tx.user.update({
      where: {
        id: foundRequest.userId,
      },
      data: {
        role: foundRequest.role,
      },
      omit: {
        password: true,
      },
    });

    await tx.customerToTechnician.delete({
      where: {
        userId,
      },
    });

    return updatedUser;
  });

  return transitionResult;
};

export const adminServices = {
  handelUserRequestDB,
};
