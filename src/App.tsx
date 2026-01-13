import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './app/store';
import { checkAuth } from './features/auth/authSlice';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import BlogList from './features/blog/BlogList';
import BlogForm from './features/blog/BlogForm';
import ViewBlog from './features/blog/ViewBlog';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/*View all blogs with pagination */}
        <Route path="/" element={<BlogList />} />
        {/*View a single blog*/}
        <Route path="/blog/:id" element={<ViewBlog />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <BlogForm mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <BlogForm mode="edit" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;