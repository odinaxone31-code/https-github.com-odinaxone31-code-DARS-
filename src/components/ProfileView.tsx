import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Settings, 
  UserPlus, 
  UserCheck, 
  Grid, 
  Bookmark, 
  Heart, 
  MessageCircle, 
  Eye, 
  Camera,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfileViewProps {
  userId?: string;
  onBack?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId, onBack }) => {
  const { 
    users, 
    photos, 
    currentUser, 
    toggleFollow, 
    setIsEditProfileOpen, 
    openFollowersModal, 
    openPhotoDetail 
  } = useApp();

  const targetUserId = userId || currentUser?.id;
  const targetUser = users.find(u => u.id === targetUserId);

  const [activeTab, setActiveTab] = useState<'photos' | 'saved'>('photos');

  if (!targetUser) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400">
        User profile not found.
      </div>
    );
  }

  const isSelf = currentUser?.id === targetUser.id;
  const isFollowing = currentUser ? currentUser.following.includes(targetUser.id) : false;

  // Photos uploaded by user
  const userPhotos = photos.filter(p => p.userId === targetUser.id);

  // Saved photos
  const savedPhotoIds = targetUser.savedPhotoIds || [];
  const savedPhotos = photos.filter(p => savedPhotoIds.includes(p.id));

  const displayPhotos = activeTab === 'photos' ? userPhotos : savedPhotos;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
      
      {/* Back Button if opened from feed/search */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </button>
      )}

      {/* Header Banner & Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Subtle Decorative Cover */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 relative"></div>

        {/* Profile Details Header */}
        <div className="px-6 pb-6 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <img
                src={targetUser.avatarUrl}
                alt={targetUser.username}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-xl"
              />
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {targetUser.fullName}
                </h1>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  @{targetUser.username}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2">
              {isSelf ? (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-full transition flex items-center gap-1.5 shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : currentUser ? (
                <button
                  onClick={() => toggleFollow(targetUser.id)}
                  className={`px-5 py-2 text-xs font-bold rounded-full transition flex items-center gap-1.5 shadow-md ${
                    isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              ) : null}
            </div>

          </div>

          {/* Bio & Metadata */}
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {targetUser.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {targetUser.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-500" /> Joined {targetUser.joinDate}
              </span>
            </div>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            
            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                {userPhotos.length}
              </div>
              <div className="text-[11px] font-medium text-slate-400">Photos</div>
            </div>

            <button
              onClick={() => openFollowersModal(targetUser, 'followers')}
              className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 hover:border-purple-500 transition cursor-pointer"
            >
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                {targetUser.followersCount}
              </div>
              <div className="text-[11px] font-medium text-slate-400">Followers</div>
            </button>

            <button
              onClick={() => openFollowersModal(targetUser, 'following')}
              className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 hover:border-purple-500 transition cursor-pointer"
            >
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                {targetUser.followingCount}
              </div>
              <div className="text-[11px] font-medium text-slate-400">Following</div>
            </button>

          </div>

        </div>

      </div>

      {/* Gallery Tabs */}
      <div className="flex items-center justify-center border-b border-slate-200 dark:border-slate-800 gap-8">
        <button
          onClick={() => setActiveTab('photos')}
          className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'photos'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Gallery ({userPhotos.length})</span>
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'saved'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Photos ({savedPhotos.length})</span>
          </button>
        )}
      </div>

      {/* Photos Grid */}
      <div>
        {displayPhotos.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {activeTab === 'photos' ? 'No uploaded photos yet' : 'No saved photos yet'}
            </h3>
            <p className="text-xs text-slate-400">
              {activeTab === 'photos' 
                ? `${targetUser.fullName} hasn't posted any images.`
                : 'Photos you save will appear here privately.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayPhotos.map(photo => (
              <div
                key={photo.id}
                onClick={() => openPhotoDetail(photo)}
                className="group relative bg-slate-950 rounded-2xl overflow-hidden aspect-square cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Hover Overlay with Stats */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-6 text-white font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{photo.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{photo.commentsCount}</span>
                  </div>
                </div>

                {/* Title badge */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs truncate">
                  {photo.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
