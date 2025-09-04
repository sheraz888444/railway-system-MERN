import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Train, Clock, MapPin, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppLayout = () => {
  const [user, setUser] = useState(null);
  const [searchForm, setSearchForm] = useState({ from: '', to: '', date: '' });
  const navigate = useNavigate();

  const trains = [
    {
      id: 1, name: 'Rajdhani Express', number: '12001', from: 'New Delhi', to: 'Mumbai',
      departure: '16:55', arrival: '08:35', duration: '15h 40m', price: 2500, seats: 45
    },
    {
      id: 2, name: 'Shatabdi Express', number: '12002', from: 'Chennai', to: 'Bangalore',
      departure: '06:00', arrival: '11:00', duration: '5h 00m', price: 800, seats: 23
    },
    {
      id: 3, name: 'Duronto Express', number: '12259', from: 'Howrah', to: 'New Delhi',
      departure: '14:05', arrival: '10:35', duration: '20h 30m', price: 1800, seats: 67
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Train className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">RailReserve</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                  <Button onClick={() => navigate('/signup')}>Sign Up</Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Welcome, {user.name}</span>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68b90ef1a62623d1cd1232d8_1756959128815_b870b709.webp" 
            alt="Railway Station" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Train Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Fast, reliable, and convenient railway reservations
          </p>
          
          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <Input 
                    placeholder="Departure city" 
                    value={searchForm.from}
                    onChange={(e) => setSearchForm({...searchForm, from: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <Input 
                    placeholder="Destination city" 
                    value={searchForm.to}
                    onChange={(e) => setSearchForm({...searchForm, to: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input 
                    type="date" 
                    value={searchForm.date}
                    onChange={(e) => setSearchForm({...searchForm, date: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Search Trains</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Train Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Available Trains</h3>
          <div className="space-y-4">
            {trains.map((train) => (
              <Card key={train.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{train.name}</h4>
                          <p className="text-gray-600">#{train.number}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          <Users className="h-3 w-3 mr-1" />
                          {train.seats} seats
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{train.from}</p>
                            <p className="text-sm text-gray-600">{train.departure}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div className="text-center">
                            <p className="font-medium">{train.duration}</p>
                            <p className="text-sm text-gray-600">Journey time</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{train.to}</p>
                            <p className="text-sm text-gray-600">{train.arrival}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <p className="text-2xl font-bold text-blue-600">₹{train.price}</p>
                      <Button className="mt-2">Book Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose RailReserve?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Train className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Easy Booking</h4>
              <p className="text-gray-600">Simple and quick train ticket booking process</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-gray-600">Competitive pricing with no hidden charges</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Train className="h-6 w-6" />
                <span className="font-bold">RailReserve</span>
              </div>
              <p className="text-gray-400">Your trusted railway booking partner</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Train Booking</li>
                <li>PNR Status</li>
                <li>Live Train Status</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Refund Policy</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <p className="text-gray-400">Email: support@railreserve.com</p>
              <p className="text-gray-400">Phone: 1800-123-4567</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;