import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Train, Search, MapPin, Clock } from 'lucide-react';
import { trainsAPI } from '@/services/api';

interface TrainData {
  _id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seats: Array<{
    seatNumber: string;
    class: string;
    price: number;
    isBooked: boolean;
  }>;
}

interface TrainSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrain: (train: TrainData) => void;
}

const TrainSelector: React.FC<TrainSelectorProps> = ({ isOpen, onClose, onSelectTrain }) => {
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<TrainData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchTrains();
    }
  }, [isOpen]);

  useEffect(() => {
    filterTrains();
  }, [trains, searchParams]);

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const data = await trainsAPI.getAllTrains();
      setTrains(data);
    } catch (error) {
      console.error('Failed to fetch trains:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrains = () => {
    let filtered = trains;

    if (searchParams.source) {
      filtered = filtered.filter(train =>
        train.source.toLowerCase().includes(searchParams.source.toLowerCase())
      );
    }

    if (searchParams.destination) {
      filtered = filtered.filter(train =>
        train.destination.toLowerCase().includes(searchParams.destination.toLowerCase())
      );
    }

    setFilteredTrains(filtered);
  };

  const handleSearch = () => {
    filterTrains();
  };

  const handleSelectTrain = (train: TrainData) => {
    onSelectTrain(train);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Train</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="source">From</Label>
              <Input
                id="source"
                placeholder="Source station"
                value={searchParams.source}
                onChange={(e) => setSearchParams(prev => ({ ...prev, source: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                placeholder="Destination station"
                value={searchParams.destination}
                onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Search Trains
          </Button>

          {/* Train List */}
          <div className="space-y-4">
            {loading && <p className="text-center">Loading trains...</p>}

            {!loading && filteredTrains.length === 0 && (
              <p className="text-center text-gray-600">No trains found</p>
            )}

            {filteredTrains.map((train) => (
              <Card key={train._id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Train className="h-5 w-5 mr-2" />
                      {train.trainName} ({train.trainNumber})
                    </CardTitle>
                    <Button onClick={() => handleSelectTrain(train)}>
                      Select Train
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{train.source}</p>
                        <p className="text-sm text-gray-600">{train.departureTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{train.destination}</p>
                        <p className="text-sm text-gray-600">{train.arrivalTime}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Available Seats</p>
                      <p className="font-medium">
                        {train.seats?.filter(seat => !seat.isBooked).length || 0} seats available
                      </p>
                    </div>
                  </div>

                  {/* Seat Classes */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Seat Classes:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(train.seats?.map(seat => seat.class))).map(seatClass => {
                        const classSeats = train.seats?.filter(seat => seat.class === seatClass && !seat.isBooked) || [];
                        const minPrice = Math.min(...classSeats.map(seat => seat.price));
                        return (
                          <div key={seatClass} className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                            {seatClass}: ₹{minPrice} ({classSeats.length} seats)
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainSelector;
