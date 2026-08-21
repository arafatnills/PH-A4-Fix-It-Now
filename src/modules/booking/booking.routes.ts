import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import { auth } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER, Role.ADMIN), bookingControllers.createBooking);
router.get("/my-bookings", auth(Role.CUSTOMER, Role.ADMIN), bookingControllers.getMyBookings);
router.get("/technician-bookings", auth(Role.TECHNICIAN, Role.ADMIN), bookingControllers.getTechnicianBookings);
router.patch("/my-bookings/:bookingId/cancel", auth(Role.CUSTOMER, Role.ADMIN), bookingControllers.cancelMyBooking);
router.patch("/my-bookings/:bookingId/accept",auth(Role.TECHNICIAN, Role.ADMIN),  bookingControllers.acceptBooking);

export const bookingRoutes = router;
