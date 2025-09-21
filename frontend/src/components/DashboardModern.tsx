import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Train,
  Calendar,
  Settings,
  BookOpen,
  CreditCard,
  Clock,
  Ticket,
  Plus,
  LogOut,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle
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

interface DashboardProps {
  userRole: 'admin' | 'passenger' | 'staff';
}

const DashboardModern: React.FC<DashboardProps> = ({ userRole }) => {
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

  const getStats = () => {
    if (!statsData) return [];

    if (userRole === 'admin') {
      return [
        {
          title: 'Total Users',
          value: statsData.totalUsers?.toString() || '0',
          icon: Users,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-200',
          trend: '+12%'
        },
        {
          title: 'Active Trains',
          value: statsData.activeTrains?.toString() || '0',
          icon: Train,
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          borderColor: 'border-green-200',
          trend: '+5%'
        },
        {
          title: 'Today Bookings',
          value: statsData.todayBookings?.toString() || '0',
          icon: BookOpen,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'from-purple-50 to-purple-100',
          borderColor: 'border-purple-200',
          trend: '+8%'
        },
        {
          title: 'Revenue',
          value: `₹${statsData.revenue?.toLocaleString() || '0'}`,
          icon: CreditCard,
          color: 'from-orange-500 to-orange-600',
          bgColor: 'from-orange-50 to-orange-100',
          borderColor: 'border-orange-200',
          trend: '+15%'
        }
      ];
    } else if (userRole === 'passenger') {
      return [
        {
          title: 'Upcoming Trips',
          value: statsData.upcomingTrips?.toString() || '0',
          icon: Calendar,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-200',
          trend: '+2'
        },
        {
          title: 'Total Bookings',
          value: statsData.totalBookings?.toString() || '0',
          icon: BookOpen,
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          borderColor: 'border-green-200',
          trend: '+12'
        },
        {
          title: 'Saved Routes',
          value: statsData.savedRoutes?.toString() || '0',
          icon: Train,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'from-purple-50 to-purple-100',
          borderColor: 'border-purple-200',
          trend: '+3'
        },
