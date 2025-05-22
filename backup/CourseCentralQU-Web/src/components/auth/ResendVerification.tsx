'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isQueensEmail, isValidEmail } from '@/utils/validation';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { resendVerificationEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    if (!isQueensEmail(email)) {
      setStatus('error');
      setMessage('Only @queensu.ca email addresses are allowed');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');
      
      const { error } = await resendVerificationEmail(email);
      
      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }
      
      setStatus('success');
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="mt-6 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        Resend Verification Email
      </h3>
      
      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
          {message}
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Queen's University Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border ${
                isQueensEmail(email) 
                  ? 'border-green-400 focus:ring-green-400 focus:border-green-400' 
                  : 'border-gray-300 focus:ring-[#00305f] focus:border-[#00305f]'
              } rounded-lg transition-colors text-gray-900 bg-white`}
              placeholder="youremail@queensu.ca"
              disabled={status === 'loading'}
              required
            />
            {email && isQueensEmail(email) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading' || !isQueensEmail(email)}
          className={`w-full py-2.5 bg-gradient-to-r from-[#00305f] to-[#00305f]/90 text-white font-medium rounded-lg transition-colors shadow-sm hover:from-[#00305f]/90 hover:to-[#00305f]/80 ${
            (status === 'loading' || !isQueensEmail(email)) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {status === 'loading' ? 'Sending...' : 'Resend Verification Email'}
        </button>
      </form>
    </div>
  );
} 