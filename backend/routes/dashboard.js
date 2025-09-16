import express from 'express';
import auth, { authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Train from '../models/Train.js';
import Booking from '../models/Booking.js';
import StaffAssignment from '../models/StaffAssignment.js';
import Task from '../models/Task.js';
import Report from '../models/Report.js';
import Announcement from '../models/Announcement.js';

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

    // Fetch assigned trains count
    const assignedTrainsCount = await StaffAssignment.countDocuments({ staffId: userId, status: 'active' });

    // Fetch today's tasks count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayTasksCount = await Task.countDocuments({
      staffId: userId,
      dueDate: { $gte: todayStart, $lt: todayEnd },
      status: { $ne: 'completed' }
    });

    // Fetch passenger assists count (example: tasks of type passenger_assistance completed today)
    const passengerAssistsCount = await Task.countDocuments({
      staffId: userId,
      type: 'passenger_assistance',
      status: 'completed',
      completedAt: { $gte: todayStart, $lt: todayEnd }
    });

    // Fetch completed tasks count
    const completedCount = await Task.countDocuments({
      staffId: userId,
      status: 'completed'
    });

    // Fetch train schedules assigned to staff
    const assignedTrains = await StaffAssignment.find({ staffId: userId, status: 'active' })
      .populate({
        path: 'trainId',
        select: 'trainNumber trainName source destination departureTime arrivalTime status delayMinutes delayReason'
      });

    // Fetch reports submitted by staff for today
    const reports = await Report.find({
      staffId: userId,
      date: { $gte: todayStart, $lt: todayEnd }
    }).sort({ date: -1 });

    res.json({
      assignedTrainsCount,
      todayTasksCount,
      passengerAssistsCount,
      completedCount,
      assignedTrains,
      reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Staff tasks
router.get('/staff/tasks', [auth, authorize('staff')], async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({ staffId: userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.put('/staff/tasks/:taskId', [auth, authorize('staff')], async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, staffId: userId },
      { status, completedAt: status === 'completed' ? new Date() : null },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Staff reports
router.get('/staff/reports', [auth, authorize('staff')], async (req, res) => {
  try {
    const userId = req.user.userId;
    const reports = await Report.find({ staffId: userId }).sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create daily report
router.post('/staff/reports', [auth, authorize('staff')], async (req, res) => {
  try {
    const userId = req.user.userId;
    const { content, metrics, type = 'daily' } = req.body;

    const report = new Report({
      staffId: userId,
      content,
      metrics,
      type
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin view all staff reports
router.get('/admin/staff-reports', [auth, authorize('admin')], async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('staffId', 'name email')
      .sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update report status (admin review)
router.put('/admin/reports/:reportId', [auth, authorize('admin')], async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, reviewComments } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status, reviewedBy: req.user.userId, reviewComments },
      { new: true }
    ).populate('staffId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Announcements
// Get active announcements for passengers
router.get('/announcements', [auth], async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    })
    .populate('staffId', 'name')
    .sort({ priority: -1, createdAt: -1 })
    .limit(10);

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create announcement (staff only)
router.post('/staff/announcements', [auth, authorize('staff')], async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content, type, priority, expiresAt } = req.body;

    const announcement = new Announcement({
      staffId: userId,
      title,
      content,
      type,
      priority,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all announcements for staff/admin
router.get('/staff/announcements', [auth, authorize('staff')], async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .populate('staffId', 'name email')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update announcement status
router.put('/staff/announcements/:announcementId', [auth, authorize('staff')], async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { isActive } = req.body;
    const userId = req.user.userId;

    const announcement = await Announcement.findOneAndUpdate(
      { _id: announcementId, staffId: userId },
      { isActive, updatedAt: new Date() },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete announcement
router.delete('/staff/announcements/:announcementId', [auth, authorize('staff')], async (req, res) => {
  try {
    const { announcementId } = req.params;
    const userId = req.user.userId;

    const announcement = await Announcement.findOneAndDelete({
      _id: announcementId,
      staffId: userId
    });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
