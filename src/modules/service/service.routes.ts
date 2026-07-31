import { Router } from "express";
import { serviceControllers } from "./service.controller";
import { Role } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth.middleware";

const router  = Router()
router.get("/", serviceControllers.getAllServices);
router.get("/:id", serviceControllers.getSingleServices);
router.post("/", auth(Role.TECHNICIAN), serviceControllers.createService);

export const serviceRotes = router