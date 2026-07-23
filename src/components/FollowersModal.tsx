import React from 'react';
import { X, UserCheck, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FollowersModal: React.FC = () => {
  const { 
    followersModalData, 
    closeFollowersModal, 
    users, 
    currentUser, 
    toggleFollow, 
    openUserProfile 
  } = useApp();

  if (!followersModalData) return null;

  const { user, type } = followersModalData;
  const targetUserIds = type === 'followers' ? user.followers : user.following;
  const list = users.filter(u => targetUserIds.includes(u.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 capitalize">
            @{user.username}'s {type}
          </h2>
          <button
            onClick={closeFollowersModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {list.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No {type} yet.
            </div>
          ) : (
            list.map(member => {
              const isSelf = currentUser?.id === member.id;
              const isFollowingMember = currentUser ? currentUser.following.includes(member.id) : false;

              return (
                <div key={member.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        openUserProfile(member.id);
                        closeFollowersModal();
                      }}
                    >
                      <img
                        src={member.avatarUrl}
                        alt={member.username}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    </button>
                    <div>
                      <button
                        onClick={() => {
                          openUserProfile(member.id);
                          closeFollowersModal();
                        }}
                        className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 text-left block"
                      >
                        @{member.username}
                      </button>
                      <div className="text-xs text-slate-400 truncate max-w-[180px]">
                        {member.fullName}
                      </div>
                    </div>
                  </div>

                  {!isSelf && currentUser && (
                    <button
                      onClick={() => toggleFollow(member.id)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition flex items-center gap-1 ${
                        isFollowingMember
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                      }`}
                    >
                      {isFollowingMember ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>{isFollowingMember ? 'Following' : 'Follow'}</span>
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
