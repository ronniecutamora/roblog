import { createAsyncThunk } from '@reduxjs/toolkit';
import { commentService } from './commentService';

/**
 * Thunk to fetch comments for a specific blog post.
 * @param {string} blogId - The ID of the blog to fetch comments for.
 */
export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async (blogId: string, { rejectWithValue }) => {
    try {
      return await commentService.fetchComments(blogId);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Thunk to add a new comment.
 * @param {object} payload - The comment data including optional file.
 */
export const addComment = createAsyncThunk(
  'comment/addComment',
  async ({ blogId, authorId, content, file }: { blogId: string; authorId: string; content: string; file: File | null }, { rejectWithValue }) => {
    try {
      return await commentService.createComment(blogId, authorId, content, file);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Thunk to remove a comment.
 * @param {object} payload - The ID and image URL of the comment to delete.
 */
export const removeComment = createAsyncThunk(
  'comment/removeComment',
  async ({ id, imageUrl }: { id: string; imageUrl?: string | null }, { rejectWithValue }) => {
    try {
      return await commentService.deleteComment(id, imageUrl);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);