import React from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const VerificationMessage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Mail className="h-16 w-16 text-blue-600" />
              <CheckCircle className="absolute bottom-0 right-0 h-6 w-6 text-green-500 bg-white rounded-full" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Check Your Inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-lg">
            We have sent a verification email to your inbox. 
            Please check your email and click the verification link to complete your registration.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 text-left">
            <p className="font-semibold mb-1">Didn't receive the email?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure your email address was correct</li>
            </ul>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2"
          >
            Go to Login <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationMessage;
