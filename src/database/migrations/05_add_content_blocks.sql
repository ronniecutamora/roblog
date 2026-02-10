-- Migration: Add content_blocks column for multi-image blog posts
-- Date: 2026-02-08
-- Description: Adds JSONB column for block-based content (text and images)
--              Migrates existing content + image_url to block format

-- Step 1: Add the content_blocks column
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;

-- Step 2: Migrate existing posts to block format
-- Converts legacy content + image_url to content_blocks array
UPDATE blogs
SET content_blocks = (
  CASE
    WHEN image_url IS NOT NULL AND image_url != '' AND content IS NOT NULL AND content != '' THEN
      -- Both image and content: image block first, then text block
      jsonb_build_array(
        jsonb_build_object(
          'id', 'legacy_image',
          'type', 'image',
          'order', 0,
          'image_url', image_url,
          'caption', NULL
        ),
        jsonb_build_object(
          'id', 'legacy_text',
          'type', 'text',
          'order', 1,
          'text', content
        )
      )
    WHEN image_url IS NOT NULL AND image_url != '' THEN
      -- Only image
      jsonb_build_array(
        jsonb_build_object(
          'id', 'legacy_image',
          'type', 'image',
          'order', 0,
          'image_url', image_url,
          'caption', NULL
        )
      )
    WHEN content IS NOT NULL AND content != '' THEN
      -- Only content
      jsonb_build_array(
        jsonb_build_object(
          'id', 'legacy_text',
          'type', 'text',
          'order', 0,
          'text', content
        )
      )
    ELSE
      -- Empty post
      '[]'::jsonb
  END
)
WHERE content_blocks IS NULL OR content_blocks = '[]'::jsonb;

-- Step 3: Add index for JSONB queries (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_blogs_content_blocks
ON blogs USING GIN (content_blocks);

-- Note: After verifying migration, you can optionally drop legacy columns:
-- ALTER TABLE blogs DROP COLUMN content;
-- ALTER TABLE blogs DROP COLUMN image_url;
-- (Keep them for now for backward compatibility)
