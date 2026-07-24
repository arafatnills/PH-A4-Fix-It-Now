import { Router } from "express";
import { authControllers } from "./auth.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/login", authControllers.loginUser);
router.post("/refresh-token", authControllers.refreshToken);
router.get("/me", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), authControllers.myProfile);

export const authRoutes = router;
