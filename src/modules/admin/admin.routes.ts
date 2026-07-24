import { Router } from "express";
import { adminControllers } from "./admin.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router()

router.patch('/technician-requests/:userId/approve', auth(Role.ADMIN), adminControllers.handelUserRequest)

export const adminRoutes = router