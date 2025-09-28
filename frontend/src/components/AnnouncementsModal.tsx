import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Info, Wrench, Zap } from 'lucide-react';

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

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'delay':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'maintenance':
      return <Wrench className="h-5 w-5 text-blue-500" />;
    case 'emergency':
      return <Zap className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-green-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
    case 'high':
      return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800';
    case 'medium':
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
    default:
      return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
  }
};

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ isOpen, onClose, announcements }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Announcements
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div key={announcement._id} className={`p-4 border-l-4 rounded-r-lg ${getPriorityColor(announcement.priority)}`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(announcement.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{announcement.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">{announcement.content}</p>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center space-x-4">
                      <span>By: {announcement.staffId.name}</span>
                      <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                      <span className="capitalize font-medium">Priority: {announcement.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Info className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Announcements</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">All clear for now. Check back later for updates.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementsModal;