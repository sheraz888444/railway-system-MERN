import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Train, MapPin, Clock, Users, X } from 'lucide-react';
import { bookingsAPI } from '@/services/api';

interface Booking {
  _id: string;
  bookingId: string;
  pnr: string;
  trainId: {
    trainName: string;
    trainNumber: string;
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
  };
  passengers: Array<{
    name: string;
    age: number;
    gender: string;
    seatNumber: string;
    seatClass: string;
  }>;
  journeyDate: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface MyBookingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyBookings: React.FC<MyBookingsProps> = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsAPI.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsAPI.cancelBooking(bookingId);
      // Refresh bookings
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Bookings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading && <p className="text-center">Loading bookings...</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <p className="text-center text-gray-600">No bookings found</p>
          )}

          {bookings.map((booking) => (
            <Card key={booking._id} className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {booking.trainId.trainName} ({booking.trainId.trainNumber})
                  </CardTitle>
                  <Badge variant={booking.bookingStatus === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.bookingStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{booking.trainId.source} → {booking.trainId.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{booking.trainId.departureTime} - {booking.trainId.arrivalTime}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Passengers
                  </h4>
                  <div className="space-y-1">
                    {booking.passengers.map((passenger, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {passenger.name} ({passenger.age} {passenger.gender}) - {passenger.seatNumber} ({passenger.seatClass})
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Journey Date</p>
                    <p className="font-medium">{new Date(booking.journeyDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-bold text-lg">₹{booking.totalAmount}</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {booking.bookingStatus === 'confirmed' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyBookings;
