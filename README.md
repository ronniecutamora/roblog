# Roblog v1.0.0 - Production Release

A modern, full-stack blog application built with React 19, TypeScript, Redux Toolkit, and Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

<img width="1366" height="768" alt="RoBlog Homepage" src="https://github.com/user-attachments/assets/3965a8a7-bbe6-4784-87bc-50e65ca73847" />

<img width="1366" height="768" alt="View Full Blog Post" src="https://github.com/user-attachments/assets/bfb6cdf3-9288-4918-8979-4a1fd8d0c998" />

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Code Quality](#code-quality)
- [Assessment Requirements](#assessment-requirements)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)

## Live Demo

**Deployed Application:** [https://roblog.vercel.app](https://roblog.vercel.app)

**Repository:** [https://github.com/ronniecutamora/roblog](https://github.com/ronniecutamora/roblog)

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

<img width="1366" height="768" alt="Create Blog Post" src="https://github.com/user-attachments/assets/95c7928d-064b-4531-808e-50a7e9b8b2d9" />

**Create Posts**
- Rich text input for blog content
- Title and content validation (minimum character requirements)


<img width="1366" height="768" alt="Edit Blog Post" src="https://github.com/user-attachments/assets/55f40ddc-83e5-467d-908a-e543ebaef062" />

**Edit Posts**
- Edit only your own posts
- Pre-filled form with existing data
- Update timestamps automatically tracked
- Instant UI updates after saving

<img width="1366" height="768" alt="Delete Blog Post" src="https://github.com/user-attachments/assets/349185de-6a3f-4e7a-84f9-5269c60aff14" />

**Delete Posts**
- Delete only your own posts
- Confirmation dialog before deletion
- Secure deletion with owner verification
- Automatic list refresh after deletion

<img width="1366" height="768" alt="Blog List with Pagination" src="https://github.com/user-attachments/assets/a576a2f9-5d22-4eb3-98c0-a4faebde7190" />

**View All Posts**
- Paginated list (6 posts per page)
- Server-side pagination for performance
- Author email displayed on each post
- Creation date formatting
- Page number navigation with Previous/Next buttons
- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)

**Full Post View**
- Complete blog content without truncation
- Creation and edit timestamps
- Owner-only action buttons (Edit/Delete)
- Back navigation
- Responsive typography

### Security

- **Row Level Security (RLS)** - Database-level access policies
- **Owner-only modifications** - Users can only edit/delete their own posts
- **Public read access** - All users can view all posts
- **Protected routes** - Authentication required for create/edit/delete operations
- **Secure sessions** - JWT-based authentication via Supabase

### User Experience

- **Responsive design** - Optimized for mobile, tablet, and desktop
- **Mobile hamburger menu** - Collapsible navigation on small screens
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Loading states** - Visual feedback during data fetching
- **Error handling** - User-friendly error messages
- **Empty states** - Helpful messages when no content exists
- **Smooth animations** - Transitions and micro-interactions
- **Accessibility** - ARIA labels and keyboard navigation support

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, TypeScript |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v6 |
| **Backend** | Supabase (PostgreSQL + Auth) |
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
│   │   └── blog/       # Blog features
│   │       ├── blogSlice.ts
│   │       ├── BlogList.tsx
│   │       ├── BlogForm.tsx
│   │       ├── ViewBlog.tsx
│   │       └── components/
│   │           ├── BlogCard.tsx
│   │           ├── Pagination.tsx
│   │           ├── LoadingSpinner.tsx
│   │           ├── EmptyState.tsx
│   │           └── ErrorAlert.tsx
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

5. **Disable email confirmation** (for demo purposes)
   
   In Supabase Dashboard:
   - Go to **Authentication** → **Providers** → **Email**
   - Disable "Confirm email"
   - Save changes

6. **Run development server**
```bash
   npm run dev
```

7. **Open in browser**
   
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

-- Create index for pagination performance
CREATE INDEX blogs_created_at_idx ON blogs(created_at DESC);
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

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables in Vercel (Just paste your .env file - Vercel will automatically detect your environement variables):
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
- **Rrror handling** - User-friendly error messages and validation
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

---

## Future Improvements

### v1.1.0 - Enhanced Content (Planned)
- Author attribution
- Rich text editor with markdown support
- Image upload and management
- Draft posts functionality
- Categories and tags system


### v1.2.0 - Social Features (Planned)
- Comments system
- Like and bookmark posts
- User profiles with avatars
- Follow/unfollow authors

### v1.3.0 - Advanced Features (Planned)
- Search with filters
- Dark mode toggle
- Reading time estimates
- Social media sharing

### v2.0.0 - Platform Expansion (Future)
- Mobile app (React Native)
- Admin dashboard
- Analytics and insights
- Multi-language support

---

## License

This project is licensed under the MIT License.

---

## Author

**Ronnie Cutamora**

- Portfolio: [Ronnie Cutamora - Software Developer](https://ronniecutamora.com)
- GitHub: [@ronniecutamora](https://github.com/ronniecutamora)
- Email: ronnicutamora47@gmail.com

---

**Assessment Information**

- **Developed for:** Withcenter, Inc. Korea
- **Date:** January 13, 2026
- **Version:** 1.0.0
- **Status:** Production Ready

---

**Built with React 19, TypeScript, Redux Toolkit, and Supabase**
