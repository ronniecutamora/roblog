import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BlogState, Blog } from '../../types';
import { supabase } from '../../lib/supabase';

/**
 * Initial state for the blog slice.
 * Tracks the list of blogs, the blog currently being edited,
 * and the status of the last database request.
 */
const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

// --- ASYNC THUNKS (The API Calls) ---

/**
 * fetchBlogs
 * * * Retrieves a paginated list of blogs from Supabase.
 * * ALGORITHM:
 * 1. Calculate 'range' based on page number (e.g., Page 1 is items 0-5).
 * 2. Fetch the total count of blogs for pagination math.
 * 3. Fetch the actual data slice, ordered by newest first.
 */
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const ITEMS_PER_PAGE = 6;
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Get total count
      const { count } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true });

      // Get paginated data
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

      return {
        blogs: data || [],
        totalPages,
        currentPage: page,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * createBlog
 * * * Saves a new post to the database.
 * * NOTE: Requires a logged-in user; author_id is pulled from the active session.
 */
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async ({ title, content }: { title: string; content: string }, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title,
            content,
            author_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * updateBlog
 * * * Modifies an existing blog post by ID.
 */
export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, title, content }: { id: string; title: string; content: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * deleteBlog
 * * * Removes a blog post from the database.
 * * RETURNS: The ID of the deleted blog so we can remove it from local state.
 */
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    /** Sets the blog to be edited (used by BlogForm) */
    setCurrentBlog: (state, action: PayloadAction<Blog | null>) => {
      state.currentBlog = action.payload;
    },
    /** Clears any error messages from the UI */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Blogs
    builder.addCase(fetchBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload.blogs;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    });
    builder.addCase(fetchBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Blog
    builder.addCase(createBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs.unshift(action.payload);
    });
    builder.addCase(createBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Blog
    builder.addCase(updateBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBlog.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
      state.currentBlog = null;
    });
    builder.addCase(updateBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Blog
    builder.addCase(deleteBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
    });
    builder.addCase(deleteBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;