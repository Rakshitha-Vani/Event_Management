const eventService = require('../services/event.service');

// @desc    Create new event
// @route   POST /api/events
exports.createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user._id);
    
    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('eventCreated', event);

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
exports.getEvents = async (req, res, next) => {
  try {
    const result = await eventService.getAllEvents(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
exports.getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);

    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('eventUpdated', event);

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);

    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('eventDeleted', req.params.id);

    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};
