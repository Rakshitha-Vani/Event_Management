const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
exports.createOrder = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (!event.isPaid || event.price <= 0) {
      return res.status(400).json({ success: false, error: 'This is a free event' });
    }

    const options = {
      amount: event.price * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      eventId 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment Verified - Create/Update Booking
      const event = await Event.findById(eventId);
      
      // Atomic decrease in seats (already handled in booking service, but we'll adapt here)
      if (event.availableSeats <= 0) {
        return res.status(400).json({ success: false, error: 'Event sold out during payment' });
      }

      const booking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: 'confirmed',
        paymentStatus: 'completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });

      // Update seat count
      event.availableSeats -= 1;
      await event.save();

      // Emit websocket event
      const io = req.app.get('socketio');
      io.emit('bookingCreated', { eventId, booking });

      res.status(200).json({ success: true, message: "Payment verified successfully", data: booking });
    } else {
      res.status(400).json({ success: false, error: "Invalid payment signature" });
    }
  } catch (error) {
    next(error);
  }
};
