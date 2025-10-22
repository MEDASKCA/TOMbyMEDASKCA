'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthenticated(true);
        // Wait for animation to complete before redirecting
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(data.message || 'Invalid username. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      backgroundColor: '#0b0d10',
      fontFamily: 'Manrope, system-ui, -apple-system, sans-serif'
    }}>
      <style jsx>{`
        @keyframes logoSpinOnce {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .spin-once {
          animation: logoSpinOnce 1s ease-in-out;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="rounded-2xl p-8" style={{
          background: 'rgba(255,255,255,.02)',
          border: '1px solid #1e2430',
          boxShadow: '0 14px 30px rgba(0,0,0,.45)'
        }}>
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${authenticated ? 'spin-once' : ''}`} style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
              boxShadow: '0 10px 24px rgba(20,184,166,.25), 0 8px 22px rgba(59,130,246,.18)',
              padding: '8px'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: '#0b0d10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px'
              }}>
                <Image
                  src="/medaskca-logo.png"
                  alt="MEDASKCA Logo"
                  width={80}
                  height={80}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{
              color: '#eaf0f6',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}>
              <span className="font-bold">TOM</span> by <span className="font-bold">MEDASKCA™</span>
            </h1>
            <p className="text-sm" style={{ color: '#b9c4d2' }}>Theatre Operations Manager</p>
            <p className="text-xs italic mt-1" style={{ color: '#b9c4d2', opacity: 0.8 }}>Demo for NHS Clinical Entrepreneur Programme</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <p className="text-sm text-center" style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2" style={{
                color: '#eaf0f6',
                fontWeight: 600
              }}>
                Select Demo User
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5" style={{ color: '#b9c4d2' }} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 rounded-lg transition-all duration-150"
                  style={{
                    background: '#0e1116',
                    border: '1px solid #1e2430',
                    color: '#eaf0f6',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#1e2430'}
                  placeholder="Enter username (demo, admin, or theatremanager)"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3 px-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
                color: '#061018',
                fontWeight: 800,
                boxShadow: '0 10px 24px rgba(20,184,166,.25), 0 8px 22px rgba(59,130,246,.18)',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(20,184,166,.3), 0 10px 26px rgba(59,130,246,.22)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(20,184,166,.25), 0 8px 22px rgba(59,130,246,.18)';
              }}
            >
              {loading ? 'Authenticating...' : 'Access Demo'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid #1e2430' }}>
            <p className="text-xs font-medium mb-3 text-center" style={{
              color: '#eaf0f6',
              fontWeight: 600
            }}>Available Demo Users:</p>
            <div className="space-y-2 text-xs" style={{ color: '#b9c4d2' }}>
              <div className="p-3 rounded-lg" style={{
                background: 'rgba(255,255,255,.02)',
                border: '1px solid #1e2430'
              }}>
                <p className="font-medium" style={{ color: '#eaf0f6', fontWeight: 600 }}>Viewer Access</p>
                <p>Username: <span className="font-mono px-2 py-1 rounded" style={{
                  background: '#0e1116',
                  color: '#14b8a6'
                }}>demo</span></p>
              </div>
              <div className="p-3 rounded-lg" style={{
                background: 'rgba(255,255,255,.02)',
                border: '1px solid #1e2430'
              }}>
                <p className="font-medium" style={{ color: '#eaf0f6', fontWeight: 600 }}>Admin Access</p>
                <p>Username: <span className="font-mono px-2 py-1 rounded" style={{
                  background: '#0e1116',
                  color: '#14b8a6'
                }}>admin</span></p>
              </div>
              <div className="p-3 rounded-lg" style={{
                background: 'rgba(255,255,255,.02)',
                border: '1px solid #1e2430'
              }}>
                <p className="font-medium" style={{ color: '#eaf0f6', fontWeight: 600 }}>Manager Access</p>
                <p>Username: <span className="font-mono px-2 py-1 rounded" style={{
                  background: '#0e1116',
                  color: '#14b8a6'
                }}>theatremanager</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{
          color: '#b9c4d2',
          opacity: 0.8
        }}>
          Demo access to Theatre Operations Manager
        </p>
      </div>
    </div>
  );
}
