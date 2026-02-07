-- 04_add_profiles_table.sql
-- Creates a profiles table for storing user display names and avatars
-- Syncs automatically with auth.users via triggers

-- ─── Create Profiles Table ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── Enable RLS ──────────────────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ────────────────────────────────────────────────────────────

-- Anyone can view profiles (needed to display author names on posts)
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ─── Function: Auto-create Profile on Signup ─────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

-- ─── Trigger: On User Created ────────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ─── Function: Sync Profile on Metadata Update ──────────────────────────────

CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE profiles
    SET
        display_name = COALESCE(NEW.raw_user_meta_data->>'display_name', display_name),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', avatar_url),
        updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

-- ─── Trigger: On User Updated ────────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
    EXECUTE FUNCTION handle_user_update();

-- ─── Backfill: Create Profiles for Existing Users ───────────────────────────

INSERT INTO profiles (id, display_name, avatar_url)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'display_name', split_part(email, '@', 1)),
    raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ─── Update Foreign Keys ─────────────────────────────────────────────────────

-- Update blogs.author_id to reference profiles
ALTER TABLE blogs
    DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;

ALTER TABLE blogs
    ADD CONSTRAINT blogs_author_id_fkey
    FOREIGN KEY (author_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Update comments.author_id to reference profiles
ALTER TABLE comments
    DROP CONSTRAINT IF EXISTS comments_author_id_fkey;

ALTER TABLE comments
    ADD CONSTRAINT comments_author_id_fkey
    FOREIGN KEY (author_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- ─── Index for Performance ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS profiles_display_name_idx ON profiles(display_name);
