import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, Wrench, Zap } from 'lucide-react';
import { dashboardAPI } from '../services/api';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'delay' | 'maintenance' | 'general' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  staffId: {
    name: string;
  };
  createdAt: string;
}

const AnnouncementTicker: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await dashboardAPI.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    // Refresh announcements every 5 minutes
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 8000); // Change announcement every 8 seconds

      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'emergency':
        return <Zap className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Loading announcements...</span>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 mb-6">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4" />
          <span className="text-sm">All trains running on schedule</span>
        </div>
      </div>
    );
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className={`py-3 px-4 mb-6 border-l-4 ${getPriorityColor(currentAnnouncement.priority)}`}>
      <div className="flex items-center space-x-3">
        {getIcon(currentAnnouncement.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold truncate">
              {currentAnnouncement.title}
            </h3>
            <span className="text-xs opacity-75">
              by {currentAnnouncement.staffId.name}
            </span>
          </div>
          <p className="text-sm opacity-90 truncate">
            {currentAnnouncement.content}
          </p>
        </div>
        {announcements.length > 1 && (
          <div className="flex space-x-1">
            {announcements.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementTicker;
