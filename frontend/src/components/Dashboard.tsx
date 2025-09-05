import React, { useState, useEffect } from 'react';
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
  LogOut
} from 'lucide-react';
import { dashboardAPI, trainsAPI } from '../services/api';
import TicketBookingForm from './TicketBookingForm';
import MyBookings from './MyBookings';
import TrackTrain from './TrackTrain';
import TrainSelector from './TrainSelector';
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

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
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
    distance: ''
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
              <p className="text-gray-600 mt-2">
                {userRole === 'admin' && 'Manage your railway system efficiently'}
                {userRole === 'passenger' && 'Track your journeys and manage bookings'}
                {userRole === 'staff' && 'Assist passengers and manage operations'}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
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

        {/* Registered Trains List for Admin */}
        {userRole === 'admin' && statsData?.registeredTrains && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Trains</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statsData.registeredTrains.map((train: any) => (
                  <tr key={train._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.trainNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.trainName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.departureTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train.arrivalTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(train.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
                  <button
                    onClick={() => setShowAddTrainModal(true)}
                    className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Train</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Users className="h-5 w-5" />
                    <span>Manage Users</span>
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
                onClick={() => setShowTrainSelector(true)}
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

      {/* Add Train Modal */}
      {showAddTrainModal && (
        <Dialog open={showAddTrainModal} onOpenChange={() => setShowAddTrainModal(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    !newTrainData.distance
                  ) {
                    toast.error('Please fill in all required fields');
                    return;
                  }
                  // Create train API call
                  await trainsAPI.createTrain({
                    ...newTrainData,
                    distance: Number(newTrainData.distance),
                    runningDays: newTrainData.runningDays
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
                    distance: ''
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
    </div>
  );
};

export default Dashboard;
