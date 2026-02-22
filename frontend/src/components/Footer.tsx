import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <Train className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold">PakRail</span>
                <p className="text-[10px] sm:text-xs text-gray-400">Pakistan Railways</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Your trusted partner for seamless railway reservations across Pakistan. 
              Book tickets, track trains, and travel with confidence.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/signup" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Book Tickets</Link></li>
              <li><Link to="/login" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Track Train</Link></li>
              <li><Link to="/login" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">PNR Status</Link></li>
              <li><Link to="/login" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">Seat Availability</Link></li>
              <li><Link to="/login" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-gray-300">Pakistan</p>
                </div>
              </div>
              <a href="tel:+923267654138" className="flex items-center space-x-2 sm:space-x-3 hover:text-green-400 transition-colors">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-300">+92 326 7654138</p>
              </a>
              <a href="mailto:itssheraz78618@gmail.com" className="flex items-center space-x-2 sm:space-x-3 hover:text-green-400 transition-colors">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-300 break-all">itssheraz78618@gmail.com</p>
              </a>
            </div>

            <div className="mt-4 sm:mt-6">
              <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Owner</h4>
              <p className="text-base sm:text-lg font-bold text-green-400">Sheraz Ahmed</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Founder & Developer</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              <Link to="/about#privacy-policy" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/about" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 text-center">
              <p>&copy; {new Date().getFullYear()} PakRail. All rights reserved.</p>
              <p className="mt-1">Developed by Sheraz Ahmed</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
