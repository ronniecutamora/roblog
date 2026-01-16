import { Link } from 'react-router-dom';
import { useBlogList } from './useBlogList';
// Child components
import BlogCard from './components/BlogCard';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import ErrorAlert from './components/ErrorAlert';

/**
 * BlogList Component
 * The primary landing page that displays a paginated list of all blog posts.
 * Uses the useBlogList hook for logic and state.
 */
export default function BlogList() {
  const {
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
  } = useBlogList();

  // Initial loading state: show spinner when we have no data and are fetching
  if (loading && blogs.length === 0) {
    return <LoadingSpinner message="Loading blogs..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">All Blogs</h1>
        {user && (
          <Link to="/create" className="btn btn-primary">
            + Create New Blog
          </Link>
        )}
      </div>

      {/* Error Feedback */}
      {error && <ErrorAlert message={error} onDismiss={handleDismissError} />}

      {/* Blog Content Logic */}
      {blogs.length === 0 ? (
        <EmptyState isAuthenticated={!!user} />
      ) : (
        <>
          {/* Responsive Blog Grid */}
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

          {/* Navigation Controls */}
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