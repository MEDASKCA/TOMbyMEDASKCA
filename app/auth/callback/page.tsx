'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMsalInstance } from '@/lib/teamsAuth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const msalInstance = getMsalInstance();
        if (!msalInstance) {
          setStatus('error');
          setMessage('Authentication service not available');
          return;
        }

        // Handle redirect response
        const response = await msalInstance.handleRedirectPromise();

        if (response) {
          // Authentication successful
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Redirect to home page after 1 second
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          // No response - might be initial load
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            setStatus('success');
            setMessage('Already authenticated! Redirecting...');
            setTimeout(() => {
              router.push('/');
            }, 1000);
          } else {
            setStatus('error');
            setMessage('No authentication response received');
          }
        }
      } catch (error) {
        console.error('Authentication callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center">
          {/* Icon based on status */}
          {status === 'loading' && (
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          )}

          {/* Status message */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {status === 'loading' && 'Authenticating'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Error'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{message}</p>

          {/* Back button for errors */}
          {status === 'error' && (
            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all shadow-lg"
            >
              Return Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
