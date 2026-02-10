-- Migration: Add image_urls column for multi-image comments
-- Date: 2026-02-10
-- Description: Adds JSONB array column for multiple image URLs per comment
--              Migrates existing image_url to image_urls array

-- Step 1: Add the image_urls column
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;

-- Step 2: Migrate existing comments with image_url to image_urls array
UPDATE comments
SET image_urls = (
  CASE
    WHEN image_url IS NOT NULL AND image_url != '' THEN
      jsonb_build_array(image_url)
    ELSE
      '[]'::jsonb
  END
)
WHERE image_urls IS NULL OR image_urls = '[]'::jsonb;

-- Step 3: Add index for JSONB queries (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_comments_image_urls
ON comments USING GIN (image_urls);

-- Note: After verifying migration, you can optionally drop the legacy column:
-- ALTER TABLE comments DROP COLUMN image_url;
-- (Keep it for now for backward compatibility)
