import { Link } from 'react-router-dom';
import type { Blog } from '../../../types';

interface BlogCardProps {
  blog: Blog;
  isOwner: boolean;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

export default function BlogCard({ blog, isOwner, onEdit, onDelete }: BlogCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Make title and content clickable */}
      <Link to={`/blog/${blog.id}`} className="flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          {blog.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content}
        </p>
      </Link>
      
      <div className="text-sm text-gray-500 mb-4">
        {new Date(blog.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      {/* Read More Button - Always visible */}
      <Link 
        to={`/blog/${blog.id}`}
        className="btn btn-outline mb-4"
      >
        Read More
      </Link>
      
      {/* Action Buttons - Only show if user owns the blog */}
      {isOwner && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(blog);
            }}
            className="btn btn-primary flex-1"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(blog.id);
            }}
            className="btn btn-danger flex-1"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}