import { Router } from "express";
import { categoryControllers } from "./category.controller";

const router = Router()

router.get('/', categoryControllers.getAllCategories)

export const categoryRoutes = router