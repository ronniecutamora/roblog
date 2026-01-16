import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { 
  fetchBlogs, 
  deleteBlog, 
  setCurrentBlog, 
  clearError 
} from './blogSlice'; // Thunks are re-exported from here
import type { Blog } from '../../types';

/**
 * Custom hook to manage the logic for the BlogList component.
 * Separates business logic and Redux interactions from the UI.
 */
export function useBlogList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Global State
  const { blogs, loading, error, totalPages, currentPage } = useSelector(
    (state: RootState) => state.blog
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchBlogs(1));
  }, [dispatch]);

  /**
   * Navigates to a specific page of blogs and scrolls to top.
   */
  const handlePageChange = (page: number) => {
    dispatch(fetchBlogs(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Prepares a blog for editing and navigates to the edit screen.
   */
  const handleEdit = (blog: Blog) => {
    dispatch(setCurrentBlog(blog));
    navigate('/edit');
  };

  /**
   * Confirms and triggers blog deletion.
   * NOTE: We removed the manual 'deleteImage' call because our 
   * deleteBlog thunk now handles cleanup automatically.
   */
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await dispatch(deleteBlog(id));
      // Refresh the current page to update the list
      dispatch(fetchBlogs(currentPage));
    }
  };

  /** Clears global error messages */
  const handleDismissError = () => {
    dispatch(clearError());
  };

  return {
    blogs,
    loading,
    error,
    totalPages,
    currentPage,
    user,
    handlePageChange,
    handleEdit,
    handleDelete,
    handleDismissError,
  };
}