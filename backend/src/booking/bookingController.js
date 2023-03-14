import { createError, createMessage } from "../utils/createMessage";
import Booking from "./bookingModel";
import Room from "../room/roomModel";
import Hotel from "../hotel/hotelModel";

export default {
  // crate a new booking
  booking: async (req, res) => {
    try {
      const booking = await Booking.create({ user: req.user, ...req.body });
      const roomId = booking.roomId;

      await Room.findByIdAndUpdate(roomId, {
        $inc: { quantity: -booking.quantity },
      });

      res.status(201).json(booking);
    } catch (err) {
      return createError(res, 404, err || "No document found with that id");
    }
  },

  // get all user's booking
  getAllBooking: async (req, res) => {
    try {
      const booking = await Booking.find({ user: req.user });
      res.status(201).json(booking);
    } catch (err) {
      return createError(res, 404, err || "No document found with that id");
    }
  },
  // delete booking with booking id
  deleteBooking: async (req, res) => {
    try {
      const bookingPrev = await Booking.findOne({
        _id: req.params.id,
      });
      const quantity = bookingPrev.quantity;
      const roomId = bookingPrev.roomId;

      await Booking.deleteOne({
        _id: req.params.id,
        user: req.user,
      });

      await Room.findByIdAndUpdate(roomId, {
        $inc: { quantity: quantity },
      });

      return createMessage(res, 200, "Deleted booking successfully");
    } catch (err) {
      return createError(res, 404, err || "No document found with that id");
    }
  },

  // get all bookings of platform
  getTotalBooking: async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(201).json(bookings);
    } catch (err) {
      return createError(res, 404, err || "No document found with that id");
    }
  },

  // get bookings of hotels owned by user
  getBookingsToMe: async (req, res) => {
    try {
      const hotel = await Hotel.findOne({
        _id: req.params.hotelId,
        user: req.user
      });
      const bookings = await Booking.find({hotelId: hotel._id});
      res.status(201).json(bookings);
    } catch (err) {
      return createError(res, 404, err || "No document found with that id");
    }
  },

  // owner accept booking
  acceptBooking: async (req, res) => {
    try {
      let bookingPrev = await Booking.findOne({
        _id: req.params.id,
      });

      bookingPrev.status = 1;
      await bookingPrev.save();
      return createMessage(res, 200, "Aceepted booking successfully");
    } catch (err) {
      return createError(res, 404, err || "No document found with that id");
    }
  },
  // user finalize accepted booking
  finalizeBooking: async (req, res) => {
    try {
      let bookingPrev = await Booking.findOne({
        _id: req.params.id,
      });

      bookingPrev.status = 2;
      await bookingPrev.save();
      return createMessage(res, 200, "Finalized booking successfully");
    } catch (err) {
      return createError(res, 404, err || "No document found with that id");
    }
  },
};
