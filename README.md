# Roblog v1.2.0 - Comments Feature

A modern, full-stack blog application built with React 19, TypeScript, Redux Toolkit, and Supabase.

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

<img width="1366" height="768" alt="Blog with comments" src="https://github.com/user-attachments/assets/c6b73474-0a4a-44ca-9f4f-c86f317304cf" />

<img width="1366" height="768" alt="Create Comment" src="https://github.com/user-attachments/assets/7d0205e0-0b1d-4b59-a7e2-661657c88df7" />

<img width="1366" height="768" alt="Creating Comment" src="https://github.com/user-attachments/assets/b5e1ee14-71b0-4804-b9e9-e98f972cb2a0" />

<img width="1366" height="768" alt="Post Comment" src="https://github.com/user-attachments/assets/e2133e95-77ed-400f-89ba-0760f2c9a210" />

## Table of Contents

- [Live Demo](#live-demo)
- [What's New in v1.1.0](#whats-new-in-v110)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Storage Setup](#storage-setup)
- [Deployment](#deployment)
- [Code Quality](#code-quality)
- [Assessment Requirements](#assessment-requirements)
- [License](#license)
- [Author](#author)

## Live Demo

**Deployed Application:** [https://roblog.vercel.app](https://roblog.vercel.app)

**Repository:** [https://github.com/ronniecutamora/roblog](https://github.com/ronniecutamora/roblog)

---

## What's New in v1.2.0

### Comments Feature
- **Create comments** on blog posts with optional image attachments
- **Edit your own comments** with full image management (add, replace, or remove images)
- **Delete comments** with confirmation dialog
- **Image support** for comments with preview and validation
- **Community Discussion** section on each blog post
- **User-friendly UI** with loading states and error handling
- **Edit mode inline** - Switch between view and edit modes without page reload

### Bug Fixes
- Fixed UI not updating after comment edits
- Added missing `updated_at` column for comment tracking

---

## What's New in v1.1.0

### Image Upload Feature
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/a777f5c3-b91f-45ed-8062-954f578250db" />
- **Upload featured images** for blog posts
- <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/2f4b2180-6acb-4181-bbab-ac4107e6b101" />
- **Image preview** before submission
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/e115dee2-ec2f-42c6-8d90-a367130a70c9" />
- **File validation** (type and size limits)
- **Automatic cleanup** - images deleted when blog is deleted
- **Replace images** - old images automatically removed when updating
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/3d809857-c1b1-410b-b88d-e8995da25e04" />
- **Supabase Storage integration** for scalable image hosting

### Bug Fixes
- Fixed button remaining active during image upload
- Improved error handling for network failures
---

## Features

### Authentication

<img width="1366" height="768" alt="User Registration" src="https://github.com/user-attachments/assets/5daea296-1d23-4df5-91f0-331169c1dde6" />

- User registration with email
- Email confirmation disabled for demo purposes
- Form validation and error handling
- Session persistence across page reloads

<img width="1366" height="768" alt="User Login" src="https://github.com/user-attachments/assets/bef02f2d-8ef0-4424-a6b4-49057bee09e7" />

- Secure login/logout with Supabase Auth
- Token-based authentication
- Protected routes requiring authentication
- Automatic redirect after successful login

### Blog Management

<img width="1366" height="768" alt="Create Blog Post" src="https://github.com/user-attachments/assets/dd4e8e74-ed99-485f-b637-897c01c36338" />

**Create Posts**
- Rich text input for blog content
- **NEW:** Optional featured image upload
- **NEW:** Image preview before publishing
- Title and content validation (minimum character requirements)
- **NEW:** File type validation (JPEG, PNG, WebP, GIF)
- **NEW:** File size limit (5MB maximum)

<img width="1366" height="768" alt="Edit Blog Post" src="https://github.com/user-attachments/assets/d5b82fce-c6e6-4f84-a742-fb5407f4fe6d" />

**Edit Posts**
- Edit only your own posts
- Pre-filled form with existing data
- **NEW:** Add, replace, or remove images
- **NEW:** Automatic deletion of old images when replacing
- Update timestamps automatically tracked
- Instant UI updates after saving

<img width="1366" height="768" alt="Delete Blog Post" src="https://github.com/user-attachments/assets/a4a358e7-e9f2-4610-9005-7c10c3188740" />

**Delete Posts**
- Delete only your own posts
- **NEW:** Automatic image cleanup from storage
- Confirmation dialog before deletion
- Secure deletion with owner verification
- Automatic list refresh after deletion

<img width="1366" height="768" alt="Blog List with Pagination" src="https://github.com/user-attachments/assets/a576a2f9-5d22-4eb3-98c0-a4faebde7190" />

**View All Posts**
- Paginated list (6 posts per page)
- **NEW:** Featured image thumbnails on blog cards
- Server-side pagination for performance
- Creation date formatting
- Page number navigation with Previous/Next buttons
- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)

<img width="1366" height="768" alt="Blog with comments" src="https://github.com/user-attachments/assets/c6b73474-0a4a-44ca-9f4f-c86f317304cf" />

**Full Post View**
- Complete blog content without truncation
- **NEW:** Full-size featured image display
- Creation and edit timestamps
- Owner-only action buttons (Edit/Delete)
- **NEW (v1.2.0):** Community Discussion section with comments
- Back navigation
- Responsive typography

### Comments System (NEW in v1.2.0)

- **Create comments** - Add thoughts with optional images
- **Edit comments** - Update your own comments inline
  - Change comment text
  - Replace or remove images
  - Automatic timestamp tracking
- **Delete comments** - Remove comments with confirmation
- **Image support** - Attach JPEG, PNG, WebP, or GIF images to comments
- **User verification** - Only comment authors can edit/delete their comments
- **Community Discussion** - Threaded comment display on blog posts

### Image Management

- **Image preview** - See your image before publishing
- **File validation** - Accepts JPEG, PNG, WebP, GIF (max 5MB)
- **Automatic cleanup** - Images deleted when blog is deleted
- **Replace functionality** - Old images removed when updating
- **Error handling** - Clear error messages for invalid files
- **Mobile-responsive** - Upload UI works on all screen sizes
- **Supabase Storage** - Secure, scalable cloud storage

### Security

- **Row Level Security (RLS)** - Database-level access policies
- **Owner-only modifications** - Users can only edit/delete their own posts
- **Public read access** - All users can view all posts
- **Protected routes** - Authentication required for create/edit/delete operations
- **Secure sessions** - JWT-based authentication via Supabase
- **NEW:** Secure image storage with access policies

### User Experience

- **Responsive design** - Optimized for mobile, tablet, and desktop
- **Mobile hamburger menu** - Collapsible navigation on small screens
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Loading states** - Visual feedback during data fetching and uploads
- **Error handling** - User-friendly error messages
- **Empty states** - Helpful messages when no content exists
- **Smooth animations** - Transitions and micro-interactions
- **Accessibility** - ARIA labels and keyboard navigation support
- **NEW:** Upload progress indicators

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, TypeScript |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v6 |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Styling** | Tailwind CSS v3 |
| **Build Tool** | Vite |
| **Deployment** | Vercel |

---

## Project Structure
```
roblog/
├── public/              # Static assets
├── src/
│   ├── app/            # Redux store configuration
│   │   └── store.ts
│   ├── components/     # Shared components
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── database/       # Database schema and migrations
│   │   └── schema.sql
│   ├── features/       # Feature-based modules
│   │   ├── auth/       # Authentication
│   │   │   ├── authSlice.ts
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── blog/       # Blog features
│   │   │   ├── blogSlice.ts
│   │   │   ├── BlogList.tsx
│   │   │   ├── BlogForm.tsx
│   │   │   ├── ViewBlog.tsx
│   │   │   └── components/
│   │   │       ├── BlogCard.tsx
│   │   │       ├── Pagination.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ErrorAlert.tsx
│   │   │       └── ImageUpload.tsx
│   │   └── comment/    # Comments feature (NEW)
│   │       ├── Comment.tsx
│   │       ├── commentSlice.ts
│   │       ├── commentService.ts
│   │       ├── commentThunks.ts
│   │       └── useComments.ts
│   ├── lib/            # External library configs
│   │   └── supabase.ts
│   ├── types/          # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # App entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/ronniecutamora/roblog.git
   cd roblog
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**
   
   See [Database Setup](#database-setup) section below.

5. **Set up Supabase Storage**
   
   See [Storage Setup](#storage-setup) section below.

6. **Disable email confirmation** (for demo purposes)
   
   In Supabase Dashboard:
   - Go to **Authentication** → **Providers** → **Email**
   - Disable "Confirm email"
   - Save changes

7. **Run development server**
```bash
   npm run dev
```

8. **Open in browser**
   
   Navigate to `http://localhost:5173`

---

## Database Setup

Run this SQL in your Supabase SQL Editor:
```sql
-- Create blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,           -- Optional image URL
  image_path TEXT,          -- Storage path for deletion
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Blogs are viewable by everyone"
ON blogs FOR SELECT USING (true);

CREATE POLICY "Users can create blogs"
ON blogs FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blogs"
ON blogs FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blogs"
ON blogs FOR DELETE USING (auth.uid() = author_id);

-- Create indexes for performance
CREATE INDEX blogs_created_at_idx ON blogs(created_at DESC);
CREATE INDEX blogs_image_url_idx ON blogs(image_url) WHERE image_url IS NOT NULL;

-- Create comments table (NEW in v1.2.0)
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments"
ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE USING (auth.uid() = author_id);

-- Index for retrieval by blog
CREATE INDEX comments_blog_id_idx ON comments(blog_id, created_at DESC);
```

### Seed Data (Optional)
```sql
-- Get your user ID first
SELECT id, email FROM auth.users;

-- Replace 'YOUR_USER_ID' with your actual user ID
INSERT INTO blogs (title, content, author_id) VALUES
('Getting Started with React 19', 'React 19 brings exciting new features...', 'YOUR_USER_ID'),
('Understanding Redux Toolkit', 'Redux Toolkit has revolutionized state management...', 'YOUR_USER_ID'),
('Tailwind CSS Best Practices', 'Tailwind CSS allows for rapid development...', 'YOUR_USER_ID');
```

---

## Storage Setup

**NEW in v1.1.0:** Supabase Storage Configuration

### Create Storage Bucket

1. Go to Supabase Dashboard → **Storage**
2. Click **New Bucket**
3. Configuration:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ Enabled
   - **File size limit:** 5MB (recommended)
   - **Allowed MIME types:** image/jpeg, image/png, image/webp, image/gif

### Set Storage Policies (Run in SQL Editor)
```sql
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

-- Allow public read access to all images
CREATE POLICY "Public read access to blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
```

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

Vercel will automatically build and deploy your application.

### Build for Production
```bash
# Build
npm run build

# Preview production build locally
npm run preview
```

---

## Code Quality

- **Full TypeScript coverage** - Type safety across the entire application
- **Comprehensive JSDoc documentation** - All functions, components, and interfaces documented
- **Modular component architecture** - Feature-based organization for scalability
- **Single responsibility principle** - Each component has one clear purpose
- **Professional error handling** - User-friendly error messages and validation
- **Semantic commit messages** - Clear, conventional commit history
- **Clean code practices** - Consistent formatting and naming conventions

---

## Assessment Requirements

This project fulfills all requirements for the Withcenter, Inc. Korea technical assessment:

- **React 19** - Latest version with modern hooks and patterns
- **TypeScript** - Full type coverage for type safety
- **Redux state management** - Redux Toolkit for auth and blog state
- **Supabase integration** - PostgreSQL database with authentication
- **Authentication** - Complete register, login, logout flow
- **CRUD operations** - Create, Read, Update, Delete for blog posts
- **Pagination** - Server-side pagination (6 posts per page)
- **Deployed to Vercel** - Live production deployment

**Additional Features Implemented:**
- Row Level Security (RLS) policies
- Responsive design with mobile menu
- Protected routes
- Loading and error states
- Modular component architecture
- Image upload and management with Supabase Storage
- Automatic image cleanup and validation
- **NEW (v1.2.0):** Comment editing with image management
- **NEW (v1.2.0):** Comment deletion with confirmation

---

## License

This project is licensed under the MIT License.

---

## Author

**Ronnie Cutamora**

- Portfolio: [Ronnie Cutamora - Software Developer](https://ronniecutamora.vercel.app)
- GitHub: [@ronniecutamora](https://github.com/ronniecutamora)
- Email: ronnicutamora47@gmail.com

---

## Assessment Information

- **Developed for:** Withcenter, Inc. Korea
- **Date:** January 13-16, 2026
- **Version:** 1.2.0
- **Status:** Production Ready

---

**Built with React 19, TypeScript, Redux Toolkit, and Supabase**
