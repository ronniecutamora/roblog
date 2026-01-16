import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import type { AppDispatch, RootState } from '../../app/store';
import { 
  fetchComments, 
  addComment, 
  removeComment, 
  clearComments 
} from './commentSlice';
import { 
  validateImageFile, 
  createPreviewUrl, 
  revokePreviewUrl 
} from '../../lib/imageUpload';

export function useComments(blogId: string) {
  const dispatch = useDispatch<AppDispatch>();
  
  const { comments, loading, error } = useSelector((state: RootState) => state.comment);
  const { user } = useSelector((state: RootState) => state.auth);

  const [newContent, setNewContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // 1. IMMEDIATELY clear the old comments as soon as blogId changes
    dispatch(clearComments());

    // 2. Fetch the new comments
    dispatch(fetchComments(blogId));

    // 3. Set up a unique channel for this specific blog
    // Use a unique name for the channel to prevent cross-talk
    const channelName = `comments-${blogId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments', 
          filter: `blog_id=eq.${blogId}` // CRITICAL: Strict filter
        }, 
        (payload) => {
          // Innovative check: only re-fetch if the payload actually belongs to this blog
          dispatch(fetchComments(blogId));
        }
      )
      .subscribe();

    return () => {
      // 4. CLEANUP: Clear again on unmount and kill the subscription
      dispatch(clearComments());
      if (previewUrl) revokePreviewUrl(previewUrl);
      supabase.removeChannel(channel);
    };
  }, [blogId, dispatch]); // Re-run whenever blogId changes

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) { alert(validationError); return; }
    if (previewUrl) revokePreviewUrl(previewUrl);
    setSelectedImage(file);
    setPreviewUrl(createPreviewUrl(file));
  };

  const handleRemoveImage = () => {
    if (previewUrl) revokePreviewUrl(previewUrl);
    setPreviewUrl(null);
    setSelectedImage(null);
  };

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

  const handleDelete = (id: string, imageUrl?: string | null) => {
    if (window.confirm('Delete comment?')) {
      dispatch(removeComment({ id, imageUrl }));
    }
  };

  return {
    comments, loading, error, user,
    newContent, setNewContent,
    previewUrl, isPosting,
    handleImageSelect, handleRemoveImage, handlePost, handleDelete
  };
}