import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/register", userControllers.registerUser);
router.get("/technicians", userControllers.getAllTechnician);
router.patch(
  "/request-technician",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  userControllers.ctRequest,
);

export const userRoutes = router;
