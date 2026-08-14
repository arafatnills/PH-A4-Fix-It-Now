import { Router } from "express";

import { paymentControllers } from "./payment.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post(
  "/checkout",
  auth(Role.CUSTOMER),
  paymentControllers.createCheckoutSession,
);

router.post("/webhook", paymentControllers.handelWebhook);

export const paymentRoutes = router;
