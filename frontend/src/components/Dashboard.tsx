import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  BarChart3,
  Users,
  Train,
  Calendar,
  Settings,
  BookOpen,
  CreditCard,
  Clock,
  Plus,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { dashboardAPI, trainsAPI } from '../services/api';
import TicketBookingForm from './TicketBookingForm';
import MyBookings from './MyBookings';
import TrackTrain from './TrackTrain';
import TrainSelector from './TrainSelector';
import AnnouncementTicker from './AnnouncementTicker';
import StaffReportsModal from './StaffReportsModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


interface DashboardProps {
  userRole: 'admin' | 'passenger' | 'staff';
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};


const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<any>(null);

  // Modal states for passenger
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showTrackTrain, setShowTrackTrain] = useState(false);
  const [showTrainSelector, setShowTrainSelector] = useState(false);

  // Modal state for admin add train
  const [showAddTrainModal, setShowAddTrainModal] = useState(false);

  // Modal states for staff
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [showDelays, setShowDelays] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [allTrains, setAllTrains] = useState<any[]>([]);
  const [reportForm, setReportForm] = useState({
    content: '',
    passengersAssisted: 0,
    issuesResolved: 0,
    trainsMonitored: 0,
    delaysReported: 0
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general' as 'delay' | 'maintenance' | 'general' | 'emergency',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    expiresAt: ''
  });

  // Modal states for admin
  const [showStaffReports, setShowStaffReports] = useState(false);
  const [staffReports, setStaffReports] = useState<any[]>([]);

  // Add train form state
  const [newTrainData, setNewTrainData] = useState({
    trainNumber: '',
    trainName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    runningDays: [] as string[],
    distance: '',
    totalSeats: '',
    seatClasses: {
      '1A': { count: '', price: '' },
      '2A': { count: '', price: '' },
      '3A': { count: '', price: '' },
      'SL': { count: '', price: '' },
      'CC': { count: '', price: '' },
      '2S': { count: '', price: '' }
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;
        if (userRole === 'admin') {
          data = await dashboardAPI.getAdminStats();
        } else if (userRole === 'passenger') {
          data = await dashboardAPI.getPassengerStats();
        } else if (userRole === 'staff') {
          data = await dashboardAPI.getStaffStats();
          // Fetch staff tasks
          const tasksData = await dashboardAPI.getStaffTasks();
          setTasks(tasksData);
          // Fetch all trains for schedules and delays
          const allTrainsData = await dashboardAPI.getAllTrains();
          setAllTrains(allTrainsData);
        }
        setStatsData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userRole]);

  useEffect(() => {
    if (userRole !== 'passenger') return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('new-announcement', (newAnnouncement: any) => {
      toast.info(`New Announcement: ${newAnnouncement.title}`, {
        description: newAnnouncement.content,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userRole]);


  const getStats = () => {
    if (!statsData) return [];

    if (userRole === 'admin') {
      return [
        { title: 'Total Users', value: statsData.totalUsers?.toString() || '0', icon: Users, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
        { title: 'Active Trains', value: statsData.activeTrains?.toString() || '0', icon: Train, color: 'bg-gradient-to-r from-green-500 to-green-600' },
        { title: 'Today Bookings', value: statsData.todayBookings?.toString() || '0', icon: BookOpen, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
        { title: 'Revenue', value: `Rs ${statsData.revenue?.toLocaleString() || '0'}`, icon: CreditCard, color: 'bg-gradient-to-r from-orange-500 to-orange-600' }
      ];
    } else if (userRole === 'passenger') {
      return [
        { title: 'Upcoming Trips', value: statsData.upcomingTrips?.toString() || '0', icon: Calendar, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
        { title: 'Total Bookings', value: statsData.totalBookings?.toString() || '0', icon: BookOpen, color: 'bg-gradient-to-r from-green-500 to-green-600' },
        { title: 'Saved Routes', value: statsData.savedRoutes?.toString() || '0', icon: Train, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
        { title: 'Loyalty Points', value: statsData.loyaltyPoints?.toString() || '0', icon: CreditCard, color: 'bg-gradient-to-r from-orange-500 to-orange-600' }
      ];
    } else if (userRole === 'staff') {
      return [
        { title: 'Assigned Trains', value: statsData.assignedTrainsCount?.toString() || '0', icon: Train, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
        { title: 'Today Tasks', value: statsData.todayTasksCount?.toString() || '0', icon: Clock, color: 'bg-gradient-to-r from-green-500 to-green-600' },
        { title: 'Passenger Assists', value: statsData.passengerAssistsCount?.toString() || '0', icon: Users, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
        { title: 'Completed Tasks', value: statsData.completedCount?.toString() || '0', icon: BookOpen, color: 'bg-gradient-to-r from-orange-500 to-orange-600' }
      ];
    }
    return [];
  };

  const stats = getStats();

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'admin': return 'Admin Dashboard';
      case 'passenger': return 'My Travel Dashboard';
      case 'staff': return 'Staff Control Panel';
      default: return 'Dashboard';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchStaffReports = async () => {
    try {
      const reports = await dashboardAPI.getAdminStaffReports();
      setStaffReports(reports);
    } catch (error) {
      console.error('Failed to fetch staff reports:', error);
      toast.error('Failed to load staff reports');
    }
  };

  const handleViewReports = async () => {
    await fetchStaffReports();
    setShowStaffReports(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-slate-900 min-h-screen p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 w-1/3 bg-gray-300 dark:bg-slate-700 rounded-md mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-96 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 dark:bg-slate-900 min-h-screen py-8 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Announcements Ticker for Passengers */}
        {userRole === 'passenger' && <AnnouncementTicker />}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getDashboardTitle()}</h1>
              <p className="text-gray-600 dark:text-slate-400 mt-2">
                {userRole === 'admin' && 'Manage your railway system efficiently'}
                {userRole === 'passenger' && 'Track your journeys and manage bookings'}
                {userRole === 'staff' && 'Assist passengers and manage operations'}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2 bg-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Registered Trains List for Admin */}
          {userRole === 'admin' && statsData?.registeredTrains && (
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Registered Trains</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  {['Train', 'Route', 'Schedule', 'Seats (Avail/Total)', 'Registered At', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  <AnimatePresence>
                    {statsData.registeredTrains.map((train: any) => {
                      const totalSeats = train.seats ? train.seats.length : 0;
                      const bookedSeats = train.seats ? train.seats.filter((s: any) => s.isBooked).length : 0;
                      const availableSeats = totalSeats - bookedSeats;
                      return (
                        <motion.tr
                          key={train._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{train.trainName} <span className="text-gray-500 dark:text-slate-400">({train.trainNumber})</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{train.source} → {train.destination}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{train.departureTime} - {train.arrivalTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{availableSeats} / {totalSeats}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{new Date(train.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to delete train ${train.trainName} (${train.trainNumber})?`)) {
                                  try {
                                    await trainsAPI.deleteTrain(train._id);
                                    toast.success('Train deleted successfully');
                                    const updatedStats = await dashboardAPI.getAdminStats();
                                    setStatsData(updatedStats);
                                  } catch (error: any) {
                                    toast.error(error.response?.data?.message || 'Failed to delete train');
                                  }
                                }
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50"
                            >
                              Delete
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Activity & Quick Actions */}
        <motion.div
          className={`grid grid-cols-1 gap-8 ${userRole === 'passenger' ? '' : 'lg:grid-cols-3'}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Activity Section - hidden for passenger */}
          {userRole !== 'passenger' && (
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {userRole === 'admin' && 'Recent Activity'}
                {userRole === 'staff' && "Assigned Trains & Tasks"}
              </h3>
              <div className="space-y-4">
                {userRole === 'staff' && statsData?.assignedTrains && statsData.assignedTrains.length > 0 ? (
                  statsData.assignedTrains.map((assignment: any) => (
                    <div key={assignment._id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600 rounded-lg border border-blue-200 dark:border-slate-600">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.trainId?.trainName} ({assignment.trainId?.trainNumber})
                        </p>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          {assignment.trainId?.source} → {assignment.trainId?.destination} | {assignment.trainId?.departureTime}
                          {assignment.trainId?.status === 'delayed' && (
                            <span className="ml-2 text-red-600 font-medium">
                              Delayed by {assignment.trainId?.delayMinutes} min
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : userRole === 'staff' ? (
                  <p className="text-gray-500 dark:text-slate-400 text-sm">No assigned trains</p>
                ) : (
                  [1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userRole === 'admin' && `System update completed - Module ${item}`}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          {userRole === 'admin' && `${item} hours ago`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 ${userRole === 'passenger' ? '' : 'lg:col-span-2'}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {userRole === 'admin' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddTrainModal(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Train</span>
                  </motion.button>
                  <motion.button
                    onClick={() => toast.info('Manage Users feature coming soon!')}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Manage Users</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleViewReports}
                    className="flex items-center justify-center space-x-2 p-4 bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>View Reports</span>
                  </motion.button>
                  <motion.button
                    onClick={() => toast.info('Settings feature coming soon!')}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2 p-4 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-500/30 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </motion.button>
                </>
              )}
              {userRole === 'passenger' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTrainSelector(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Book Ticket</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard/my-bookings')}
                    className="flex items-center justify-center space-x-2 p-4 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>My Bookings</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTrackTrain(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors"
                  >
                    <Train className="h-5 w-5" />
                    <span>Track Train</span>
                  </motion.button>
                </>
              )}
              {userRole === 'staff' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTasks(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>View Tasks</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSchedules(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                  >
                    <Train className="h-5 w-5" />
                    <span>Train Schedules</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDelays(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors"
                  >
                    <Clock className="h-5 w-5" />
                    <span>View Delays</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGenerateReport(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-500/30 transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Generate Report</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateAnnouncement(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>Create Announcement</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals for Passenger */}
      {userRole === 'passenger' && (
        <>
          {selectedTrain && (
            <TicketBookingForm
              train={selectedTrain}
              isOpen={showBookingForm}
              onClose={() => setShowBookingForm(false)}
            />
          )}
          <MyBookings
            isOpen={showMyBookings}
            onClose={() => setShowMyBookings(false)}
          />
          <TrackTrain
            isOpen={showTrackTrain}
            onClose={() => setShowTrackTrain(false)}
          />
        </>
      )}

      {/* Train Selector Modal */}
      {showTrainSelector && (
        <TrainSelector
          isOpen={showTrainSelector}
          onClose={() => setShowTrainSelector(false)}
          onSelectTrain={(train) => {
            setSelectedTrain(train);
            setShowTrainSelector(false);
            setShowBookingForm(true);
          }}
        />
      )}

      {/* Staff Reports Modal for Admin */}
      {showStaffReports && (
        <StaffReportsModal
          isOpen={showStaffReports}
          onClose={() => setShowStaffReports(false)}
          reports={staffReports}
          onUpdateReportStatus={async (reportId, status, reviewComments) => {
            // Placeholder for API call
            console.log('Updating report:', reportId, status, reviewComments);
            // await dashboardAPI.updateStaffReport(reportId, { status, reviewComments });
            await fetchStaffReports(); // Re-fetch to show updated status
          }}
        />
      )}


      {/* Add Train Modal */}
      {showAddTrainModal && (
        <Dialog open={showAddTrainModal} onOpenChange={() => setShowAddTrainModal(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 dark:text-white">
            <DialogHeader>
              <DialogTitle>Add New Train</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Validate required fields
                  if (
                    !newTrainData.trainNumber ||
                    !newTrainData.trainName ||
                    !newTrainData.source ||
                    !newTrainData.destination ||
                    !newTrainData.departureTime ||
                    !newTrainData.arrivalTime ||
                    !newTrainData.duration ||
                    !newTrainData.distance ||
                    !newTrainData.totalSeats
                  ) {
                    toast.error('Please fill in all required fields');
                    return;
                  }

                  // Generate seats array based on seat classes configuration
                  const seats = [];
                  let seatCounter = 1;

                  Object.entries(newTrainData.seatClasses).forEach(([className, config]) => {
                    const count = parseInt(config.count) || 0;
                    const price = parseFloat(config.price) || 0;

                    for (let i = 0; i < count; i++) {
                      seats.push({
                        seatNumber: `${seatCounter}${className.charAt(0)}`,
                        class: className,
                        price: price,
                        isBooked: false
                      });
                      seatCounter++;
                    }
                  });

                  // Create train API call
                  await trainsAPI.createTrain({
                    ...newTrainData,
                    distance: Number(newTrainData.distance),
                    totalSeats: Number(newTrainData.totalSeats),
                    runningDays: newTrainData.runningDays,
                    seats: seats
                  });
                  toast.success('Train added successfully');
                  setShowAddTrainModal(false);
                  setNewTrainData({
                    trainNumber: '',
                    trainName: '',
                    source: '',
                    destination: '',
                    departureTime: '',
                    arrivalTime: '',
                    duration: '',
                    runningDays: [],
                    distance: '',
                    totalSeats: '',
                    seatClasses: {
                      '1A': { count: '', price: '' },
                      '2A': { count: '', price: '' },
                      '3A': { count: '', price: '' },
                      'SL': { count: '', price: '' },
                      'CC': { count: '', price: '' },
                      '2S': { count: '', price: '' }
                    }
                  });
                  // Refresh dashboard stats
                  const updatedStats = await dashboardAPI.getAdminStats();
                  setStatsData(updatedStats);
                } catch (error: any) {
                  toast.error(error.response?.data?.message || 'Failed to add train');
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trainNumber">Train Number</Label>
                  <Input
                    id="trainNumber"
                    value={newTrainData.trainNumber}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, trainNumber: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="trainName">Train Name</Label>
                  <Input
                    id="trainName"
                    value={newTrainData.trainName}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, trainName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={newTrainData.source}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, source: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={newTrainData.destination}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, destination: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={newTrainData.departureTime}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, departureTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={newTrainData.arrivalTime}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g. 12h 30m"
                    value={newTrainData.duration}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    value={newTrainData.distance}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, distance: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalSeats">Total Seats</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    min="1"
                    value={newTrainData.totalSeats}
                    onChange={(e) => setNewTrainData(prev => ({ ...prev, totalSeats: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="runningDays">Running Days</Label>
                  <Select
                    value={newTrainData.runningDays.join(', ')}
                    onValueChange={(value) => {
                      const days = value.split(', ').filter(day => day.trim() !== '');
                      setNewTrainData(prev => ({ ...prev, runningDays: days }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select running days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday">All Days</SelectItem>
                      <SelectItem value="Monday, Tuesday, Wednesday, Thursday, Friday">Weekdays</SelectItem>
                      <SelectItem value="Saturday, Sunday">Weekends</SelectItem>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Seat Classes Configuration */}
              <div className="mt-6">
                <Label className="text-lg font-semibold mb-4 block">Seat Classes Configuration</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(newTrainData.seatClasses).map(([className, config]) => (
                    <div key={className} className="border rounded-lg p-4">
                      <Label className="font-medium">{className} - {className === '1A' ? 'First AC' : className === '2A' ? 'Second AC' : className === '3A' ? 'Third AC' : className === 'SL' ? 'Sleeper' : className === 'CC' ? 'Chair Car' : 'Second Sitting'}</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Label htmlFor={`${className}-count`} className="text-sm">Count</Label>
                          <Input
                            id={`${className}-count`}
                            type="number"
                            min="0"
                            placeholder="0"
                            value={config.count}
                            onChange={(e) => setNewTrainData(prev => ({
                              ...prev,
                              seatClasses: {
                                ...prev.seatClasses,
                                [className]: { ...config, count: e.target.value }
                              }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${className}-price`} className="text-sm">Price (PKR)</Label>
                          <Input
                            id={`${className}-price`}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={config.price}
                            onChange={(e) => setNewTrainData(prev => ({
                              ...prev,
                              seatClasses: {
                                ...prev.seatClasses,
                                [className]: { ...config, price: e.target.value }
                              }
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowAddTrainModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Train
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Staff Modals */}
      {userRole === 'staff' && (
        <>
          {/* Tasks Modal */}
          {showTasks && (
            <Dialog open={showTasks} onOpenChange={() => setShowTasks(false)}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>My Tasks</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {tasks.length > 0 ? (
                    tasks.map((task: any) => (
                      <div key={task._id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status}
                              </span>
                              {task.location && (
                                <span className="text-xs text-gray-500">📍 {task.location}</span>
                              )}
                            </div>
                          </div>
                          {task.status !== 'completed' && (
                            <Button
                              size="sm"
                              onClick={async () => {
                                try {
                                  await dashboardAPI.updateTaskStatus(task._id, 'completed');
                                  const updatedTasks = await dashboardAPI.getStaffTasks();
                                  setTasks(updatedTasks);
                                  toast.success('Task completed!');
                                } catch (error) {
                                  toast.error('Failed to update task');
                                }
                              }}
                              className="ml-4"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No tasks assigned</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Schedules Modal */}
          {showSchedules && (
            <Dialog open={showSchedules} onOpenChange={() => setShowSchedules(false)}>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Train Schedules</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {allTrains.length > 0 ? (
                    allTrains.map((train: any) => (
                      <div key={train._id} className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{train.trainName} ({train.trainNumber})</h4>
                            <p className="text-sm text-gray-600">
                              {train.source} → {train.destination}
                            </p>
                            <p className="text-sm text-gray-500">
                              Departure: {train.departureTime} | Arrival: {train.arrivalTime}
                            </p>
                            <p className="text-sm text-gray-500">
                              Duration: {train.duration} | Distance: {train.distance} km
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              train.status === 'active' ? 'bg-green-100 text-green-800' :
                              train.status === 'delayed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {train.status}
                            </span>
                            {train.status === 'delayed' && (
                              <p className="text-sm text-red-600 mt-1">
                                Delayed by {train.delayMinutes} min
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No trains available</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Delays Modal */}
          {showDelays && (
            <Dialog open={showDelays} onOpenChange={() => setShowDelays(false)}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Train Delays</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {allTrains.filter((train: any) => train.status === 'delayed').length > 0 ? (
                    allTrains.filter((train: any) => train.status === 'delayed').map((train: any) => (
                      <div key={train._id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{train.trainName} ({train.trainNumber})</h4>
                            <p className="text-sm text-gray-600">
                              {train.source} → {train.destination}
                            </p>
                            <p className="text-sm text-gray-500">
                              Scheduled: {train.departureTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-red-600">
                              {train.delayMinutes} min delay
                            </p>
                            {train.delayReason && (
                              <p className="text-sm text-red-500">{train.delayReason}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No delayed trains</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Generate Report Modal */}
          {showGenerateReport && (
            <Dialog open={showGenerateReport} onOpenChange={() => setShowGenerateReport(false)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Generate Daily Report</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await dashboardAPI.createStaffReport({
                        content: reportForm.content,
                        metrics: {
                          passengersAssisted: reportForm.passengersAssisted,
                          issuesResolved: reportForm.issuesResolved,
                          trainsMonitored: reportForm.trainsMonitored,
                          delaysReported: reportForm.delaysReported
                        }
                      });
                      toast.success('Report submitted successfully!');
                      setShowGenerateReport(false);
                      setReportForm({
                        content: '',
                        passengersAssisted: 0,
                        issuesResolved: 0,
                        trainsMonitored: 0,
                        delaysReported: 0
                      });
                    } catch (error) {
                      toast.error('Failed to submit report');
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content">Report Content</Label>
                      <Textarea
                        id="content"
                        value={reportForm.content}
                        onChange={(e) => setReportForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Describe your activities for today..."
                        required
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passengersAssisted">Passengers Assisted</Label>
                        <Input
                          id="passengersAssisted"
                          type="number"
                          min="0"
                          value={reportForm.passengersAssisted}
                          onChange={(e) => setReportForm(prev => ({ ...prev, passengersAssisted: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="issuesResolved">Issues Resolved</Label>
                        <Input
                          id="issuesResolved"
                          type="number"
                          min="0"
                          value={reportForm.issuesResolved}
                          onChange={(e) => setReportForm(prev => ({ ...prev, issuesResolved: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="trainsMonitored">Trains Monitored</Label>
                        <Input
                          id="trainsMonitored"
                          type="number"
                          min="0"
                          value={reportForm.trainsMonitored}
                          onChange={(e) => setReportForm(prev => ({ ...prev, trainsMonitored: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="delaysReported">Delays Reported</Label>
                        <Input
                          id="delaysReported"
                          type="number"
                          min="0"
                          value={reportForm.delaysReported}
                          onChange={(e) => setReportForm(prev => ({ ...prev, delaysReported: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => setShowGenerateReport(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Submit Report
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* Create Announcement Modal */}
          {showCreateAnnouncement && (
            <Dialog open={showCreateAnnouncement} onOpenChange={() => setShowCreateAnnouncement(false)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await dashboardAPI.createAnnouncement(announcementForm);
                      toast.success('Announcement created successfully!');
                      setShowCreateAnnouncement(false);
                      setAnnouncementForm({
                        title: '',
                        content: '',
                        type: 'general',
                        priority: 'medium',
                        expiresAt: ''
                      });
                    } catch (error) {
                      toast.error('Failed to create announcement');
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="announcement-title">Title</Label>
                      <Input id="announcement-title" value={announcementForm.title} onChange={(e) => setAnnouncementForm(p => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div>
                      <Label htmlFor="announcement-content">Content</Label>
                      <Textarea id="announcement-content" value={announcementForm.content} onChange={(e) => setAnnouncementForm(p => ({ ...p, content: e.target.value }))} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="announcement-type">Type</Label>
                        <Select value={announcementForm.type} onValueChange={(v) => setAnnouncementForm(p => ({ ...p, type: v as any }))}>
                          <SelectTrigger id="announcement-type"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="delay">Delay</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="announcement-priority">Priority</Label>
                        <Select value={announcementForm.priority} onValueChange={(v) => setAnnouncementForm(p => ({ ...p, priority: v as any }))}>
                          <SelectTrigger id="announcement-priority"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="announcement-expires">Expires At (Optional)</Label>
                      <Input id="announcement-expires" type="datetime-local" value={announcementForm.expiresAt} onChange={(e) => setAnnouncementForm(p => ({ ...p, expiresAt: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => setShowCreateAnnouncement(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Announcement
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

        </>
      )}
    </div>
  );
};

export default Dashboard;
