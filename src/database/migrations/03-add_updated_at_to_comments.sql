-- Add updated_at column to comments table
ALTER TABLE comments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
