import React, { useState } from 'react';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  UserPlus, 
  UserCheck, 
  Trash2, 
  Edit3, 
  Send, 
  CornerDownRight, 
  Heart,
  Download,
  Calendar,
  Eye,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PhotoDetailModal: React.FC = () => {
  const { 
    activePhotoDetail, 
    closePhotoDetail, 
    currentUser, 
    toggleReaction, 
    comments, 
    addComment, 
    editComment, 
    deleteComment, 
    addReply, 
    likeComment, 
    toggleFollow, 
    openUserProfile, 
    openReactorsModal, 
    deletePhoto,
    toggleSavePhoto,
    setSearchQuery,
    setActiveTab
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activePhotoDetail) return null;

  const photo = activePhotoDetail;
  const photoComments = comments.filter(c => c.photoId === photo.id);

  const isLiked = currentUser ? photo.likes.some(l => l.userId === currentUser.id) : false;
  const isDisliked = currentUser ? photo.dislikes.some(d => d.userId === currentUser.id) : false;
  const isSaved = currentUser ? (currentUser.savedPhotoIds || []).includes(photo.id) : false;
  const isOwner = currentUser?.id === photo.userId;
  const isAdmin = currentUser?.role === 'admin';
  const isFollowingAuthor = currentUser ? currentUser.following.includes(photo.userId) : false;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(photo.id, commentText.trim());
    setCommentText('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;
    addReply(commentId, replyText.trim());
    setReplyText('');
    setReplyingToCommentId(null);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editText.trim()) return;
    editComment(commentId, editText.trim());
    setEditingCommentId(null);
    setEditText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Left Side: Full Size Image */}
        <div className="relative bg-slate-950 flex-1 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px]">
          <img 
            src={photo.imageUrl} 
            alt={photo.title} 
            className="w-full h-full object-contain max-h-[85vh]"
          />

          <a
            href={photo.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`${photo.title.replace(/\s+/g, '_')}.jpg`}
            className="absolute top-4 left-4 p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold"
            title="Download Full Resolution Image"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>

          <button
            onClick={closePhotoDetail}
            className="md:hidden absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side: Details & Comments Drawer */}
        <div className="w-full md:w-[420px] flex flex-col bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
          
          {/* Header with Photographer Profile */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => { openUserProfile(photo.userId); closePhotoDetail(); }}>
                <img 
                  src={photo.userAvatar} 
                  alt={photo.username} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                />
              </button>
              <div>
                <button 
                  onClick={() => { openUserProfile(photo.userId); closePhotoDetail(); }}
                  className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 block text-left"
                >
                  @{photo.username}
                </button>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{photo.userFullName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(photo.uploadDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isOwner && currentUser && (
                <button
                  onClick={() => toggleFollow(photo.userId)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition flex items-center gap-1 ${
                    isFollowingAuthor
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                  }`}
                >
                  {isFollowingAuthor ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{isFollowingAuthor ? 'Following' : 'Follow'}</span>
                </button>
              )}

              <button
                onClick={closePhotoDetail}
                className="hidden md:flex p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Photo Info & Comments List Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            
            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{photo.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {photo.description}
              </p>
              
              {/* Hashtags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {photo.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(`#${tag}`);
                        setActiveTab('search');
                        closePhotoDetail();
                      }}
                      className="text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:underline bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reaction Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleReaction(photo.id, 'like')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    isLiked
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>

                <button
                  onClick={() => openReactorsModal(photo, 'likes')}
                  className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition"
                  title="View who liked this photo"
                >
                  {photo.likesCount}
                </button>

                <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></span>

                <button
                  onClick={() => toggleReaction(photo.id, 'dislike')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    isDisliked
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Dislike</span>
                </button>

                <button
                  onClick={() => openReactorsModal(photo, 'dislikes')}
                  className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-rose-500 transition"
                  title="View who disliked this photo"
                >
                  {photo.dislikesCount}
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleSavePhoto(photo.id)}
                  className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition ${
                    isSaved ? 'text-purple-600' : 'text-slate-400'
                  }`}
                  title={isSaved ? 'Unsave Photo' : 'Save Photo'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {(isOwner || isAdmin) && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this photo?')) deletePhoto(photo.id);
                    }}
                    className="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

            {copiedLink && (
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium text-center">
                ✓ Link copied to clipboard!
              </div>
            )}

            {/* Comments Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                Comments ({photoComments.length})
              </span>
            </div>

            {/* Comment Stream */}
            <div className="space-y-4">
              {photoComments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                photoComments.map(comment => {
                  const isCommentOwner = currentUser?.id === comment.userId;
                  const isCommentLiked = currentUser ? comment.likes.includes(currentUser.id) : false;

                  return (
                    <div key={comment.id} className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5 group/comm">
                        <img 
                          src={comment.userAvatar} 
                          alt={comment.username} 
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1">
                          <div className="bg-slate-100 dark:bg-slate-800/70 p-3 rounded-2xl">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span 
                                onClick={() => { openUserProfile(comment.userId); closePhotoDetail(); }}
                                className="font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:underline"
                              >
                                @{comment.username}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatDate(comment.date)}
                              </span>
                            </div>

                            {editingCommentId === comment.id ? (
                              <div className="space-y-2 mt-1">
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-purple-500 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                                />
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setEditingCommentId(null)} className="text-[10px] text-slate-400">Cancel</button>
                                  <button onClick={() => handleSaveEdit(comment.id)} className="text-[10px] font-bold text-purple-600">Save</button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
                            )}
                          </div>

                          {/* Comment Sub Actions */}
                          <div className="flex items-center gap-3 mt-1 ml-2 text-[11px] text-slate-400">
                            <button
                              onClick={() => likeComment(comment.id)}
                              className={`font-semibold transition flex items-center gap-1 ${
                                isCommentLiked ? 'text-rose-500' : 'hover:text-slate-600 dark:hover:text-slate-200'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isCommentLiked ? 'fill-current' : ''}`} />
                              <span>{comment.likesCount > 0 ? comment.likesCount : 'Like'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id);
                                setReplyText('');
                              }}
                              className="font-semibold hover:text-slate-600 dark:hover:text-slate-200 transition"
                            >
                              Reply
                            </button>

                            {(isCommentOwner || isAdmin) && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditText(comment.text);
                                  }}
                                  className="hover:text-amber-500 transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteComment(comment.id)}
                                  className="hover:text-rose-500 transition"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>

                          {/* Inline Reply Form */}
                          {replyingToCommentId === comment.id && (
                            <div className="mt-2 ml-4 flex gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Reply to @${comment.username}...`}
                                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                              />
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                className="px-3 py-1.5 bg-purple-600 text-white rounded-xl font-bold text-xs"
                              >
                                Reply
                              </button>
                            </div>
                          )}

                          {/* Nested Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="flex items-start gap-2">
                                  <img 
                                    src={reply.userAvatar} 
                                    alt={reply.username} 
                                    className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                                  />
                                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="font-bold text-slate-900 dark:text-slate-100">@{reply.username}</span>
                                      <span className="text-[9px] text-slate-400">{formatDate(reply.date)}</span>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300">{reply.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Comment Input Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={currentUser ? "Add a comment..." : "Sign in to join discussion..."}
                disabled={!currentUser}
                className="flex-1 px-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 rounded-full text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!currentUser || !commentText.trim()}
                className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-full transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
