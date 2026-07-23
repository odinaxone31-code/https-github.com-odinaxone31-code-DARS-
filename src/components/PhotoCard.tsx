import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  UserPlus, 
  UserCheck, 
  Heart,
  Eye
} from 'lucide-react';
import { Photo } from '../types';
import { useApp } from '../context/AppContext';

interface PhotoCardProps {
  photo: Photo;
  onEditPhoto?: (photo: Photo) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onEditPhoto }) => {
  const { 
    currentUser, 
    toggleReaction, 
    openPhotoDetail, 
    openReactorsModal, 
    openUserProfile, 
    toggleFollow, 
    toggleSavePhoto, 
    deletePhoto,
    setSearchQuery,
    setActiveTab
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isLiked = currentUser ? photo.likes.some(l => l.userId === currentUser.id) : false;
  const isDisliked = currentUser ? photo.dislikes.some(d => d.userId === currentUser.id) : false;
  const isSaved = currentUser ? (currentUser.savedPhotoIds || []).includes(photo.id) : false;

  const isOwner = currentUser?.id === photo.userId;
  const isAdmin = currentUser?.role === 'admin';
  const isFollowingAuthor = currentUser ? currentUser.following.includes(photo.userId) : false;

  // Format relative date
  const formatTimeAgo = (isoDate: string) => {
    const now = new Date();
    const past = new Date(isoDate);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDoubleTap = () => {
    setDoubleTapHeart(true);
    setTimeout(() => setDoubleTapHeart(false), 800);
    if (!isLiked) {
      toggleReaction(photo.id, 'like');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      
      {/* Card Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openUserProfile(photo.userId)}
            className="relative group/avatar"
          >
            <img 
              src={photo.userAvatar} 
              alt={photo.username} 
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30 group-hover/avatar:border-purple-500 transition"
            />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openUserProfile(photo.userId)}
                className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                @{photo.username}
              </button>
              
              {!isOwner && currentUser && (
                <button
                  onClick={() => toggleFollow(photo.userId)}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition flex items-center gap-1 ${
                    isFollowingAuthor
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold hover:bg-purple-200'
                  }`}
                >
                  {isFollowingAuthor ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                  <span>{isFollowingAuthor ? 'Following' : 'Follow'}</span>
                </button>
              )}
            </div>
            <div className="text-xs text-slate-400">{formatTimeAgo(photo.uploadDate)}</div>
          </div>
        </div>

        {/* Option Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-30">
              <button
                onClick={() => {
                  toggleSavePhoto(photo.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-left"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-600 text-purple-600' : ''}`} />
                {isSaved ? 'Unsave Photo' : 'Save Photo'}
              </button>

              <button
                onClick={() => {
                  handleShare();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-left"
              >
                <Share2 className="w-4 h-4" />
                Copy Link
              </button>

              {isOwner && onEditPhoto && (
                <button
                  onClick={() => {
                    onEditPhoto(photo);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition text-left"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Photo
                </button>
              )}

              {(isOwner || isAdmin) && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this photo?')) {
                      deletePhoto(photo.id);
                    }
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Photo
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Image Display with Double-Tap Like support */}
      <div 
        className="relative bg-slate-950 aspect-[4/3] overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
        onClick={() => openPhotoDetail(photo)}
      >
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          loading="lazy"
        />

        {/* Double-tap animated heart */}
        {doubleTapHeart && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none animate-ping">
            <Heart className="w-20 h-20 text-white fill-rose-500 filter drop-shadow-lg" />
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4 text-white font-bold text-sm">
          <span className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
            <Eye className="w-4 h-4" /> View Fullscreen
          </span>
        </div>
      </div>

      {/* Card Controls & Reaction Row */}
      <div className="p-4 flex flex-col gap-3">
        
        <div className="flex items-center justify-between">
          
          {/* Like / Dislike Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            {/* Like */}
            <button
              onClick={() => toggleReaction(photo.id, 'like')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                isLiked
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Like this photo"
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>Like</span>
            </button>

            {/* Clickable Like Count -> Opens Reactors Modal */}
            <button
              onClick={() => openReactorsModal(photo, 'likes')}
              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition px-1"
              title="See who liked this photo"
            >
              {photo.likesCount}
            </button>

            <span className="w-px h-4 bg-slate-300 dark:bg-slate-700"></span>

            {/* Dislike */}
            <button
              onClick={() => toggleReaction(photo.id, 'dislike')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                isDisliked
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Dislike this photo"
            >
              <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
              <span>Dislike</span>
            </button>

            {/* Clickable Dislike Count -> Opens Reactors Modal */}
            <button
              onClick={() => openReactorsModal(photo, 'dislikes')}
              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-500 transition px-1"
              title="See who disliked this photo"
            >
              {photo.dislikesCount}
            </button>
          </div>

          {/* Comment Trigger */}
          <button
            onClick={() => openPhotoDetail(photo)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <MessageCircle className="w-4 h-4 text-purple-500" />
            <span>{photo.commentsCount} Comments</span>
          </button>
        </div>

        {/* Title & Description */}
        <div>
          <h3 
            onClick={() => openPhotoDetail(photo)}
            className="text-base font-bold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            {photo.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            {photo.description}
          </p>
        </div>

        {/* Tags */}
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {photo.tags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(`#${tag}`);
                  setActiveTab('search');
                }}
                className="text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:underline bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md transition"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Copied link toast indicator */}
        {copiedLink && (
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium text-center animate-fade-in">
            ✓ Link copied to clipboard!
          </div>
        )}

      </div>
    </article>
  );
};
