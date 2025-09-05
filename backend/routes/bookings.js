import express from 'express';
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

    // Calculate total amount
    const totalAmount = passengers.reduce((sum, passenger) => {
      const seat = train.seats?.find(s => s.seatNumber === passenger.seatNumber);
      if (!seat) {
        throw new Error(`Seat ${passenger.seatNumber} not found in train ${train.trainName}. Available seats: ${train.seats?.map(s => s.seatNumber).join(', ')}`);
      }
      if (seat.isBooked) {
        throw new Error(`Seat ${passenger.seatNumber} is already booked`);
      }
      if (!seat.price || seat.price <= 0) {
        throw new Error(`Invalid price for seat ${passenger.seatNumber}`);
      }
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
      .populate('trainId', 'trainName trainNumber source destination')
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

    booking.bookingStatus = 'cancelled';
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;