import { Router } from "express";
import { paymentServices } from "./payment.services";
import { paymentControllers } from "./payment.controller";

const router = Router()

router.get('/', paymentControllers.createCheckoutSession)


export const paymentRoutes = router