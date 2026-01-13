import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold hover:text-gray-200 transition-colors"
          >
            Roblog
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6 items-center">
            {user ? (
              <>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {user.email}
                </span>
                <Link 
                  to="/create" 
                  className="hover:text-gray-200 transition-colors font-medium"
                >
                  Create Blog
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
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
        </div>
      </div>
    </nav>
  );
}