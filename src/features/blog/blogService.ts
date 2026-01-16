import { supabase } from '../../lib/supabase';
import { deleteImage as deleteStorageImage } from '../../lib/imageUpload';

/**
 * Service layer for Blog data operations.
 * This handles all direct communication with Supabase (Database and Storage).
 */
export const blogService = {
  /**
   * Fetches blogs from the database using server-side pagination.
   */
  async fetchPaginatedBlogs(page: number, itemsPerPage: number) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true });

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  /**
   * Inserts a new blog post record into the database.
   */
  async createBlog(title: string, content: string, imageUrl: string | null, userId: string) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, image_url: imageUrl, author_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing blog post record by ID.
   */
  async updateBlog(id: string, updateData: any) {
    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Removes images from storage for a blog and its comments.
   */
  async cleanupBlogAssets(blogId: string) {
    const { data: blog } = await supabase.from('blogs').select('image_url').eq('id', blogId).single();
    const { data: comments } = await supabase.from('comments').select('image_url').eq('blog_id', blogId);

    if (blog?.image_url) await deleteStorageImage(blog.image_url);
    
    if (comments) {
      for (const comment of comments) {
        if (comment.image_url) await deleteStorageImage(comment.image_url);
      }
    }
  },

  /**
   * Deletes the blog row from the database.
   */
  async deleteBlogRow(id: string) {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw error;
    return id;
  }
};