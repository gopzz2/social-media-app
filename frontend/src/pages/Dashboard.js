import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Toast from '../components/Toast';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const userId = localStorage.getItem('userId');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchPosts = useCallback(async () => {
    const res = await API.get('/posts');
    setPosts(res.data);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/');
    else fetchPosts();
  }, [fetchPosts, navigate]);

  // Create post
  const handleCreate = async () => {
    if (!title || !description) return showToast('Title and description required!', 'error');
    setLoading(true);
    await API.post('/posts', { title, description });
    setTitle(''); setDescription('');
    fetchPosts();
    showToast('Post created successfully!');
    setLoading(false);
  };

  // Delete post
  const handleDelete = async (id) => {
    await API.delete(`/posts/${id}`);
    fetchPosts();
    showToast('Post deleted!', 'info');
  };

  // Like post
  const handleLike = async (id) => {
    await API.put(`/posts/${id}/like`);
    fetchPosts();
  };

  // Edit post
  const handleEdit = (post) => {
    setEditId(post._id);
    setEditTitle(post.title);
    setEditDesc(post.description);
  };

  const handleEditSave = async (id) => {
    await API.put(`/posts/${id}`, { title: editTitle, description: editDesc });
    setEditId(null);
    fetchPosts();
    showToast('Post updated!');
  };

  // Comments
  const fetchComments = async (postId) => {
    const res = await API.get(`/comments/${postId}`);
    setComments(prev => ({ ...prev, [postId]: res.data }));
  };

  const toggleComments = (postId) => {
    const isOpen = showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen) fetchComments(postId);
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text) return;
    await API.post(`/comments/${postId}`, { text });
    setCommentText(prev => ({ ...prev, [postId]: '' }));
    fetchComments(postId);
    showToast('Comment added!');
  };

  const handleDeleteComment = async (commentId, postId) => {
    await API.delete(`/comments/${commentId}`);
    fetchComments(postId);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const myPostsCount = posts.filter(p => p.userId?.username === username).length;

  return (
    <div style={styles.page}>
      {toast && (
        <Toast message={toast.message} type={toast.type}
          onClose={() => setToast(null)} />
      )}

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navIcon}>S</div>
          <span style={styles.navTitle}>SocialApp</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.avatar}>{username[0].toUpperCase()}</div>
          <span style={styles.navUser}>{username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.container}>
        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{myPostsCount}</div>
            <div style={styles.statLabel}>My Posts</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{posts.length}</div>
            <div style={styles.statLabel}>Total Posts</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}
            </div>
            <div style={styles.statLabel}>Total Likes</div>
          </div>
        </div>

        {/* Create Post */}
        <div style={styles.createCard}>
          <h3 style={styles.sectionTitle}>Create New Post</h3>
          <input style={styles.input} placeholder="Post title..."
            value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea style={{ ...styles.input, height: '80px', resize: 'none' }}
            placeholder="What's on your mind..."
            value={description} onChange={(e) => setDescription(e.target.value)} />
          <button style={styles.btn} onClick={handleCreate} disabled={loading}>
            {loading ? 'Posting...' : '+ Create Post'}
          </button>
        </div>

        {/* Posts List */}
        <h3 style={styles.sectionTitle}>All Posts</h3>
        {posts.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
            No posts yet. Create your first post!
          </p>
        )}

        {posts.map((post) => {
          const isOwner = post.userId?.username === username;
          const liked = post.likes?.includes(userId);
          const commentCount = comments[post._id]?.length || 0;
          const isEditing = editId === post._id;

          return (
            <div key={post._id} style={styles.postCard}>
              {/* Post Header */}
              <div style={styles.postHeader}>
                <div style={styles.postAvatar}>
                  {post.userId?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.postUsername}>{post.userId?.username || 'Unknown'}</div>
                  <div style={styles.postTime}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {isOwner && !isEditing && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={styles.editBtn} onClick={() => handleEdit(post)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(post._id)}>Delete</button>
                  </div>
                )}
              </div>

              {/* Edit Mode */}
              {isEditing ? (
                <div>
                  <input style={styles.input} value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)} />
                  <textarea style={{ ...styles.input, height: '70px', resize: 'none' }}
                    value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={styles.btn} onClick={() => handleEditSave(post._id)}>Save</button>
                    <button style={styles.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 style={styles.postTitle}>{post.title}</h4>
                  <p style={styles.postDesc}>{post.description}</p>
                </>
              )}

              {/* Like & Comment buttons */}
              <div style={styles.postActions}>
                <button style={{
                  ...styles.actionBtn,
                  color: liked ? '#e91e63' : '#888'
                }} onClick={() => handleLike(post._id)}>
                  {liked ? '♥' : '♡'} {post.likes?.length || 0} Likes
                </button>
                <button style={styles.actionBtn}
                  onClick={() => toggleComments(post._id)}>
                  💬 {showComments[post._id]
                    ? 'Hide Comments'
                    : `Comments ${commentCount > 0 ? `(${commentCount})` : ''}`}
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div style={styles.commentsBox}>
                  {(comments[post._id] || []).map(c => (
                    <div key={c._id} style={styles.commentItem}>
                      <div style={styles.commentAvatar}>
                        {c.userId?.username?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={styles.commentUser}>{c.userId?.username} </span>
                        <span style={styles.commentText}>{c.text}</span>
                      </div>
                      {c.userId?.username === username && (
                        <button style={styles.commentDel}
                          onClick={() => handleDeleteComment(c._id, post._id)}>✕</button>
                      )}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText(prev => ({
                        ...prev, [post._id]: e.target.value
                      }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                    />
                    <button style={styles.btn}
                      onClick={() => handleAddComment(post._id)}>Post</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f0f7' },
  navbar: { background: '#1a1a2e', padding: '14px 32px', display: 'flex',
    alignItems: 'center', justifyContent: 'space-between' },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navIcon: { width: '32px', height: '32px', background: '#6c63ff', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '16px' },
  navTitle: { color: 'white', fontWeight: '600', fontSize: '18px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '34px', height: '34px', background: '#6c63ff', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '600', fontSize: '14px' },
  navUser: { color: 'white', fontSize: '14px' },
  logoutBtn: { background: 'transparent', border: '1.5px solid rgba(255,255,255,0.3)',
    color: 'white', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  container: { maxWidth: '680px', margin: '0 auto', padding: '28px 16px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '24px' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '18px',
    textAlign: 'center', border: '1px solid #e8e8f0' },
  statNum: { fontSize: '26px', fontWeight: '700', color: '#6c63ff' },
  statLabel: { fontSize: '12px', color: '#888', marginTop: '4px' },
  createCard: { background: '#fff', borderRadius: '14px', padding: '22px',
    marginBottom: '28px', border: '1px solid #e8e8f0' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8f0',
    borderRadius: '10px', fontSize: '14px', color: '#333', background: '#f7f7fb',
    outline: 'none', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'inherit' },
  btn: { background: '#6c63ff', color: 'white', border: 'none', borderRadius: '10px',
    padding: '11px 22px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { background: '#f0f0f7', color: '#555', border: 'none', borderRadius: '10px',
    padding: '11px 22px', fontSize: '14px', cursor: 'pointer' },
  postCard: { background: '#fff', borderRadius: '14px', padding: '20px',
    marginBottom: '14px', border: '1px solid #e8e8f0' },
  postHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  postAvatar: { width: '36px', height: '36px', background: '#6c63ff', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '600', fontSize: '14px', flexShrink: 0 },
  postUsername: { fontWeight: '600', fontSize: '14px', color: '#1a1a2e' },
  postTime: { fontSize: '11px', color: '#aaa' },
  postTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' },
  postDesc: { fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '12px' },
  editBtn: { background: '#e8f0fe', color: '#1a73e8', border: 'none',
    borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' },
  deleteBtn: { background: '#fff0f0', color: '#ff4757', border: '1px solid #ffcdd2',
    borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' },
  postActions: { display: 'flex', gap: '12px', borderTop: '1px solid #f0f0f7', paddingTop: '12px' },
  actionBtn: { background: 'none', border: 'none', fontSize: '13px',
    color: '#888', cursor: 'pointer', fontWeight: '500', padding: '4px 8px',
    borderRadius: '6px' },
  commentsBox: { background: '#f7f7fb', borderRadius: '10px',
    padding: '14px', marginTop: '12px' },
  commentItem: { display: 'flex', alignItems: 'flex-start', gap: '8px',
    marginBottom: '10px' },
  commentAvatar: { width: '28px', height: '28px', background: '#6c63ff', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '11px', fontWeight: '600', flexShrink: 0 },
  commentUser: { fontWeight: '600', fontSize: '13px', color: '#1a1a2e' },
  commentText: { fontSize: '13px', color: '#555' },
  commentDel: { background: 'none', border: 'none', color: '#aaa',
    cursor: 'pointer', fontSize: '12px', padding: '2px 6px' },
};