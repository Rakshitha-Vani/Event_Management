const express = require('express');
const router = express.Router();
const {
  bookEvent,
  cancelBooking,
  getAllBookings,
  getMyBookings,
} = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(protect); // Protect all booking routes

router.post('/', bookEvent);
router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelBooking);

router.get('/', authorize('admin'), getAllBookings);

module.exports = router;
