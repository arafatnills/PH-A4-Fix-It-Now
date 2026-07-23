import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router()

router.post('/login', authControllers.loginUser)
router.post('/refresh-token', authControllers.refreshToken)


export const authRoutes = router 