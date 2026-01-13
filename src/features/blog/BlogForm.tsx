import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { createBlog, updateBlog, clearError } from './blogSlice';

/**
 * Properties for the BlogForm component.
 * @property {'create' | 'edit'} mode - Determines if the form is for a new post or updating an existing one.
 */
interface BlogFormProps {
  mode: 'create' | 'edit';
}

/**
 * BlogForm Component
 * * * A versatile form used to capture blog titles and content.
 * * FEATURES:
 * - Hybrid Mode: Automatically switches labels and logic based on the 'mode' prop.
 * - Prefilling: If in 'edit' mode, it populates fields with existing data from the store.
 * - Validation: Ensures posts meet minimum length requirements before submission.
 * - Async Handling: Waits for Redux thunks to complete before redirecting the user.
 */
export default function BlogForm({ mode }: BlogFormProps) {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  /** * Global Blog State
   * 'currentBlog' is specifically used during 'edit' mode to populate the fields.
   */
  const { currentBlog, loading, error } = useSelector((state: RootState) => state.blog);

  // --- LOCAL FORM STATE ---
  /** @type {string} Stores the draft title */
  const [title, setTitle] = useState('');
  /** @type {string} Stores the draft content body */
  const [content, setContent] = useState('');

  /**
   * EDIT PREFILL EFFECT
   * If the user is editing, we take the data from 'currentBlog' (Redux)
   * and put it into our local 'useState' variables so the user can see it.
   */
  useEffect(() => {
    if (mode === 'edit' && currentBlog) {
      setTitle(currentBlog.title);
      setContent(currentBlog.content);
    }
  }, [mode, currentBlog]);

  /**
   * CLEANUP EFFECT
   * Wipes any existing error messages when the user leaves the form.
   */
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  /**
   * Form Submission Logic
   * * 1. Validates input length.
   * * 2. Triggers either 'create' or 'update' thunks.
   * * 3. Redirects to Home only if the database request is successful.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (title.trim().length < 3) {
      alert('Title must be at least 3 characters!');
      return;
    }

    if (content.trim().length < 10) {
      alert('Content must be at least 10 characters!');
      return;
    }

    if (mode === 'create') {
      const result = await dispatch(createBlog({ title, content }));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    } else if (mode === 'edit' && currentBlog) {
      const result = await dispatch(updateBlog({ id: currentBlog.id, title, content }));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="card">
        {/* DYNAMIC HEADER: Changes text based on mode */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {mode === 'create' ? 'Create New Blog' : 'Edit Blog'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE INPUT */}
          <div>
            <label htmlFor="title" className="label">
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              className="input"
              placeholder="Enter blog title..."
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 3 characters</p>
          </div>
            {/* CONTENT TEXTAREA */}
          <div>
            <label htmlFor="content" className="label">
              Blog Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              rows={12}
              className="input resize-none"
              placeholder="Write your blog content here..."
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </span>
              ) : (
                mode === 'create' ? 'Create Blog' : 'Update Blog'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}