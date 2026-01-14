import { supabase } from './supabase';

/**
 * Image Upload Configuration
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const BUCKET_NAME = 'blog-images';

/**
 * Validates an image file before upload.
 * @param {File} file - The file to validate.
 * @returns {string | null} Error message if invalid, null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'File too large. Maximum size is 5MB.';
  }
  
  return null;
}

/**
 * Uploads an image to Supabase Storage.
 * @param {File} file - The image file to upload.
 * @param {string} userId - The authenticated user's ID.
 * @returns {Promise<string>} The public URL of the uploaded image.
 * @throws {Error} If upload fails.
 */
export async function uploadImage(file: File, userId: string): Promise<string> {
  // Validate file
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  // Generate unique filename: {userId}_{timestamp}_{originalName}
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}_${timestamp}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Deletes an image from Supabase Storage.
 * @param {string} imageUrl - The full public URL of the image.
 * @returns {Promise<void>}
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract the path from the URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/blog-images/{path}
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.indexOf(BUCKET_NAME);
    
    if (bucketIndex === -1) {
      throw new Error('Invalid image URL');
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Failed to delete image:', error);
      // Don't throw - deletion failure shouldn't block blog operations
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - deletion failure shouldn't block blog operations
  }
}

/**
 * Creates a preview URL for a File object.
 * @param {File} file - The image file.
 * @returns {string} Object URL for preview.
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a preview URL to free memory.
 * @param {string} url - The object URL to revoke.
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
