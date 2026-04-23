const bookingService = require('../services/booking.service');

// @desc    Book an event
// @route   POST /api/bookings
exports.bookEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const booking = await bookingService.bookEvent(req.user._id, eventId);

    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('bookingCreated', { eventId, booking });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.user._id, req.params.id);

    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('bookingCancelled', { eventId: booking.eventId, bookingId: booking._id });

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id);
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
