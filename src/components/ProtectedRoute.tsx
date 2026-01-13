import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
/**
 * Properties for the ProtectedRoute component.
 * @property children - The component(s) that should be rendered if the user is authenticated.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}
/**
 * ProtectedRoute Component
 * * Acts as a wrapper for routes that require a logged-in session (e.g., Create Blog).
 * * LOGIC FLOW:
 * 1. LOADING: If Redux is still checking the session, show a full-screen spinner.
 * 2. UNAUTHORIZED: If no user is found after loading, redirect to the /login page.
 * 3. AUTHORIZED: If a user exists, render the 'children' (the actual private page).
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
   // Access global auth state
  const { user, loading } = useSelector((state: RootState) => state.auth);
    /**
   * STEP 1: Wait for Auth initialization.
   * Prevents the app from flicking to the login page before we know if a user exists.
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  /**
   * STEP 2: Gatekeeping.
   * If not logged in, force navigation to Login. 
   * 'replace' ensures the user can't click 'back' to get into the private page.
   */
  if (!user) {
    return <Navigate to="/login" replace />;
  }
   /**
   * STEP 3: Access Granted.
   * Render the protected content.
   */
  return <>{children}</>;
}