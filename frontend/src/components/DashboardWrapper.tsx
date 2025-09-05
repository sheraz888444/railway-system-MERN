import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { authAPI } from '../services/api';

const DashboardWrapper: React.FC = () => {
  const [userRole, setUserRole] = useState<'admin' | 'passenger' | 'staff' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
          navigate('/');
          return;
        }

        // Try to get user role from localStorage first
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user.role);
          setLoading(false);
          return;
        }

        // Fallback: fetch current user from API
        const currentUser = await authAPI.getCurrentUser();
        setUserRole(currentUser.role);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (err: any) {
        console.error('Authentication error:', err);
        setError(err.response?.data?.message || 'Authentication failed');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Unable to determine user role</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard userRole={userRole} />;
};

export default DashboardWrapper;
