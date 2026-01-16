import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { validateImageFile, uploadImage, deleteImage, createPreviewUrl, revokePreviewUrl } from '../../../lib/imageUpload';
import type { RootState } from '../../../app/store';
import { useSelector } from 'react-redux';

interface CommentRecord {
  id: string;
  blog_id: string;
  author_id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
}

export default function Comments({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New comment state
  const [newContent, setNewContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchComments();
    // real-time subscription (optional)
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `blog_id=eq.${blogId}` }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      // cleanup preview
      if (previewUrl) revokePreviewUrl(previewUrl);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  async function fetchComments() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const validation = validateImageFile(file);
    if (validation) {
      setError(validation);
      return;
    }
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
    if (!user) {
      alert('You must be logged in to comment');
      return;
    }
    if (newContent.trim().length === 0 && !selectedImage) {
      alert('Comment cannot be empty');
      return;
    }
    setIsPosting(true);
    setError(null);
    try {
      let imageUrl: string | null = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage, user.id);
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            blog_id: blogId,
            author_id: user.id,
            content: newContent || '',
            image_url: imageUrl,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      // append new comment
      setComments((c) => [...c, data]);
      setNewContent('');
      handleRemoveImage();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (comment: CommentRecord) => {
    if (!user || user.id !== comment.author_id) {
      alert('You can only delete your own comments');
      return;
    }
    if (!window.confirm('Delete this comment?')) return;

    try {
      const { error } = await supabase.from('comments').delete().eq('id', comment.id);
      if (error) throw error;
      if (comment.image_url) {
        await deleteImage(comment.image_url);
      }
      setComments((c) => c.filter((x) => x.id !== comment.id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      {/* New Comment Form */}
      <div className="mb-6">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full rounded-md border p-3 mb-2"
          rows={3}
        />

        {previewUrl && (
          <div className="mb-2 relative">
            <img src={previewUrl} alt="preview" className="max-h-48 rounded-md" />
            <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1">x</button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <span className="text-sm text-gray-600">Attach image</span>
          </label>

          <button onClick={handlePost} disabled={isPosting} className="btn btn-primary">
            {isPosting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {/* Comments List */}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="p-4 bg-white rounded-md border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
                  {c.image_url && (
                    <img src={c.image_url} alt="comment" className="mt-2 max-h-80 rounded-md" />
                  )}
                  <p className="text-xs text-gray-500 mt-2">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                {user && user.id === c.author_id && (
                  <div>
                    <button onClick={() => handleDelete(c)} className="text-sm text-red-600">Delete</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
