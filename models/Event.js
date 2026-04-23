const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    price: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Please add capacity'],
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search and Filter indexes
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);
