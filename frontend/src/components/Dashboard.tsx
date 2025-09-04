import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Train,
  Calendar,
  Settings,
  BookOpen,
  CreditCard,
  Clock
} from 'lucide-react';
import { dashboardAPI } from '../services/api';


interface DashboardProps {
  userRole: 'admin' | 'passenger' | 'staff';
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<any>(null);

  // Modal states for passenger
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showTrackTrain, setShowTrackTrain] = useState(false);

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
        { title: 'Total Users', value: statsData.totalUsers?.toString() || '0', icon: Users, color: 'bg-blue-500' },
        { title: 'Active Trains', value: statsData.activeTrains?.toString() || '0', icon: Train, color: 'bg-green-500' },
        { title: 'Today Bookings', value: statsData.todayBookings?.toString() || '0', icon: BookOpen, color: 'bg-purple-500' },
        { title: 'Revenue', value: `₹${statsData.revenue?.toLocaleString() || '0'}`, icon: CreditCard, color: 'bg-orange-500' }
      ];
    } else if (userRole === 'passenger') {
      return [
        { title: 'Upcoming Trips', value: statsData.upcomingTrips?.toString() || '0', icon: Calendar, color: 'bg-blue-500' },
        { title: 'Total Bookings', value: statsData.totalBookings?.toString() || '0', icon: BookOpen, color: 'bg-green-500' },
        { title: 'Saved Routes', value: statsData.savedRoutes?.toString() || '0', icon: Train, color: 'bg-purple-500' },
        { title: 'Loyalty Points', value: statsData.loyaltyPoints?.toString() || '0', icon: CreditCard, color: 'bg-orange-500' }
      ];
    } else if (userRole === 'staff') {
      return [
        { title: 'Assigned Trains', value: statsData.assignedTrains?.toString() || '0', icon: Train, color: 'bg-blue-500' },
        { title: 'Today Tasks', value: statsData.todayTasks?.toString() || '0', icon: Clock, color: 'bg-green-500' },
        { title: 'Passenger Assists', value: statsData.passengerAssists?.toString() || '0', icon: Users, color: 'bg-purple-500' },
        { title: 'Completed', value: statsData.completed?.toString() || '0', icon: BookOpen, color: 'bg-orange-500' }
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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-gray-600 mt-2">
            {userRole === 'admin' && 'Manage your railway system efficiently'}
            {userRole === 'passenger' && 'Track your journeys and manage bookings'}
            {userRole === 'staff' && 'Assist passengers and manage operations'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {userRole === 'admin' && 'Recent Activity'}
              {userRole === 'passenger' && 'Upcoming Journeys'}
              {userRole === 'staff' && "Today's Schedule"}
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {userRole === 'admin' && `System update completed - Module ${item}`}
                      {userRole === 'passenger' && `Delhi to Mumbai - Express ${item}201`}
                      {userRole === 'staff' && `Platform ${item} - Passenger assistance required`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {userRole === 'admin' && `${item} hours ago`}
                      {userRole === 'passenger' && `Departure: ${8 + item}:30 AM`}
                      {userRole === 'staff' && `${item}:${item * 15} PM`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {userRole === 'admin' && (
                <>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Users className="h-5 w-5" />
                    <span>Manage Users</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                    <Train className="h-5 w-5" />
                    <span>Add Train</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                    <BarChart3 className="h-5 w-5" />
                    <span>View Reports</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </>
              )}
              {userRole === 'passenger' && (
                <>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Book Ticket</span>
                  </button>
                  <button
                    onClick={() => setShowMyBookings(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>My Bookings</span>
                  </button>
                  <button
                    onClick={() => setShowTrackTrain(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Train className="h-5 w-5" />
                    <span>Track Train</span>
                  </button>
                </>
              )}
              {userRole === 'staff' && (
                <>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Users className="h-5 w-5" />
                    <span>Passenger Help</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                    <Train className="h-5 w-5" />
                    <span>Train Status</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                    <Calendar className="h-5 w-5" />
                    <span>Schedule</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
                    <BookOpen className="h-5 w-5" />
                    <span>Reports</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
