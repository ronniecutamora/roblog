/**
 * User Interface
 * Represents the authenticated user's basic profile data.
 * @property {string} id - The unique UUID from Supabase Auth.
 * @property {string} email - The user's registered email address.
 */
export interface User {
  id: string;
  email: string;
}

/**
 * Blog Interface
 * Defines the structure of a blog post as stored in the Supabase 'blogs' table.
 * @property {string} id - Unique identifier for the post.
 * @property {string} title - The headline of the blog post.
 * @property {string} content - The main body text of the post.
 * @property {string | null} image_url - Optional URL to the blog's featured image stored in Supabase Storage.
 * @property {string} author_id - Foreign key linking to the User who created it.
 * @property {string} created_at - ISO timestamp of when the post was first saved.
 * @property {string} updated_at - ISO timestamp of the last time the post was modified.
 */
export interface Blog {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}
/**
 * Comment Interface
 * Defines the structure of a comment as stored in the Supabase 'comments' table.
 * @property {string} id - Unique identifier for the comment.
 * @property {string} blog_id - Foreign key linking to the parent Blog post.
 * @property {string} author_id - Foreign key linking to the User who wrote the comment.
 * @property {string} content - The text body of the comment.
 * @property {string | null} image_url - Optional URL to an image attached to the comment.
 * @property {string} created_at - ISO timestamp of when the comment was created.
 */
export interface Comment {
  id: string;
  blog_id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

/**
 * CommentState Interface
 * Defines the structure of the Redux slice state for managing comments.
 * @property {Comment[]} comments - Array of comment records currently loaded into the store.
 * @property {boolean} loading - Loading indicator for fetch/create/delete operations.
 * @property {string | null} error - Error message string if an operation fails.
 */
export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}
/**
 * AuthState Interface
 * Shape of the authentication data stored in Redux.
 * @property {User | null} user - The current session user, or null if logged out.
 * @property {boolean} loading - True if an auth request (login/register) is in progress.
 * @property {string | null} error - Error message from the latest auth attempt.
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * BlogState Interface
 * Shape of the blog-related data stored in Redux.
 * @property {Blog[]} blogs - Array of blog posts currently loaded in memory.
 * @property {Blog | null} currentBlog - The specific post being viewed or edited.
 * @property {boolean} loading - True while fetching or saving data to Supabase.
 * @property {string | null} error - Error message from the latest database operation.
 * @property {number} totalPages - Total pages available based on current database count.
 * @property {number} currentPage - The current active page index for pagination.
 */
export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}