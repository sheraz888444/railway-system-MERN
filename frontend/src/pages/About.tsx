import React from 'react';
import { motion } from 'framer-motion';
import { 
  Train, 
  Shield, 
  Users, 
  Target, 
  Heart, 
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">About PakRail</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your trusted partner for railway reservations across Pakistan. We are committed to making train travel accessible, convenient, and enjoyable for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To revolutionize railway travel in Pakistan by providing a seamless, digital-first booking experience. We aim to connect every Pakistani to their destination with ease, comfort, and reliability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become Pakistan's leading railway booking platform, known for innovation, customer satisfaction, and our contribution to sustainable transportation across the nation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Customer First', description: 'Every decision we make puts our customers at the center.' },
              { icon: Shield, title: 'Trust & Security', description: 'Your data and transactions are always protected.' },
              { icon: Users, title: 'Community', description: 'Building connections across Pakistan, one journey at a time.' }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Details */}
      <section className="py-20 bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Website Owner</h2>
            <p className="text-xl text-white/90">Meet the person behind PakRail</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold text-white shadow-xl">
                SA
              </div>
              <h3 className="text-2xl font-bold mb-2">Sheraz Ahmed</h3>
              <p className="text-white/80 mb-6">Founder & Developer</p>
              
              <div className="space-y-4">
                <a href="tel:+923267654138" className="flex items-center justify-center space-x-3 text-white/90 hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                  <span>+92 326 7654138</span>
                </a>
                <a href="mailto:itssheraz78618@gmail.com" className="flex items-center justify-center space-x-3 text-white/90 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                  <span>itssheraz78618@gmail.com</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-20 bg-gray-50" id="privacy-policy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
              <div>
                <p className="text-gray-600 mb-4">
                  <strong>Last Updated:</strong> February 2026
                </p>
                <p className="text-gray-600 leading-relaxed">
                  This Privacy Policy describes how PakRail ("we", "us", or "our") collects, uses, and shares information about you when you use our website and services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Name, email address, phone number when you create an account</li>
                  <li>Payment information when you make a booking</li>
                  <li>Travel preferences and booking history</li>
                  <li>Communications with our customer support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Process your bookings and transactions</li>
                  <li>Send you booking confirmations and updates</li>
                  <li>Provide customer support</li>
                  <li>Improve our services and develop new features</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Cookies and Tracking Technologies</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies and similar tracking technologies to collect information about your browsing activities. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
                  <li>Essential cookies required for the website to function</li>
                  <li>Analytics cookies to understand how visitors use our site</li>
                  <li>Advertising cookies to deliver relevant advertisements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Third-Party Advertising</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Google Ads Settings</a>.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Third-party vendors, including Google, use cookies to serve ads based on your visits to this and other websites. You can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">www.aboutads.info</a>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Information Sharing</h3>
                <p className="text-gray-600 leading-relaxed">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
                  <li>Service providers who help us operate our platform</li>
                  <li>Payment processors for transaction processing</li>
                  <li>Law enforcement when required by law</li>
                  <li>Third parties with your consent</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Data Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8. Children's Privacy</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700"><strong>Sheraz Ahmed</strong></p>
                  <p className="text-gray-600">Email: itssheraz78618@gmail.com</p>
                  <p className="text-gray-600">Phone: +92 326 7654138</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
