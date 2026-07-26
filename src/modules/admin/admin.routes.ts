import { Router } from "express";
import { adminControllers } from "./admin.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.patch(
  "/technician-requests/:userId/approve",
  auth(Role.ADMIN),
  adminControllers.handelUserRequest,
);

router.post("/categories", auth(Role.ADMIN), adminControllers.createCategory);
router.patch("/categories/:catId/update", auth(Role.ADMIN), adminControllers.updateCategory);
router.delete("/categories/:catId/delete", auth(Role.ADMIN), adminControllers.deleteCategory);

export const adminRoutes = router;
