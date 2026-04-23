const Booking = require('../models/Booking');
const Event = require('../models/Event');
const mongoose = require('mongoose');

class BookingService {
  async bookEvent(userId, eventId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const event = await Event.findById(eventId).session(session);
      if (!event) throw new Error('Event not found');

      if (event.availableSeats <= 0) {
        throw new Error('Event is full');
      }

      // Check for double booking
      const existingBooking = await Booking.findOne({ userId, eventId }).session(session);
      if (existingBooking && existingBooking.status === 'confirmed') {
        throw new Error('You have already booked this event');
      }

      // Create booking or update cancelled one
      let booking;
      if (existingBooking && existingBooking.status === 'cancelled') {
        existingBooking.status = 'confirmed';
        existingBooking.bookingDate = Date.now();
        booking = await existingBooking.save({ session });
      } else {
        booking = await Booking.create([{ userId, eventId }], { session });
        booking = booking[0];
      }

      // Decrement seats
      event.availableSeats -= 1;
      await event.save({ session });

      await session.commitTransaction();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async cancelBooking(userId, bookingId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({ _id: bookingId, userId }).session(session);
      if (!booking) throw new Error('Booking not found');
      if (booking.status === 'cancelled') throw new Error('Booking already cancelled');

      const event = await Event.findById(booking.eventId).session(session);
      if (event) {
        event.availableSeats += 1;
        await event.save({ session });
      }

      booking.status = 'cancelled';
      await booking.save({ session });

      await session.commitTransaction();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAllBookings() {
    return await Booking.find().populate('userId', 'name email').populate('eventId', 'title date');
  }

  async getUserBookings(userId) {
    return await Booking.find({ userId }).populate('eventId', 'title date location');
  }
}

module.exports = new BookingService();
