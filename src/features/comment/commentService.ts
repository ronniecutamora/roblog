import { supabase } from '../../lib/supabase';
import { uploadImage, deleteImage } from '../../lib/imageUpload';

/**
 * Service for Comment-related data operations.
 * Handles database interactions with Supabase and storage file management.
 * @namespace commentService
 */
export const commentService = {
  /**
   * Fetches all comments belonging to a specific blog post.
   * * @param {string} blogId - The UUID of the parent blog post.
   * @returns {Promise<Array>} A promise that resolves to an array of comment objects.
   * @throws {Error} If the database query fails.
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
   * Creates a new comment and handles optional image uploading.
   * * @param {string} blogId - The UUID of the target blog post.
   * @param {string} authorId - The UUID of the user creating the comment.
   * @param {string} content - The text content of the comment.
   * @param {File | null} file - An optional image file to attach.
   * @returns {Promise<Object>} The newly created comment object.
   * @throws {Error} If image upload or database insertion fails.
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
   * Updates an existing comment.
   * Smartly handles image replacement: uploads new ones and deletes old ones if necessary.
   * * @param {string} commentId - The UUID of the comment to edit.
   * @param {string} content - The updated text content.
   * @param {File | null} newFile - A new image file (if replacing/adding).
   * @param {string | null} oldImageUrl - The URL of the previous image (for cleanup).
   * @param {boolean} keepOldImage - Flag indicating if the old image should be preserved.
   * @returns {Promise<Object>} The updated comment object.
   */
  async updateComment(
    commentId: string, 
    content: string, 
    newFile: File | null, 
    oldImageUrl: string | null,
    keepOldImage: boolean
  ) {
    let finalImageUrl = oldImageUrl;

    // 1. Upload new image if provided
    if (newFile) {
      if (oldImageUrl) await deleteImage(oldImageUrl); // Clean up old garbage
      finalImageUrl = await uploadImage(newFile, 'updated');
    } 
    // 2. Remove old image if user explicitly deleted it
    else if (!keepOldImage && oldImageUrl) {
      await deleteImage(oldImageUrl);
      finalImageUrl = null;
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ 
        content, 
        image_url: finalImageUrl,
        updated_at: new Date().toISOString() 
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a comment and its associated storage assets.
   * * @param {string} commentId - The UUID of the comment to remove.
   * @param {string} [imageUrl] - The URL of the attached image to delete from storage.
   * @returns {Promise<string>} The ID of the deleted comment.
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