import express from 'express';
import auth, { authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Train from '../models/Train.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Admin dashboard stats
router.get('/admin', [auth, authorize('admin')], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeTrains = await Train.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await Booking.countDocuments({
      journeyDate: { $gte: today, $lt: tomorrow }
    });

    const revenueAgg = await Booking.aggregate([
      { $match: { journeyDate: { $gte: today, $lt: tomorrow }, bookingStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const revenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Get registered trains with details
    const registeredTrains = await Train.find({})
      .select('trainNumber trainName source destination departureTime arrivalTime seats createdAt')
      .sort({ createdAt: -1 });

    res.json({
      totalUsers,
      activeTrains,
      todayBookings,
      revenue,
      registeredTrains
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Passenger dashboard stats
router.get('/passenger', [auth, authorize('passenger')], async (req, res) => {
  try {
    const userId = req.user.userId;

    const upcomingTrips = await Booking.countDocuments({
      userId,
      journeyDate: { $gte: new Date() },
      bookingStatus: { $ne: 'cancelled' }
    });

    const totalBookings = await Booking.countDocuments({ userId });

    // For saved routes and loyalty points, assuming savedRoutes is a field in User model and loyaltyPoints as well
    const user = await User.findById(userId).select('savedRoutes loyaltyPoints');

    res.json({
      upcomingTrips,
      totalBookings,
      savedRoutes: user?.savedRoutes?.length || 0,
      loyaltyPoints: user?.loyaltyPoints || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Staff dashboard stats
router.get('/staff', [auth, authorize('staff')], async (req, res) => {
  try {
    const userId = req.user.userId;

    // Assuming staff assignments and tasks are stored in User model or related collections
    // For demo, using dummy counts or you can extend with real data models

    // Example: assignedTrains count from User model or related collection
    const assignedTrains = 12; // Placeholder, replace with real query if available
    const todayTasks = 8; // Placeholder
    const passengerAssists = 45; // Placeholder
    const completed = 37; // Placeholder

    res.json({
      assignedTrains,
      todayTasks,
      passengerAssists,
      completed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
