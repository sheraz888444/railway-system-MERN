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
  const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // Common Indian railway stations for autocomplete
  const railwayStations = [
    'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad',
    'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
    'Rajkot', 'Varanasi', 'Srinagar', 'Amritsar', 'Allahabad', 'Ranchi', 'Jabalpur', 'Gwalior',
    'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Mysore',
    'Bareilly', 'Aligarh', 'Moradabad', 'Gurgaon', 'Noida', 'Greater Noida', 'Ghaziabad',
    'Faridabad', 'Gurugram', 'Sonipat', 'Panipat', 'Karnal', 'Ambala', 'Chandigarh', 'Shimla'
  ];

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
      // Pass search params to API for SEO and filtering
      const data = await trainsAPI.getAllTrains({
        source: searchParams.source,
        destination: searchParams.destination,
        date: searchParams.date,
      });
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

    // Add search by train name and number for better SEO
    if (searchParams.source || searchParams.destination) {
      // If searching by source/destination, also include trains that match by name/number
      const searchTerm = (searchParams.source + ' ' + searchParams.destination).toLowerCase().trim();
      if (searchTerm) {
        filtered = filtered.filter(train =>
          train.trainName.toLowerCase().includes(searchTerm) ||
          train.trainNumber.toLowerCase().includes(searchTerm) ||
          train.source.toLowerCase().includes(searchTerm) ||
          train.destination.toLowerCase().includes(searchTerm)
        );
      }
    }

    setFilteredTrains(filtered);
  };

  const handleSearch = () => {
    filterTrains();
  };

  const handleSelectTrain = (train: TrainData) => {
    // Pass train with id field for consistency with TicketBookingForm
    const trainWithId = { ...train, id: train._id };
    onSelectTrain(trainWithId);
    onClose();
  };

  const handleSourceChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, source: value }));
    if (value.length > 0) {
      const filtered = railwayStations.filter(station =>
        station.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSourceSuggestions(filtered);
      setShowSourceSuggestions(true);
    } else {
      setShowSourceSuggestions(false);
    }
  };

  const handleDestinationChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, destination: value }));
    if (value.length > 0) {
      const filtered = railwayStations.filter(station =>
        station.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setDestinationSuggestions(filtered);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const selectSourceSuggestion = (station: string) => {
    setSearchParams(prev => ({ ...prev, source: station }));
    setShowSourceSuggestions(false);
  };

  const selectDestinationSuggestion = (station: string) => {
    setSearchParams(prev => ({ ...prev, destination: station }));
    setShowDestinationSuggestions(false);
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
            <div className="relative">
              <Label htmlFor="source">From</Label>
              <Input
                id="source"
                placeholder="Source station"
                value={searchParams.source}
                onChange={(e) => handleSourceChange(e.target.value)}
                onFocus={() => searchParams.source && setShowSourceSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
              />
              {showSourceSuggestions && sourceSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {sourceSuggestions.map((station, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectSourceSuggestion(station)}
                    >
                      {station}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                placeholder="Destination station"
                value={searchParams.destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onFocus={() => searchParams.destination && setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {destinationSuggestions.map((station, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectDestinationSuggestion(station)}
                    >
                      {station}
                    </div>
                  ))}
                </div>
              )}
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
