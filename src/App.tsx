import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './app/store';
import { checkAuth } from './features/auth/authSlice';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Placeholder components (we'll build these next)
const Home = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="card">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog List</h1>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  </div>
);

const CreateBlog = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="card">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Blog</h1>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;