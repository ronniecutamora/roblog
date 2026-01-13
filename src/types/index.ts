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
 * @property {string} author_id - Foreign key linking to the User who created it.
 * @property {string} created_at - ISO timestamp of when the post was first saved.
 * @property {string} updated_at - ISO timestamp of the last time the post was modified.
 */
export interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
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