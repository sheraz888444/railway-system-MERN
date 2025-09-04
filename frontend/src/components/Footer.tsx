import React from 'react';
import { Train, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Train className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">RailReserve</span>
            </div>
            <p className="text-gray-300 mb-6">
              Your trusted partner for seamless railway reservations across the country. 
              Book tickets, track trains, and travel with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Book Tickets</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Train Schedule</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">PNR Status</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Seat Availability</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fare Enquiry</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Station Info</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mobile App</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Travel Insurance</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Group Booking</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tatkal Booking</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">E-Catering</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Retiring Rooms</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">Rail Bhavan, Raisina Road</p>
                  <p className="text-gray-300">New Delhi - 110001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">+91-11-2338-5050</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">support@railreserve.in</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">24/7 Helpline</h4>
              <p className="text-2xl font-bold text-blue-400">139</p>
              <p className="text-xs text-gray-400">Toll-free from any phone</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Refund Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Accessibility</a>
            </div>
            <div className="text-sm text-gray-400">
              <p>&copy; 2024 RailReserve. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;