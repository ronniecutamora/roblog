import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';

/**
 * Navbar Component
 * The global navigation bar for the application with responsive mobile menu.
 * 
 * @component
 * @description
 * Provides navigation links and user authentication controls.
 * Features a hamburger menu for mobile devices and full horizontal menu for desktop.
 * 
 * @features
 * - Responsive design with mobile hamburger menu
 * - User authentication status display
 * - Dynamic navigation based on auth state
 * - Smooth transitions and animations
 * - Auto-close menu on navigation
 * 
 * @returns {JSX.Element} Rendered navigation bar
 */
export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Handle Logout
   * Dispatches logout action and closes mobile menu.
   */
  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  /**
   * Close Mobile Menu
   * Closes the mobile navigation menu.
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Toggle Mobile Menu
   * Toggles the mobile navigation menu open/closed.
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            className="text-2xl font-bold hover:text-gray-200 transition-colors"
          >
            Roblog
          </Link>

          {/* Desktop Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex gap-6 items-center">
            {user ? (
              <>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full truncate max-w-[200px]">
                  {user.email}
                </span>
                <Link 
                  to="/create" 
                  className="hover:text-gray-200 transition-colors font-medium whitespace-nowrap"
                >
                  Create Blog
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-gray-200 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Shown on Mobile Only */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              // Close Icon (X)
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            ) : (
              // Hamburger Icon (Three Lines)
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Shown when hamburger is clicked */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 animate-slideDown">
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  {/* User Email Badge */}
                  <div className="text-sm bg-white/20 px-3 py-2 rounded-lg truncate">
                    {user.email}
                  </div>
                  
                  {/* Create Blog Link */}
                  <Link 
                    to="/create"
                    onClick={closeMobileMenu}
                    className="hover:bg-white/10 px-3 py-2 rounded-lg transition-colors font-medium text-left"
                  >
                    Create Blog
                  </Link>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login Link */}
                  <Link 
                    to="/login"
                    onClick={closeMobileMenu}
                    className="hover:bg-white/10 px-3 py-2 rounded-lg transition-colors font-medium text-left"
                  >
                    Login
                  </Link>
                  
                  {/* Register Button */}
                  <Link 
                    to="/register"
                    onClick={closeMobileMenu}
                    className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}