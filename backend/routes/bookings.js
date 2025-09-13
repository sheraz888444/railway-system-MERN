import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import auth, { authorize } from '../middleware/auth.js';

const router = express.Router();

// Generate PNR
const generatePNR = () => {
  return Math.random().toString(36).substr(2, 10).toUpperCase();
};

// Generate Booking ID
const generateBookingId = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
};

// Create booking
router.post('/', [auth], [
  body('trainId').notEmpty().withMessage('Train ID is required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('journeyDate').isISO8601().withMessage('Valid journey date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trainId, passengers, journeyDate } = req.body;

    // Verify train exists
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Check if train has seats configured
    if (!train.seats || train.seats.length === 0) {
      return res.status(400).json({ message: 'No seats available for this train. Please contact administrator.' });
    }

    // Calculate total amount and validate seats
    const bookedSeats = [];
    const totalAmount = passengers.reduce((sum, passenger) => {
      const seat = train.seats.find(s => s.seatNumber === passenger.seatNumber);
      if (!seat) {
        throw new Error(`Seat ${passenger.seatNumber} not found in train ${train.trainName}. Available seats: ${train.seats.filter(s => !s.isBooked).map(s => s.seatNumber).join(', ')}`);
      }
      if (seat.isBooked) {
        throw new Error(`Seat ${passenger.seatNumber} is already booked`);
      }
      if (!seat.price || seat.price <= 0) {
        throw new Error(`Invalid price for seat ${passenger.seatNumber}`);
      }
      bookedSeats.push(seat.seatNumber);
      return sum + seat.price;
    }, 0);

    const booking = new Booking({
      bookingId: generateBookingId(),
      userId: req.user.userId,
      trainId,
      passengers,
      journeyDate,
      totalAmount,
      pnr: generatePNR()
    });

    await booking.save();

    // Update train seats to mark as booked
    bookedSeats.forEach(seatNumber => {
      const seatIndex = train.seats.findIndex(s => s.seatNumber === seatNumber);
      if (seatIndex !== -1) {
        train.seats[seatIndex].isBooked = true;
      }
    });
    await train.save();

    await booking.populate('trainId', 'trainName trainNumber source destination');

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('trainId', 'trainName trainNumber source destination departureTime arrivalTime')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings (Admin/Staff only)
router.get('/', [auth, authorize('admin', 'staff')], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('trainId', 'trainName trainNumber source destination')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by PNR
router.get('/pnr/:pnr', async (req, res) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr })
      .populate('trainId', 'trainName trainNumber source destination departureTime arrivalTime');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin/staff
    if (booking.userId.toString() !== req.user.userId && !['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If booking is already cancelled, return
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Get the train to update seat availability
    const train = await Train.findById(booking.trainId);
    if (train && train.seats) {
      // Mark seats as available
      booking.passengers.forEach(passenger => {
        const seatIndex = train.seats.findIndex(s => s.seatNumber === passenger.seatNumber);
        if (seatIndex !== -1) {
          train.seats[seatIndex].isBooked = false;
        }
      });
      await train.save();
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;