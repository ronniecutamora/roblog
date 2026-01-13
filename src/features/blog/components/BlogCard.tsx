import type { Blog } from '../../../types';
/**
 * Properties for the BlogCard component.
 * @property {Blog} blog - The blog post object to display.
 * @property {boolean} isOwner - Determines if the current user has permission to edit/delete this post.
 * @property {Function} onEdit - Callback function triggered when the Edit button is clicked.
 * @property {Function} onDelete - Callback function triggered when the Delete button is clicked.
 */
interface BlogCardProps {
  blog: Blog;
  isOwner: boolean;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

/**
 * BlogCard Component
 * * * Displays a summary of a blog post in a card format.
 * * FEATURES:
 * - Line-clamping for titles and content (prevents cards from getting too long).
 * - Human-readable date formatting.
 * - Conditional rendering of management buttons (Edit/Delete).
 */
export default function BlogCard({ blog, isOwner, onEdit, onDelete }: BlogCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* TITLE: Using 'line-clamp-2' to keep the height consistent */}
      <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
        {blog.title}
      </h2>
      {/* CONTENT PREVIEW: Show a short snippet of the post */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {blog.content}
      </p>
      {/* DATE: Formatted for local US standards (e.g., January 1, 2026) */}
      <div className="text-sm text-gray-500 mb-4">
        {new Date(blog.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      
      {/* ACTION BUTTONS:
        Only displayed if 'isOwner' is true. 
        Note that we pass data back UP to the parent component using the callback functions.
      */}
      {isOwner && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(blog)}
            className="btn btn-primary flex-1"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(blog.id)}
            className="btn btn-danger flex-1"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}