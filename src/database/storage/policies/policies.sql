-- Allow authenticated users to upload images
CREATE POLICY "Users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Allow public read access
CREATE POLICY "Public read access to blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
