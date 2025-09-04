import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  class: {
    type: String,
    enum: ['1A', '2A', '3A', 'SL', 'CC', '2S'],
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: true
  }
});

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true
  },
  trainName: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  runningDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  seats: [seatSchema],
  amenities: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'delayed'],
    default: 'active'
  },
  distance: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Train', trainSchema);