import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { createBlog, updateBlog, clearError } from './blogSlice';
import { uploadImage, deleteImage, validateImageFile, createPreviewUrl, revokePreviewUrl } from '../../lib/imageUpload';


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

  // --- GLOBAL STATE ---
  const { currentBlog, loading, error } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);


  // --- LOCAL FORM STATE ---
  /** @type {string} Stores the draft title */
  const [title, setTitle] = useState('');
  /** @type {string} Stores the draft content body */
  const [content, setContent] = useState('');


  // --- LOCAL IMAGE STATE ---
  /** @type {File | null} The actual binary file object chosen from the user's hard drive */
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  /** @type {string | null} A temporary 'Object URL' created by the browser to show the user their photo instantly */
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  /** @type {string | null} The permanent web link to an image already stored in the Supabase cloud (used when editing an old post) */
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  /** @type {string | null} Holds any error messages, like 'File too large' or 'Wrong file type' */
  const [imageError, setImageError] = useState<string | null>(null);
  /** @type {boolean} A 'loading switch' that stays true while the image is traveling to the cloud */
  const [isUploading, setIsUploading] = useState(false);
  /** @type {boolean} A flag to track if the user wants to delete the current image from their post */
  const [removeImage, setRemoveImage] = useState(false);

  /**
   * EDIT PREFILL EFFECT
   */
  useEffect(() => {
    if (mode === 'edit' && currentBlog) {
      setTitle(currentBlog.title);
      setContent(currentBlog.content);
      setExistingImageUrl(currentBlog.image_url);

    }
  }, [mode, currentBlog]);

  /**
   * CLEANUP EFFECT
   * Wipes any remaining erorr messages and remove image preview
   */
  useEffect(() => {
    return () => {
      dispatch(clearError());
      // Cleanup preview URL
      if (imagePreview) {
        revokePreviewUrl(imagePreview);
      }
    };
  }, [dispatch, imagePreview]);

  /**
   * Handles image file selection
   */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    
    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    // Clear previous preview
    if (imagePreview) {
      revokePreviewUrl(imagePreview);
    }

    // Set new image
    setSelectedImage(file);
    setImagePreview(createPreviewUrl(file));
    setRemoveImage(false);
  };

  /**
   * Removes the selected or existing image
   */
  const handleRemoveImage = () => {
    if (imagePreview) {
      revokePreviewUrl(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setRemoveImage(true);
    setImageError(null);
  };

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

    if (!user) {
      alert('You must be logged in to create a blog post');
      return;
    }

    setIsUploading(true);
    let imageUrl: string | null = existingImageUrl;

    try {
      // Handle image upload
      if (selectedImage) {
        // If editing and there's an old image, delete it first
        if (mode === 'edit' && existingImageUrl) {
          await deleteImage(existingImageUrl);
        }
        
        // Upload new image
        imageUrl = await uploadImage(selectedImage, user.id);
      } else if (removeImage && existingImageUrl) {
        // User wants to remove the image
        await deleteImage(existingImageUrl);
        imageUrl = null;
      }
      //Create or update blog
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
    } catch (error: any) {
      setImageError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Determine which image to display
  const displayImage = imagePreview || (!removeImage ? existingImageUrl : null);

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

           {/* IMAGE UPLOAD */}
          <div>
            <label htmlFor="image" className="label">
              Featured Image (Optional)
            </label>
            
            {/* Image Preview */}
            {displayImage && (
              <div className="mb-4 relative">
                <img
                  src={displayImage}
                  alt="Blog preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* File Input */}
            {!displayImage && (
              <div className="mt-2">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP or GIF (MAX. 5MB)</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>
            )}

            {imageError && (
              <p className="text-sm text-red-600 mt-2">{imageError}</p>
            )}
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