import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Minus } from 'lucide-react';
import { bookingsAPI, trainsAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const passengerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  gender: z.enum(['male', 'female', 'other']),
  seatClass: z.enum(['1A', '2A', '3A', 'SL', 'CC', '2S']),
  seatNumber: z.string().min(1, 'Seat number is required'),
});

const bookingSchema = z.object({
  trainId: z.string(),
  journeyDate: z.string().min(1, 'Journey date is required'),
  passengers: z.array(passengerSchema).min(1, 'At least one passenger is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface TicketBookingFormProps {
  train: {
    id: string;
    name?: string;
    number?: string;
    trainName?: string;
    trainNumber?: string;
    from?: string;
    to?: string;
    source?: string;
    destination?: string;
    departureTime: string;
    arrivalTime: string;
    price?: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const TicketBookingForm: React.FC<TicketBookingFormProps> = ({ train, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      trainId: train.id || '',
      journeyDate: '',
      passengers: [{
        name: '',
        age: 0,
        gender: 'male',
        seatClass: 'SL',
        seatNumber: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'passengers',
  });

  useEffect(() => {
    if (isOpen && train.id) {
      const fetchAvailableSeats = async () => {
        try {
          const response = await trainsAPI.getAvailableSeats(train.id);
          setAvailableSeats(response.availableSeats || []);
        } catch (err) {
          console.error('Failed to fetch available seats:', err);
        }
      };
      fetchAvailableSeats();
    }
  }, [isOpen, train.id]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate seat availability
      for (const passenger of data.passengers) {
        const isSeatAvailable = availableSeats.some(seat => seat.seatNumber === passenger.seatNumber);
        if (!isSeatAvailable) {
          setError(`Seat ${passenger.seatNumber} is not available. Please select an available seat.`);
          setLoading(false);
          return;
        }
      }

      // Fix: Use train._id if available for booking
      const trainIdToUse = (data.trainId && data.trainId.length === 24) ? data.trainId : (train.id || '');

      const bookingData = {
        trainId: trainIdToUse,
        passengers: data.passengers.map(p => ({
          name: p.name,
          age: p.age,
          gender: p.gender,
          seatNumber: p.seatNumber,
          seatClass: p.seatClass,
        })),
        journeyDate: data.journeyDate,
      };

      const response = await bookingsAPI.createBooking(bookingData);

      // Show success toast
      toast.success('Ticket booked successfully!', {
        description: `Your PNR is ${response.pnr}. Redirecting to ticket details...`,
      });

      // Navigate to ticket details page
      navigate(`/ticket/${response.pnr}`);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const addPassenger = () => {
    append({
      name: '',
      age: 0,
      gender: 'male',
      seatClass: 'SL',
      seatNumber: '',
    });
  };

  const removePassenger = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Ticket - {train.trainName || train.name} ({train.trainNumber || train.number})</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Train Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Train Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <p className="font-medium">{train.source || train.from}</p>
                  <p className="text-sm text-gray-600">{train.departureTime}</p>
                </div>
                <div>
                  <Label>To</Label>
                  <p className="font-medium">{train.destination || train.to}</p>
                  <p className="text-sm text-gray-600">{train.arrivalTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Journey Date */}
            <div>
              <Label htmlFor="journeyDate">Journey Date</Label>
              <Input
                id="journeyDate"
                type="date"
                {...register('journeyDate')}
                className={errors.journeyDate ? 'border-red-500' : ''}
              />
              {errors.journeyDate && (
                <p className="text-red-500 text-sm mt-1">{errors.journeyDate.message}</p>
              )}
            </div>

            {/* Passengers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">Passenger Details</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPassenger}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Passenger</span>
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Passenger {index + 1}</CardTitle>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePassenger(index)}
                          className="flex items-center space-x-2"
                        >
                          <Minus className="h-4 w-4" />
                          <span>Remove</span>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`passengers.${index}.name`}>Name</Label>
                        <Input
                          id={`passengers.${index}.name`}
                          {...register(`passengers.${index}.name`)}
                          className={errors.passengers?.[index]?.name ? 'border-red-500' : ''}
                        />
                        {errors.passengers?.[index]?.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passengers[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`passengers.${index}.age`}>Age</Label>
                        <Input
                          id={`passengers.${index}.age`}
                          type="number"
                          {...register(`passengers.${index}.age`, { valueAsNumber: true })}
                          className={errors.passengers?.[index]?.age ? 'border-red-500' : ''}
                        />
                        {errors.passengers?.[index]?.age && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passengers[index]?.age?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`passengers.${index}.gender`}>Gender</Label>
                        <Select
                          value={watch(`passengers.${index}.gender`)}
                          onValueChange={(value) => setValue(`passengers.${index}.gender`, value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.passengers?.[index]?.gender && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passengers[index]?.gender?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`passengers.${index}.seatClass`}>Seat Class</Label>
                        <Select
                          value={watch(`passengers.${index}.seatClass`)}
                          onValueChange={(value) => setValue(`passengers.${index}.seatClass`, value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1A">1A - First AC</SelectItem>
                            <SelectItem value="2A">2A - Second AC</SelectItem>
                            <SelectItem value="3A">3A - Third AC</SelectItem>
                            <SelectItem value="SL">SL - Sleeper</SelectItem>
                            <SelectItem value="CC">CC - Chair Car</SelectItem>
                            <SelectItem value="2S">2S - Second Sitting</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.passengers?.[index]?.seatClass && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passengers[index]?.seatClass?.message}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`passengers.${index}.seatNumber`}>Seat Number</Label>
                        <Select
                          value={watch(`passengers.${index}.seatNumber`)}
                          onValueChange={(value) => setValue(`passengers.${index}.seatNumber`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select available seat" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSeats.map((seat) => (
                              <SelectItem key={seat.seatNumber} value={seat.seatNumber}>
                                {seat.seatNumber} - {seat.class} - ₹{seat.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.passengers?.[index]?.seatNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.passengers[index]?.seatNumber?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Booking...' : 'Book Ticket'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketBookingForm;
