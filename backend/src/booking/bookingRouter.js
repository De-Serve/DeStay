import { auth } from "../api/middlewares";
import bookingController from "./bookingController";

const router = require("express").Router();

router.get("/", auth, bookingController.getAllBooking);
router.get("/me/:hotelId", auth, bookingController.getBookingsToMe);
router.get("/total", auth, bookingController.getTotalBooking);
router.post("/", auth, bookingController.booking);
router.post("/:id/accept", auth, bookingController.acceptBooking);
router.post("/:id/finalize", auth, bookingController.finalizeBooking);
router.delete("/:id", auth, bookingController.deleteBooking);

export default router;