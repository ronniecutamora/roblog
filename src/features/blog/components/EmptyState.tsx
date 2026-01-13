import { Link } from 'react-router-dom';

interface EmptyStateProps {
  isAuthenticated: boolean;
}

export default function EmptyState({ isAuthenticated }: EmptyStateProps) {
  return (
    <div className="card text-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">No blogs yet</h2>
      <p className="text-gray-600 mb-6">
        {isAuthenticated 
          ? 'Be the first to create a blog post!' 
          : 'Login to create your first blog post!'}
      </p>
      {isAuthenticated ? (
        <Link to="/create" className="btn btn-primary">
          Create First Blog
        </Link>
      ) : (
        <Link to="/login" className="btn btn-primary">
          Login to Create
        </Link>
      )}
    </div>
  );
}