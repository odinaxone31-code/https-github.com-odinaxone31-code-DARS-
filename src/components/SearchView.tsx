import React, { useState } from 'react';
import { Search, User, Image as ImageIcon, Hash, UserPlus, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SearchView: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    users, 
    photos, 
    currentUser, 
    toggleFollow, 
    openUserProfile, 
    openPhotoDetail 
  } = useApp();

  const [searchTab, setSearchTab] = useState<'all' | 'users' | 'photos' | 'hashtags'>('all');

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/^#/, '');

  // Filter Users
  const matchedUsers = cleanQuery ? users.filter(u => 
    u.username.toLowerCase().includes(cleanQuery) ||
    u.fullName.toLowerCase().includes(cleanQuery) ||
    u.country.toLowerCase().includes(cleanQuery)
  ) : [];

  // Filter Photos
  const matchedPhotos = cleanQuery ? photos.filter(p => 
    p.title.toLowerCase().includes(cleanQuery) ||
    p.description.toLowerCase().includes(cleanQuery) ||
    p.tags.some(t => t.toLowerCase().includes(cleanQuery))
  ) : [];

  // Filter Hashtags
  const matchedHashtags = cleanQuery ? Array.from(new Set(
    photos.flatMap(p => p.tags).filter(t => t.toLowerCase().includes(cleanQuery))
  )) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Search Input Hero */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search usernames, full names, photo titles, or #hashtags..."
            className="w-full pl-12 pr-4 py-3.5 text-base bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 rounded-full text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition shadow-inner"
            autoFocus
          />
        </div>

        {/* Popular Trending Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-400">Popular Hashtags:</span>
          {['#kyoto', '#mountains', '#architecture', '#astrophotography', '#japan', '#nature'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900 px-3 py-1 rounded-full transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-center gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setSearchTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              searchTab === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Results ({matchedUsers.length + matchedPhotos.length})
          </button>

          <button
            onClick={() => setSearchTab('users')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              searchTab === 'users'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Users ({matchedUsers.length})
          </button>

          <button
            onClick={() => setSearchTab('photos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              searchTab === 'photos'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Photos ({matchedPhotos.length})
          </button>

          <button
            onClick={() => setSearchTab('hashtags')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              searchTab === 'hashtags'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Hash className="w-3.5 h-3.5" /> Hashtags ({matchedHashtags.length})
          </button>
        </div>
      )}

      {/* Results Container */}
      {!searchQuery.trim() ? (
        <div className="text-center py-16 text-slate-400 space-y-2">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-bold">Type anything above to search SnapVerse</p>
          <p className="text-xs">Find creators by username, title, location, or tag.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Users Section */}
          {(searchTab === 'all' || searchTab === 'users') && matchedUsers.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-500" /> Matching Users ({matchedUsers.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedUsers.map(u => {
                  const isSelf = currentUser?.id === u.id;
                  const isFollowing = currentUser ? currentUser.following.includes(u.id) : false;

                  return (
                    <div 
                      key={u.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition"
                    >
                      <button 
                        onClick={() => openUserProfile(u.id)}
                        className="flex items-center gap-3 text-left"
                      >
                        <img src={u.avatarUrl} alt={u.username} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-purple-600">
                            @{u.username}
                          </div>
                          <div className="text-xs text-slate-500">{u.fullName} • {u.country}</div>
                          <div className="text-[11px] text-slate-400">{u.photosCount} photos • {u.followersCount} followers</div>
                        </div>
                      </button>

                      {!isSelf && currentUser && (
                        <button
                          onClick={() => toggleFollow(u.id)}
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold transition flex items-center gap-1 ${
                            isFollowing
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              : 'bg-purple-600 text-white shadow-sm'
                          }`}
                        >
                          {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                          <span>{isFollowing ? 'Following' : 'Follow'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Photos Section */}
          {(searchTab === 'all' || searchTab === 'photos') && matchedPhotos.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-500" /> Matching Photos ({matchedPhotos.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {matchedPhotos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => openPhotoDetail(photo)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition"
                  >
                    <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden">
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{photo.title}</div>
                      <div className="text-[11px] text-slate-400">by @{photo.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hashtags Section */}
          {(searchTab === 'all' || searchTab === 'hashtags') && matchedHashtags.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-purple-500" /> Matching Hashtags ({matchedHashtags.length})
              </h2>

              <div className="flex flex-wrap gap-2">
                {matchedHashtags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(`#${tag}`)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:border-purple-500 shadow-sm transition"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedUsers.length === 0 && matchedPhotos.length === 0 && matchedHashtags.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching results found for "{searchQuery}".
            </div>
          )}

        </div>
      )}

    </div>
  );
};
