import React, { useState } from 'react';
import { Clock, MapPin, Users, Wifi, Coffee, Car } from 'lucide-react';
import TicketBookingForm from './TicketBookingForm';

interface TrainCardProps {
  train: {
    id: string;
    name: string;
    number: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    availableSeats: number;
    amenities: string[];
    image: string;
  };
  onBook: (trainId: string) => void;
}

const TrainCard: React.FC<TrainCardProps> = ({ train, onBook }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'food': return <Coffee className="h-4 w-4" />;
      case 'ac': return <Car className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleBookClick = () => {
    setShowBookingForm(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={train.image}
            alt={train.name}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{train.name}</h3>
              <p className="text-sm text-gray-600">Train #{train.number}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">₹{train.price}</p>
              <p className="text-sm text-gray-600">per person</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-semibold">{train.from}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="font-semibold">{train.to}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Departure</p>
              <p className="font-semibold">{train.departureTime}</p>
            </div>
            <div className="text-center">
              <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-600">{train.duration}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Arrival</p>
              <p className="font-semibold">{train.arrivalTime}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{train.availableSeats} seats left</span>
              </div>
              <div className="flex items-center space-x-2">
                {train.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-1 text-gray-600">
                    {getAmenityIcon(amenity)}
                    <span className="text-xs">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleBookClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainCard;