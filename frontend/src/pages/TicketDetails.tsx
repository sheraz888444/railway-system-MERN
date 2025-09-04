import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Printer, Download, ArrowLeft, Train, MapPin, Clock, Users } from 'lucide-react';
import { bookingsAPI } from '@/services/api';
import jsPDF from 'jspdf';

interface Booking {
  _id: string;
  bookingId: string;
  pnr: string;
  userId: string;
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

const TicketDetails: React.FC = () => {
  const { pnr } = useParams<{ pnr: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!pnr) return;

      try {
        setLoading(true);
        const data = await bookingsAPI.getBookingByPNR(pnr);
        setBooking(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [pnr]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!booking) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Railway Ticket', 105, 20, { align: 'center' });

    // PNR and Booking ID
    doc.setFontSize(12);
    doc.text(`PNR: ${booking.pnr}`, 20, 40);
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 50);

    // Train Details
    doc.setFontSize(14);
    doc.text('Train Details:', 20, 70);
    doc.setFontSize(12);
    doc.text(`Train: ${booking.trainId.trainName} (${booking.trainId.trainNumber})`, 20, 80);
    doc.text(`From: ${booking.trainId.source} (${booking.trainId.departureTime})`, 20, 90);
    doc.text(`To: ${booking.trainId.destination} (${booking.trainId.arrivalTime})`, 20, 100);
    doc.text(`Journey Date: ${new Date(booking.journeyDate).toLocaleDateString()}`, 20, 110);

    // Passengers
    doc.setFontSize(14);
    doc.text('Passengers:', 20, 130);
    let yPos = 140;
    booking.passengers.forEach((passenger, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${passenger.name} (${passenger.age} ${passenger.gender})`, 20, yPos);
      doc.text(`   Seat: ${passenger.seatNumber} (${passenger.seatClass})`, 20, yPos + 10);
      yPos += 20;
    });

    // Total Amount
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${booking.totalAmount}`, 20, yPos + 10);

    // Status
    doc.text(`Booking Status: ${booking.bookingStatus}`, 20, yPos + 20);
    doc.text(`Payment Status: ${booking.paymentStatus}`, 20, yPos + 30);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing our railway service!', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`ticket-${booking.pnr}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Booking not found'}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Ticket Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Train className="h-6 w-6" />
                <CardTitle className="text-xl">Railway Ticket</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-white text-blue-600">
                {booking.bookingStatus}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* PNR and Booking ID */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-sm font-medium text-gray-600">PNR Number</Label>
                <p className="text-lg font-bold text-blue-600">{booking.pnr}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Booking ID</Label>
                <p className="text-lg font-bold">{booking.bookingId}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Train Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Train className="h-5 w-5 mr-2" />
                Train Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-lg">{booking.trainId.trainName}</p>
                    <p className="text-gray-600">#{booking.trainId.trainNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Journey Date</p>
                    <p className="font-medium">{new Date(booking.journeyDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{booking.trainId.source}</p>
                      <p className="text-sm text-gray-600">{booking.trainId.departureTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">Journey Time</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{booking.trainId.destination}</p>
                      <p className="text-sm text-gray-600">{booking.trainId.arrivalTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Passengers */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Passenger Details
              </h3>
              <div className="space-y-3">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          Age: {passenger.age} | Gender: {passenger.gender}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{passenger.seatNumber}</p>
                        <p className="text-sm text-gray-600">{passenger.seatClass}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Booking Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{booking.totalAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Booking Date */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Booked on {new Date(booking.createdAt).toLocaleDateString()} at{' '}
              {new Date(booking.createdAt).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDetails;
