import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BlogState, Blog } from '../../types';
import * as thunks from './blogThunks';

// We re-export everything from thunks so components can still import them from here
export * from './blogThunks';

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

/**
 * Redux Slice for managing the Blog feature state.
 */
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setCurrentBlog: (state, action: PayloadAction<Blog | null>) => {
      state.currentBlog = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: BlogState) => {
      state.loading = true;
      state.error = null;
    };
    
    const handleRejected = (state: BlogState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      // Fetch
      .addCase(thunks.fetchBlogs.pending, handlePending)
      .addCase(thunks.fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(thunks.fetchBlogs.rejected, handleRejected)
      
      // Create
      .addCase(thunks.createBlog.pending, handlePending)
      .addCase(thunks.createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(thunks.createBlog.rejected, handleRejected)

      // Update
      .addCase(thunks.updateBlog.pending, handlePending)
      .addCase(thunks.updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.currentBlog = null;
      })
      .addCase(thunks.updateBlog.rejected, handleRejected)

      // Delete
      .addCase(thunks.deleteBlog.pending, handlePending)
      .addCase(thunks.deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      })
      .addCase(thunks.deleteBlog.rejected, handleRejected);
  },
});

export const { setCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;