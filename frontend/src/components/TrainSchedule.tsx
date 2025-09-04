import React, { useState } from 'react';
import { Clock, MapPin, Filter, Search } from 'lucide-react';

const TrainSchedule: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const schedules = [
    {
      id: '1',
      trainName: 'Rajdhani Express',
      trainNumber: '12001',
      from: 'New Delhi',
      to: 'Mumbai Central',
      departure: '16:55',
      arrival: '08:35+1',
      platform: '1',
      status: 'On Time',
      delay: 0
    },
    {
      id: '2',
      trainName: 'Shatabdi Express',
      trainNumber: '12002',
      from: 'Chennai Central',
      to: 'Bangalore',
      departure: '06:00',
      arrival: '11:00',
      platform: '3',
      status: 'Delayed',
      delay: 15
    },
    {
      id: '3',
      trainName: 'Duronto Express',
      trainNumber: '12259',
      from: 'Sealdah',
      to: 'New Delhi',
      departure: '20:05',
      arrival: '10:45+1',
      platform: '2',
      status: 'On Time',
      delay: 0
    },
    {
      id: '4',
      trainName: 'Garib Rath',
      trainNumber: '12615',
      from: 'New Delhi',
      to: 'Chennai Central',
      departure: '15:50',
      arrival: '22:45+1',
      platform: '4',
      status: 'Cancelled',
      delay: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesFilter = filter === 'all' || schedule.status.toLowerCase() === filter;
    const matchesSearch = schedule.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.trainNumber.includes(searchTerm) ||
                         schedule.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.to.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Clock className="h-6 w-6" />
          <span>Live Train Schedule</span>
        </h2>
        <p className="text-blue-100 mt-1">Real-time departure and arrival information</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search trains, stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Trains</option>
              <option value="on time">On Time</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{schedule.trainName}</div>
                      <div className="text-sm text-gray-500">#{schedule.trainNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{schedule.from}</div>
                        <div className="text-xs text-gray-500">to {schedule.to}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {schedule.departure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {schedule.arrival}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Platform {schedule.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                      {schedule.delay > 0 && ` (+${schedule.delay}m)`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchedules.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No trains found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainSchedule;