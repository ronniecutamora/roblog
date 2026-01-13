import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { register, clearError } from './authSlice';
import ErrorAlert from '../blog/components/ErrorAlert';

/**
 * Register Component
 * * * Handles new user account creation.
 * * FEATURES:
 * - Client-side validation (password matching and length).
 * - Synchronization with Redux auth state.
 * - Automatic redirect upon successful account creation.
 * - Cleanup logic to prevent error messages from "bleeding" into other pages.
 */
export default function Register() {
  // --- LOCAL STATE ---
  /** @type {string} User email input */
  const [email, setEmail] = useState('');
  /** @type {string} Primary password input */
  const [password, setPassword] = useState('');
  /** @type {string} Second password input for verification */
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  /** * Global Auth State
   * Listening for 'user' to handle successful registration 
   * and 'loading' to manage the UI button state.
   */
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  /**
   * SUCCESS REDIRECT
   * If the register thunk succeeds and a user object is created,
   * push the user to the homepage.
   */
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  /**
   * ERROR CLEANUP
   * Removes any authentication error messages from the global state
   * when the user navigates away from the Registration page.
   */
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  /**
   * Form Submission & Validation Logic
   * Checks for password integrity before attempting a network request.
   * @param {React.FormEvent} e - Form event object.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    dispatch(register({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Roblog today!</p>
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
              minLength={6}
              className="input"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
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
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="link font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}