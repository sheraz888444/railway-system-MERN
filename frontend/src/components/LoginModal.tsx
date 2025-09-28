import React, { useState } from 'react';
import { X, User, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedInput from './AnimatedInput';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; role: 'admin' | 'passenger' | 'staff' }) => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'passenger' as 'admin' | 'passenger' | 'staff'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    onLogin({
      name: formData.name || formData.email.split('@')[0],
      role: formData.role
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {isSignup ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {isSignup ? 'Join our railway community' : 'Sign in to your account'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <motion.form
                variants={formContainerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {isSignup && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <AnimatedInput
                      icon={<User />}
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <AnimatedInput
                    icon={<Mail />}
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <AnimatedInput
                    icon={<Lock />}
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                </div>

                {isSignup && (
                  <motion.div variants={formContainerVariants} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                    >
                      <option value="passenger">🚶 Passenger</option>
                      <option value="staff">👨‍💼 Staff</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </motion.div>
                )}

                <motion.button
                  variants={formContainerVariants}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSignup ? '🚀 Create Account' : '✨ Sign In'}
                </motion.button>
              </motion.form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="ml-1 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {isSignup ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;