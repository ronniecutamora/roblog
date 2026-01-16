# Changelog

## [1.2.0] - 2026-01-16

### Added
- Comments system with create, read, update, delete functionality
- Edit comments inline with full image management
- Comment image attachments with validation and preview
- Community Discussion section on blog posts
- Edit mode toggle for seamless comment editing

### Fixed
- UI not updating after comment edits
- Missing `updated_at` column for comment tracking


### Database
- New `comments` table with proper RLS policies
- Migration file `03-add_updated_at_to_comments.sql`

---

## [1.1.0] - 2026-01-14

### Added
- Image upload feature for blog posts
- Featured image support on blog cards and full post views
- Image preview before publishing
- File validation (type and size limits)
- Automatic image cleanup when deleting blogs
- Replace images when updating posts

### Fixed
- Button remaining active during image upload
- Improved error handling for network failures