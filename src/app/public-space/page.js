'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { HiOutlineChat, HiOutlinePhotograph, HiOutlineHeart, HiOutlineChatAlt2 } from 'react-icons/hi';
export default function PublicSpacePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  useEffect(() => {
    fetch('/api/public-space')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const handlePost = async () => {
    if (!content.trim()) return;
    if (!user) { window.location.href = '/login'; return; }
    setError('');
    setPosting(true);
    try {
      const res = await fetch('/api/public-space', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setContent('');
        setPosts([data.post, ...posts]);
      }
    } catch {
      setError('Failed to create post');
    } finally {
      setPosting(false);
    }
  };
  const handleLike = async (postId) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/public-space/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, action: 'like' }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.likes } : p));
      }
    } catch {}
  };
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-50">{t('nav.publicSpace')}</h1>
          <p className="text-sm text-dark-400">Connect, share, and grow with the InternHub community.</p>
        </div>
        <div className="glass-strong rounded-2xl p-5 mb-8 border border-white/5 shadow-xl">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's on your mind? Share your interview experience or ask for tips..."
                rows="3"
                className="w-full bg-transparent border-none resize-none focus:outline-none text-dark-100 placeholder:text-dark-500 text-sm"
              ></textarea>
              {error && <p className="text-xs text-danger mb-2">{error}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <button className="p-2 text-dark-400 hover:text-primary-light hover:bg-white/5 rounded-lg transition-colors">
                  <HiOutlinePhotograph className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePost}
                  disabled={!content.trim() || posting}
                  className="px-6 py-2 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                >
                  {posting ? t('common.loading') : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center flex-shrink-0 font-bold text-dark-300">
                    {post.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-100">{post.userId?.name || 'Anonymous'}</p>
                    <p className="text-xs text-dark-500">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</p>
                  </div>
                </div>
                <p className="text-sm text-dark-200 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 text-sm text-dark-400 hover:text-primary-light transition-colors">
                    <HiOutlineHeart className={`w-5 h-5 ${post.likes?.includes(user?._id) ? 'text-danger fill-danger' : ''}`} /> {post.likes?.length || 0}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-dark-400 hover:text-primary-light transition-colors">
                    <HiOutlineChatAlt2 className="w-5 h-5" /> {post.commentCount || 0}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-lg font-medium text-dark-200 mb-2">No posts yet</p>
            <p className="text-sm text-dark-400">Be the first to share something with the community!</p>
          </div>
        )}
      </div>
    </div>
  );
}
