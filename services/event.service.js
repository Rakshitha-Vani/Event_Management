const Event = require('../models/Event');

class EventService {
  async createEvent(eventData, userId) {
    const event = await Event.create({
      ...eventData,
      createdBy: userId,
      availableSeats: eventData.capacity,
    });
    return event;
  }

  async getAllEvents(query) {
    const { category, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }

    const events = await Event.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Event.countDocuments(filter);

    return {
      events,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id) {
    return await Event.findById(id).populate('createdBy', 'name email');
  }

  async updateEvent(id, updateData) {
    const event = await Event.findById(id);
    if (!event) throw new Error('Event not found');

    // If capacity is updated, adjust availableSeats
    if (updateData.capacity !== undefined) {
      const difference = updateData.capacity - event.capacity;
      updateData.availableSeats = event.availableSeats + difference;
      if (updateData.availableSeats < 0) {
        throw new Error('New capacity is less than current bookings');
      }
    }

    return await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteEvent(id) {
    return await Event.findByIdAndDelete(id);
  }
}

module.exports = new EventService();
