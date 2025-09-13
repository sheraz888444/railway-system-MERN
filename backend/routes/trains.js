import express from 'express';
import { body, validationResult } from 'express-validator';
import Train from '../models/Train.js';
import auth, { authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all trains
router.get('/', async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    let query = {};

    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');

    const trains = await Train.find(query);
    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get train by ID
router.get('/:id', async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }
    res.json(train);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available seats for a train
router.get('/:id/seats', async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    if (!train.seats || train.seats.length === 0) {
      return res.json({ availableSeats: [] });
    }

    const availableSeats = train.seats.filter(seat => !seat.isBooked).map(seat => ({
      seatNumber: seat.seatNumber,
      class: seat.class,
      price: seat.price
    }));

    res.json({ availableSeats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create train (Admin/Staff only)
router.post('/', [auth, authorize('admin', 'staff')], [
  body('trainNumber').notEmpty().withMessage('Train number is required'),
  body('trainName').notEmpty().withMessage('Train name is required'),
  body('source').notEmpty().withMessage('Source is required'),
  body('destination').notEmpty().withMessage('Destination is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const train = new Train(req.body);
    await train.save();
    res.status(201).json(train);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update train (Admin/Staff only)
router.put('/:id', [auth, authorize('admin', 'staff')], async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    res.json(train);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete train (Admin only)
router.delete('/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }
    res.json({ message: 'Train deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
