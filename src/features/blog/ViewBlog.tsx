import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { setCurrentBlog, deleteBlog } from './blogSlice';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * ViewBlog Component
 * Displays the full content of a single blog post. 
*/
export default function ViewBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  /** * Global State
   * We pull 'blogs' to see if we already have the data in memory.
   */
  const { blogs, currentBlog } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Find blog from the list or use currentBlog
    const blog = blogs.find(b => b.id === id) || currentBlog;
    
    if (blog && blog.id === id) {
      dispatch(setCurrentBlog(blog));
    } else if (!blog) {
      // Blog not found in list, redirect to home
      navigate('/');
    }
  }, [id, blogs, currentBlog, dispatch, navigate]);

  const handleEdit = () => {
    navigate('/edit');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      if (id) {
        await dispatch(deleteBlog(id));
        navigate('/');
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (!currentBlog) {
    return <LoadingSpinner message="Loading blog..." />;
  }

  const isOwner = user && user.id === currentBlog.author_id;
  const createdDate = new Date(currentBlog.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = new Date(currentBlog.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const wasEdited = currentBlog.created_at !== currentBlog.updated_at;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Blog Content Card */}
        <article className="card">
          {/* Header */}
          <header className="mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {currentBlog.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{createdDate}</span>
              </div>
              
              {wasEdited && (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edited {updatedDate}</span>
                </div>
              )}
            </div>
          </header>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {currentBlog.content}
            </p>
          </div>

          {/* Action Buttons - Only for Owner */}
          {isOwner && (
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleEdit}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Blog
                </button>
                
                <button
                  onClick={handleDelete}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Blog
                </button>
              </div>
            </div>
          )}

          {/* Back to Home Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              to="/"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to All Blogs
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}