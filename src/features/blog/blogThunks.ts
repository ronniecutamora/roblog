import { createAsyncThunk } from '@reduxjs/toolkit';
import { blogService } from './blogService';
import { supabase } from '../../lib/supabase';

const ITEMS_PER_PAGE = 6;

/**
 * Thunk to fetch a paginated list of blogs.
 */
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const { data, count } = await blogService.fetchPaginatedBlogs(page, ITEMS_PER_PAGE);
      return {
        blogs: data,
        totalPages: Math.ceil(count / ITEMS_PER_PAGE),
        currentPage: page,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk to create a new blog.
 */
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async ({ title, content, imageUrl }: { title: string; content: string; imageUrl?: string | null }, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      return await blogService.createBlog(title, content, imageUrl || null, user.id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk to update an existing blog.
 */
export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, title, content, imageUrl }: { id: string; title: string; content: string; imageUrl?: string | null }, { rejectWithValue }) => {
    try {
      const updateData: any = { 
        title, 
        content, 
        updated_at: new Date().toISOString() 
      };
      if (imageUrl !== undefined) updateData.image_url = imageUrl;
      
      return await blogService.updateBlog(id, updateData);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk to delete a blog and clean up its storage images.
 */
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      await blogService.cleanupBlogAssets(id);
      return await blogService.deleteBlogRow(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);