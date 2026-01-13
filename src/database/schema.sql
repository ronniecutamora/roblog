-- Create blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read blogs
CREATE POLICY "Blogs are viewable by everyone"
ON blogs FOR SELECT
USING (true);

-- Policy: Users can create their own blogs
CREATE POLICY "Users can create blogs"
ON blogs FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own blogs
CREATE POLICY "Users can update their own blogs"
ON blogs FOR UPDATE
USING (auth.uid() = author_id);

-- Policy: Users can delete their own blogs
CREATE POLICY "Users can delete their own blogs"
ON blogs FOR DELETE
USING (auth.uid() = author_id);

-- Create index for pagination
CREATE INDEX blogs_created_at_idx ON blogs(created_at DESC);