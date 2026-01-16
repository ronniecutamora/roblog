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

// ... imports
// ... initialState

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        
        // FIX: Ignore "AbortError" so it doesn't show as a UI error
        if (action.error.name !== 'AbortError') {
            state.error = action.payload as string;
        }
      })
      // ... keep addComment and removeComment cases the same
      .addCase(thunks.addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(thunks.editComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(thunks.removeComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;