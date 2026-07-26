import { prisma } from "../../lib/prisma";
// handel user > customer to technician
const handelUserRequestDB = async (userId) => {
    return await prisma.$transaction(async (tx) => {
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
};
// create categories
const createCategoryDB = async (catName) => {
    const isCatExists = await prisma.category.findUnique({
        where: {
            name: catName.trim(),
        },
    });
    if (isCatExists) {
        throw new Error(`${catName} category is already exists!`);
    }
    return await prisma.category.create({
        data: {
            name: catName.trim(),
        },
    });
};
// update categories
const updateCategoryDB = async (catName, catId) => {
    const isCatExists = await prisma.category.findUnique({
        where: {
            id: catId,
        },
    });
    if (!isCatExists) {
        throw new Error(`${catName} is not found!`);
    }
    return await prisma.category.update({
        where: {
            id: catId,
        },
        data: {
            name: catName.trim(),
        },
    });
};
// delete categories
const deleteCategoryDB = async (catId) => {
    const isCatExists = await prisma.category.findUnique({
        where: {
            id: catId,
        },
    });
    if (!isCatExists) {
        throw new Error(`category not found!`);
    }
    return await prisma.category.delete({
        where: {
            id: catId,
        },
    });
};
export const adminServices = {
    handelUserRequestDB,
    createCategoryDB,
    updateCategoryDB,
    deleteCategoryDB
};
