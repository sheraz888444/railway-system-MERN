import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Train, MapPin, Clock, Search } from 'lucide-react';
import { trainsAPI } from '@/services/api';

interface TrainData {
  _id: string;
  trainName: string;
  trainNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  currentLocation?: string;
  delay?: number;
}

interface TrackTrainProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrackTrain: React.FC<TrackTrainProps> = ({ isOpen, onClose }) => {
  const [trainNumber, setTrainNumber] = useState('');
  const [train, setTrain] = useState<TrainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!trainNumber.trim()) return;

    try {
      setLoading(true);
      setError(null);
      // For now, search all trains and find by number
      const trains = await trainsAPI.getAllTrains();
      const foundTrain = trains.find((t: any) => t.trainNumber === trainNumber);
      if (foundTrain) {
        setTrain(foundTrain);
      } else {
        setError('Train not found');
        setTrain(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search train');
      setTrain(null);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setTrainNumber('');
    setTrain(null);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Track Train</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="trainNumber">Train Number</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="trainNumber"
                  placeholder="Enter train number (e.g., 12345)"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading && <p className="text-center">Searching train...</p>}

          {train && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Train className="h-5 w-5 mr-2" />
                  {train.trainName} ({train.trainNumber})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{train.source} → {train.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{train.departureTime} - {train.arrivalTime}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={train.status === 'on-time' ? 'default' : 'secondary'}>
                        {train.status}
                      </Badge>
                    </div>
                    {train.currentLocation && (
                      <div className="flex justify-between">
                        <span>Current Location:</span>
                        <span>{train.currentLocation}</span>
                      </div>
                    )}
                    {train.delay && train.delay > 0 && (
                      <div className="flex justify-between">
                        <span>Delay:</span>
                        <span className="text-red-600">{train.delay} minutes</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={resetSearch}>
                    Search Another Train
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackTrain;
