'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await signup(email, password, confirmPassword);
      }
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div
        className="max-w-md w-full mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50 transition-all duration-300 hover:shadow-2xl"
        role="region"
        aria-label={mode === 'login' ? 'Login form' : 'Sign up form'}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 animate-fade-in">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-in"
            role="alert"
            aria-label="Error message"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
              aria-label="Email address"
            >
              Email
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white/80 disabled:opacity-50"
                required
                disabled={loading}
                placeholder="Enter your email"
                aria-required="true"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
              aria-label="Password"
            >
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white/80 disabled:opacity-50"
                required
                minLength={6}
                disabled={loading}
                placeholder="Enter your password"
                aria-required="true"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
                aria-label="Confirm password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white/80 disabled:opacity-50"
                  required
                  minLength={6}
                  disabled={loading}
                  placeholder="Confirm your password"
                  aria-required="true"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim() || (mode === 'signup' && !confirmPassword.trim())}
            className="relative group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition-all duration-200 transform hover:scale-105"
            aria-label={mode === 'login' ? 'Login' : 'Sign up'}
          >
            {loading ? (
              <Spinner size="small" className="text-white" />
            ) : (
              mode === 'login' ? 'Login' : 'Sign Up'
            )}
            <span className="absolute hidden group-hover:block -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 animate-fade-in">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <a
                href="/signup"
                className="text-blue-600 hover:underline font-medium transition-colors duration-200"
                aria-label="Navigate to sign up page"
              >
                Sign up here
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-medium transition-colors duration-200"
                aria-label="Navigate to login page"
              >
                Login here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;