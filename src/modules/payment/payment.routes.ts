import { Router } from "express";

import { paymentControllers } from "./payment.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router()

router.post('/checkout',auth(Role.ADMIN, Role.CUSTOMER), paymentControllers.createCheckoutSession)


export const paymentRoutes = router