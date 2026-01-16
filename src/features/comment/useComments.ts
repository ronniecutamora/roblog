import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import type { AppDispatch, RootState } from '../../app/store';
import { 
  fetchComments, 
  addComment, 
  removeComment, 
  editComment, 
  clearComments 
} from './commentSlice';
import { 
  validateImageFile, 
  createPreviewUrl, 
  revokePreviewUrl 
} from '../../lib/imageUpload';

/**
 * Custom Hook: useComments
 * Encapsulates all logic for viewing, creating, editing, and deleting comments.
 * Includes real-time subscriptions and race-condition prevention.
 * * @param {string} blogId - The ID of the current blog post.
 * @returns {Object} An object containing state values and handler functions.
 */
export function useComments(blogId: string) {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux Global State
  const { comments, loading, error } = useSelector((state: RootState) => state.comment);
  const { user } = useSelector((state: RootState) => state.auth);

  // Local State: Creation
  const [newContent, setNewContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Local State: Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [keepOldImage, setKeepOldImage] = useState(true);

  /**
   * Effect: Data Fetching & Real-time Subscription
   * Handles mounting, aborting stale requests, and cleaning up subscriptions.
   */
  useEffect(() => {
    // 1. Clear previous blog's comments immediately to prevent ghosting
    dispatch(clearComments());

    // 2. Start fetch and capture the promise to allow abortion
    const fetchPromise = dispatch(fetchComments(blogId));

    // 3. Set up unique real-time channel
    const channelName = `comments-${blogId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments', 
          filter: `blog_id=eq.${blogId}` 
        }, 
        () => dispatch(fetchComments(blogId))
      )
      .subscribe();

    // 4. Cleanup Function
    return () => {
      fetchPromise.abort(); // Cancel network request if user leaves early
      dispatch(clearComments());
      if (previewUrl) revokePreviewUrl(previewUrl);
      supabase.removeChannel(channel);
    };
  }, [blogId, dispatch]);

  /**
   * Handler: Selects an image for a new comment.
   * Validates file type/size and generates a preview.
   */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) { alert(validationError); return; }
    
    if (previewUrl) revokePreviewUrl(previewUrl);
    setSelectedImage(file);
    setPreviewUrl(createPreviewUrl(file));
  };

  /** Handler: Clears the attached image from the creation form. */
  const handleRemoveImage = () => {
    if (previewUrl) revokePreviewUrl(previewUrl);
    setPreviewUrl(null);
    setSelectedImage(null);
  };

  /** Handler: Submits a new comment. */
  const handlePost = async () => {
    if (!user) return alert('Log in required');
    if (!newContent.trim() && !selectedImage) return alert('Comment is empty');

    setIsPosting(true);
    try {
      await dispatch(addComment({ 
        blogId, 
        authorId: user.id, 
        content: newContent, 
        file: selectedImage 
      })).unwrap();
      
      setNewContent('');
      handleRemoveImage();
    } finally {
      setIsPosting(false);
    }
  };

  /** Handler: Deletes a comment after confirmation. */
  const handleDelete = (id: string, imageUrl?: string | null) => {
    if (window.confirm('Delete comment?')) {
      dispatch(removeComment({ id, imageUrl }));
    }
  };

  // --- Edit Handlers ---

  /** Handler: Enters edit mode for a specific comment. */
  const startEditing = (comment: any) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setEditPreviewUrl(comment.image_url);
    setKeepOldImage(!!comment.image_url);
    setEditFile(null);
  };

  /** Handler: Cancels edit mode and resets local edit state. */
  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
    setEditFile(null);
    setEditPreviewUrl(null);
    setKeepOldImage(true);
  };

  /** Handler: Selects a NEW image during edit mode (replaces old one). */
  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      setEditPreviewUrl(createPreviewUrl(file));
      setKeepOldImage(false); 
    }
  };

  /** Handler: Removes the image during edit mode. */
  const handleRemoveEditImage = () => {
    setEditFile(null);
    setEditPreviewUrl(null);
    setKeepOldImage(false);
  };

  /** Handler: Saves the edited comment. */
  const saveEdit = async (oldImageUrl: string | null) => {
    if (!editingId) return;
    
    // Prevent saving empty comments
    if (!editContent.trim() && !editFile && !keepOldImage) {
        return alert("Comment cannot be empty");
    }

    try {
      await dispatch(editComment({
        commentId: editingId,
        content: editContent,
        newFile: editFile,
        oldImageUrl,
        keepOldImage
      })).unwrap();
      
      cancelEditing();
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  return {
    // Read & Create Props
    comments, loading, error, user,
    newContent, setNewContent,
    previewUrl, isPosting,
    handleImageSelect, handleRemoveImage, handlePost, handleDelete,
    
    // Edit Props
    editingId, 
    editContent, setEditContent,
    editPreviewUrl,
    startEditing, cancelEditing, saveEdit, 
    handleEditImageSelect, handleRemoveEditImage
  };
}