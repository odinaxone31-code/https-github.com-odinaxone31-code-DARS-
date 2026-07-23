import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Users, 
  Image as ImageIcon, 
  MessageCircle, 
  Trash2, 
  Ban, 
  CheckCircle, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminPanelOpen, 
    setIsAdminPanelOpen, 
    users, 
    photos, 
    comments, 
    getSystemStats, 
    adminDeleteUser, 
    adminBanUser, 
    adminUnbanUser, 
    adminDeletePhoto, 
    adminDeleteComment,
    openPhotoDetail
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'photos' | 'comments'>('stats');
  const [filterQuery, setFilterQuery] = useState('');

  if (!isAdminPanelOpen) return null;

  const stats = getSystemStats();

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(filterQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredPhotos = photos.filter(p => 
    p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredComments = comments.filter(c => 
    c.text.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                SnapVerse Moderation & Admin Dashboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage platform users, moderate uploaded content, and supervise safety
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-1.5 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> System Stats
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'users'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Users ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'photos'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Photos ({photos.length})
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'comments'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" /> Comments ({comments.length})
          </button>
        </div>

        {/* Search Bar for Management tables */}
        {activeTab !== 'stats' && (
          <div className="px-6 pt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={`Filter ${activeTab}...`}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STATS OVERVIEW */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 rounded-2xl">
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.totalUsers}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Users</div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-2xl">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.totalPhotos}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Uploaded Photos</div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-2xl">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.totalLikes}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Likes 👍</div>
                </div>

                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 rounded-2xl">
                  <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.totalDislikes}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Dislikes 👎</div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 rounded-2xl">
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.totalComments}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Comments & Replies</div>
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{stats.totalBannedUsers}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Suspended Users</div>
                </div>

              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Platform Moderation Status
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  SnapVerse content filters automatically ensure only valid image formats (JPG, PNG, WEBP) are submitted. Videos are strictly blocked. All reactions and comment logs are recorded in real-time.
                </p>
              </div>
            </div>
          )}

          {/* MANAGE USERS TABLE */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-bold text-[10px] text-slate-400">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Photos</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatarUrl} alt={u.username} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">@{u.username}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold">
                        {u.role === 'admin' ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded text-[10px]">
                            Admin
                          </span>
                        ) : 'User'}
                      </td>
                      <td className="p-3">{u.country}</td>
                      <td className="p-3 font-bold">{u.photosCount}</td>
                      <td className="p-3 font-semibold">
                        {u.isBanned ? (
                          <span className="text-rose-600 flex items-center gap-1"><Ban className="w-3 h-3" /> Suspended</span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {u.role !== 'admin' && (
                          <>
                            {u.isBanned ? (
                              <button
                                onClick={() => adminUnbanUser(u.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                              >
                                Unban
                              </button>
                            ) : (
                              <button
                                onClick={() => adminBanUser(u.id)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition"
                              >
                                Ban
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (confirm(`Permanently delete user @${u.username}?`)) adminDeleteUser(u.id);
                              }}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MANAGE PHOTOS GRID */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPhotos.map(photo => (
                <div key={photo.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-3 space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black relative">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs">{photo.title}</div>
                    <div className="text-[10px] text-slate-400">by @{photo.username}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>👍 {photo.likesCount}</span>
                      <span>👎 {photo.dislikesCount}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete photo "${photo.title}"?`)) adminDeletePhoto(photo.id);
                      }}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MANAGE COMMENTS */}
          {activeTab === 'comments' && (
            <div className="space-y-3">
              {filteredComments.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">@{c.username}</div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">{c.text}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this comment?')) adminDeleteComment(c.id);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shrink-0 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
