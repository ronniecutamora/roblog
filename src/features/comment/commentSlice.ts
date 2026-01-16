import { createSlice } from '@reduxjs/toolkit';
import type { CommentState } from '../../types';
import * as thunks from './commentThunks';

// Re-export thunks so they can be imported from the slice file
export * from './commentThunks';

/**
 * Initial state for the comment slice.
 */
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

/**
 * Comment Slice
 * Manages the state for the comments feature, including fetching, adding, and removing.
 */
const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    /** * Resets the comment state. 
     * Call this when navigating away from a blog to prevent stale data.
     */
    clearComments: (state) => {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lifecycle
      .addCase(thunks.fetchComments.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(thunks.fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(thunks.fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Lifecycle
      .addCase(thunks.addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      // Remove Lifecycle
      .addCase(thunks.removeComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;