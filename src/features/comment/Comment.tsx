import React from 'react';
import { useComments } from './useComments';

/**
 * Comments Component
 * Displays a list of comments, a creation form, and handles edit mode.
 * Styled to match the ViewBlog component.
 * * @component
 * @param {Object} props
 * @param {string} props.blogId - The unique ID of the blog post being viewed.
 */
export default function Comments({ blogId }: { blogId: string }) {
  const {
    // Destructuring logic from the hook
    comments, loading, error, user,
    newContent, setNewContent, previewUrl, isPosting,
    handleImageSelect, handleRemoveImage, handlePost, handleDelete,
    // Edit Mode State & Handlers
    editingId, editContent, setEditContent, editPreviewUrl,
    startEditing, cancelEditing, saveEdit, 
    handleEditImageSelect, handleRemoveEditImage
  } = useComments(blogId);
  
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900">Community Discussion</h2>
      </div>

      {/* Form Section - Matched to Blog Card Styling */}
      {user ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full rounded-lg border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none text-gray-700 bg-gray-50"
            rows={3}
          />

          {previewUrl && (
            <div className="mt-4 relative inline-block">
              <img src={previewUrl} alt="Upload preview" className="max-h-48 rounded-lg shadow-md border border-gray-200" />
              <button 
                onClick={handleRemoveImage} 
                className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Add Image</span>
            </label>

            <button 
              onClick={handlePost} 
              disabled={isPosting} 
              className={`px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all flex items-center gap-2 ${
                isPosting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              }`}
            >
              {isPosting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isPosting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
          {error && <p className="text-sm text-red-500 mt-3 flex items-center gap-1 font-medium"><span>⚠️</span> {error}</p>}
        </div>
      ) : (
        <div className="p-6 bg-indigo-50 text-indigo-700 rounded-xl mb-8 text-center border border-indigo-100 font-medium">
          Please log in to join the conversation.
        </div>
      )}

      {/* Comments Feed */}
      {loading && comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-500 animate-pulse">Loading thoughts...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400">No comments yet. Start the conversation!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-hover hover:shadow-md">
              {/* Display Mode */}
              {editingId !== c.id ? (
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                  
                  {c.image_url && (
                    <div className="mt-4">
                      <img 
                        src={c.image_url} 
                        alt="Comment attachment" 
                        className="max-h-80 rounded-lg border border-gray-100 shadow-sm object-cover" 
                      />
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {new Date(c.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {user?.id === c.author_id && (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => startEditing(c)} 
                          className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id, c.image_url)} 
                          className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edit Comment</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Update your comment..."
                    className="w-full rounded-lg border border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none text-gray-700 bg-gray-50"
                    rows={3}
                  />

                  {editPreviewUrl && (
                    <div className="mt-4 relative inline-block">
                      <img src={editPreviewUrl} alt="Edit preview" className="max-h-48 rounded-lg shadow-md border border-gray-200" />
                      <button 
                        onClick={handleRemoveEditImage} 
                        className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={handleEditImageSelect} />
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Replace Image</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={cancelEditing} 
                        className="px-4 py-2 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => saveEdit(c.image_url)} 
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}