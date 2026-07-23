import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, UserPlus, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReactorsModal: React.FC = () => {
  const { 
    reactorsModalData, 
    closeReactorsModal, 
    currentUser, 
    toggleFollow, 
    openUserProfile 
  } = useApp();

  if (!reactorsModalData) return null;

  const { photo, defaultTab } = reactorsModalData;
  const [activeTab, setActiveTab] = useState<'likes' | 'dislikes'>(defaultTab || 'likes');

  const list = activeTab === 'likes' ? photo.likes : photo.dislikes;

  const formatReactionTime = (timestamp: string) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Reactions on "{photo.title}"
          </h2>
          <button
            onClick={closeReactorsModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-1">
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'likes'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Liked ({photo.likesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('dislikes')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'dislikes'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>Disliked ({photo.dislikesCount})</span>
          </button>
        </div>

        {/* List of Users */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {list.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              {activeTab === 'likes' ? 'No likes yet.' : 'No dislikes yet.'}
            </div>
          ) : (
            list.map((reactor, idx) => {
              const isSelf = currentUser?.id === reactor.userId;
              const isFollowing = currentUser ? currentUser.following.includes(reactor.userId) : false;

              return (
                <div key={`${reactor.userId}_${idx}`} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        openUserProfile(reactor.userId);
                        closeReactorsModal();
                      }}
                    >
                      <img
                        src={reactor.avatarUrl}
                        alt={reactor.username}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    </button>
                    <div>
                      <button
                        onClick={() => {
                          openUserProfile(reactor.userId);
                          closeReactorsModal();
                        }}
                        className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 text-left block"
                      >
                        @{reactor.username}
                      </button>
                      <div className="text-[11px] text-slate-400">
                        Reacted on {formatReactionTime(reactor.timestamp)}
                      </div>
                    </div>
                  </div>

                  {!isSelf && currentUser && (
                    <button
                      onClick={() => toggleFollow(reactor.userId)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition flex items-center gap-1 ${
                        isFollowing
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                      }`}
                    >
                      {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
