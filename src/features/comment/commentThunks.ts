import { createAsyncThunk } from '@reduxjs/toolkit';
import { commentService } from './commentService';

/**
 * Async Thunk to fetch comments for a specific blog post.
 * Handles loading and error states automatically.
 * * @param {string} blogId - The ID of the blog to fetch comments for.
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
 * Async Thunk to add a new comment.
 * * @param {Object} payload - The comment data.
 * @param {string} payload.blogId - Target blog ID.
 * @param {string} payload.authorId - User ID.
 * @param {string} payload.content - Text content.
 * @param {File | null} payload.file - Optional image file.
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
 * Async Thunk to update an existing comment.
 * * @param {Object} payload - The update data.
 * @param {string} payload.commentId - ID of comment to edit.
 * @param {string} payload.content - New text content.
 * @param {File | null} payload.newFile - New image file.
 * @param {string | null} payload.oldImageUrl - Current image URL (for deletion logic).
 * @param {boolean} payload.keepOldImage - Whether to keep the existing image.
 */
export const editComment = createAsyncThunk(
  'comment/editComment',
  async ({ 
    commentId, content, newFile, oldImageUrl, keepOldImage 
  }: { 
    commentId: string; 
    content: string; 
    newFile: File | null; 
    oldImageUrl: string | null; 
    keepOldImage: boolean;
  }, { rejectWithValue }) => {
    try {
      return await commentService.updateComment(commentId, content, newFile, oldImageUrl, keepOldImage);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Async Thunk to remove a comment.
 * * @param {Object} payload
 * @param {string} payload.id - Comment ID.
 * @param {string} [payload.imageUrl] - Image URL to clean up from storage.
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