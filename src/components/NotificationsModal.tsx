import React from 'react';
import { X, Bell, ThumbsUp, ThumbsDown, MessageCircle, UserPlus, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    notifications, 
    currentUser, 
    markNotificationRead, 
    markAllNotificationsRead,
    openPhotoDetail,
    openUserProfile,
    photos
  } = useApp();

  if (!isNotificationsOpen || !currentUser) return null;

  const userNotifications = notifications.filter(n => n.recipientUserId === currentUser.id);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />;
      case 'dislike':
        return <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="w-3.5 h-3.5 text-purple-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    setIsNotificationsOpen(false);

    if (notif.photoId) {
      const targetPhoto = photos.find(p => p.id === notif.photoId);
      if (targetPhoto) openPhotoDetail(targetPhoto);
    } else if (notif.actorUserId) {
      openUserProfile(notif.actorUserId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Notifications
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {userNotifications.some(n => !n.read) && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications Stream */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {userNotifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p>You have no notifications yet.</p>
            </div>
          ) : (
            userNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`py-3.5 px-2 flex items-center justify-between gap-3 rounded-2xl cursor-pointer transition ${
                  !notif.read ? 'bg-purple-50/70 dark:bg-purple-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={notif.actorAvatar}
                      alt={notif.actorUsername}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-md">
                      {getNotifIcon(notif.type)}
                    </div>
                  </div>

                  <div className="text-xs space-y-0.5">
                    <div className="text-slate-900 dark:text-slate-100">
                      <strong className="font-bold">@{notif.actorUsername}</strong> {notif.text}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(notif.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {notif.photoThumbnail && (
                  <img
                    src={notif.photoThumbnail}
                    alt="Thumbnail"
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
