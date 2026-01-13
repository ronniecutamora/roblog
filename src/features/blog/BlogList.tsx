import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchBlogs, deleteBlog, setCurrentBlog, clearError } from './blogSlice';
import type { Blog } from '../../types';

// Import child components
import BlogCard from './components/BlogCard';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import ErrorAlert from './components/ErrorAlert';

/**
 * BlogList Component
 * The primary landing page that displays a paginated list of all blog posts.
 */
export default function BlogList() {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Global Blog State
  const { blogs, loading, error, totalPages, currentPage } = useSelector(
    (state: RootState) => state.blog
  );
  /** * Global Auth State
   * Pulled to check if the current viewer is the author of specific posts.
   */
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch blogs on mount
  useEffect(() => {
    dispatch(fetchBlogs(1));
  }, [dispatch]);

  /**
   * Page Change Handler
   * Requests a new page from the server and scrolls the user to the top.
   * @param {number} page - The target page number.
   */
  const handlePageChange = (page: number) => {
    dispatch(fetchBlogs(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  /**
   * Edit Handler
   * Saves the selected blog to the 'currentBlog' state and moves the user to the Edit form.
   * @param {Blog} blog - The blog object to be edited.
   */
  const handleEdit = (blog: Blog) => {
    dispatch(setCurrentBlog(blog));
    navigate('/edit');
  };
  /**
   * Delete Handler
   * Confirms user intent before dispatching a delete request and refreshing the list.
   * @param {string} id - The unique ID of the blog to delete.
   */
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await dispatch(deleteBlog(id));
      dispatch(fetchBlogs(currentPage));
    }
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  // 1. INITIAL LOADING: Only show spinner if we have no blogs and are loading
  if (loading && blogs.length === 0) {
    return <LoadingSpinner message="Loading blogs..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">All Blogs</h1>
        {user && (
          <Link to="/create" className="btn btn-primary">
            + Create New Blog
          </Link>
        )}
      </div>

      {/* Error Message */}
      {error && <ErrorAlert message={error} onDismiss={handleDismissError} />}

      {/* Blog Grid or Empty State */}
      {blogs.length === 0 ? (
        <EmptyState isAuthenticated={!!user} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                isOwner={!!user && user.id === blog.author_id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}