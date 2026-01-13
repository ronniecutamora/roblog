import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { login, clearError } from './authSlice';
import ErrorAlert from '../blog/components/ErrorAlert';

/**
 * Login Component
 * * * Provides a form for users to authenticate using email and password.
 * * FEATURES:
 * - Local state management for form inputs.
 * - Automatic redirect to home page if user is already logged in.
 * - Error cleanup on component unmount (leaving the page).
 * - Visual loading states and error messaging.
 */
export default function Login() {
  // --- LOCAL STATE ---
  /** @type {string} Current value of the email input field */
  const [email, setEmail] = useState('');
  /** @type {string} Current value of the password input field */
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  /** * Global Auth State
   * Pull 'user' to check if logged in, 'loading' for the button spinner, 
   * and 'error' to show feedback if login fails.
   */
  const { user, loading, error } = useSelector((state: RootState) => state.auth);


  /**
   * REDIRECT EFFECT
   * Watches the 'user' state. If a user exists (successfully logged in),
   * they are automatically moved to the home page.
   */
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  /**
   * CLEANUP EFFECT
   * It clears any leftover error messages in Redux so they don't appear elsewhere.
   */
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

   /**
   * Form Submission Handler
   * Prevents browser refresh and triggers the login thunk.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to continue to Roblog</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && <ErrorAlert message={error} />}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="link font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}