import { supabase } from '../../lib/supabase';
import { uploadImage, deleteImage } from '../../lib/imageUpload';

/**
 * Service for Comment-related data operations.
 * Handles database interaction and storage cleanup.
 */
export const commentService = {
  /**
   * Fetches all comments belonging to a specific blog.
   * @param blogId - The ID of the parent blog.
   */
  async fetchComments(blogId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Handles the multi-step process of uploading an image and creating a comment record.
   * @param blogId - Target blog post.
   * @param authorId - User ID of the commenter.
   * @param content - Text body.
   * @param file - Optional image file.
   */
  async createComment(blogId: string, authorId: string, content: string, file: File | null) {
    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await uploadImage(file, authorId);
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ 
        blog_id: blogId, 
        author_id: authorId, 
        content: content || '', 
        image_url: imageUrl 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a comment and its associated storage assets.
   * @param commentId - The ID of the comment to remove.
   * @param imageUrl - The path of the image to delete from storage.
   */
  async deleteComment(commentId: string, imageUrl?: string | null) {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) throw error;

    if (imageUrl) {
      await deleteImage(imageUrl);
    }
    return commentId;
  }
};