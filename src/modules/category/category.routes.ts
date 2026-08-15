import { Router } from "express";
import { categoryControllers } from "./category.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.get("/", categoryControllers.getAllCategories);
router.delete(
  "/:categoryId/delete",
  auth(Role.ADMIN),
  categoryControllers.deleteCategory,
);

export const categoryRoutes = router;
