-- Add image_url column to blogs table
ALTER TABLE blogs 
ADD COLUMN image_url TEXT;

-- Optional: Add index for faster image queries
CREATE INDEX blogs_image_url_idx ON blogs(image_url) 
WHERE image_url IS NOT NULL;
