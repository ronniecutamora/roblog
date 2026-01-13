import { Link } from 'react-router-dom';

/**
 * Properties for the EmptyState component.
 * @property {boolean} isAuthenticated - Flag to determine if the viewer is logged in.
 */
interface EmptyStateProps {
  isAuthenticated: boolean;
}

/**
 * EmptyState Component
 * * * Displayed when the blog list is empty.
 * * FEATURES:
 * - Dynamic Messaging: Changes text based on login status.
 * - Call to Action (CTA): Directs users to either the 'Create' or 'Login' pages.
 * - Clean UI: Uses a card layout.
 */
export default function EmptyState({ isAuthenticated }: EmptyStateProps) {
  return (
    <div className="card text-center py-12">
       {/* VISUAL ANCHOR: A message to fill the visual space */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">No blogs yet</h2>
      {/* DYNAMIC DESCRIPTION: 
          Tailors the message so guests know why they can't create yet. 
      */}
      <p className="text-gray-600 mb-6">
        {isAuthenticated 
          ? 'Be the first to create a blog post!' 
          : 'Login to create your first blog post!'}
      </p>
      {/* DYNAMIC BUTTON (CTA):
          Guides the user to the next logical step in their journey.
      */}
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