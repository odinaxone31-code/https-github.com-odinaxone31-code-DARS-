import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Photo, Comment, Notification, SystemStats } from '../types';
import { INITIAL_USERS, INITIAL_PHOTOS, INITIAL_COMMENTS, INITIAL_NOTIFICATIONS } from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  photos: Photo[];
  comments: Comment[];
  notifications: Notification[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Auth
  login: (email: string, pass: string) => { success: boolean; error?: string };
  signup: (fullName: string, username: string, email: string, pass: string, country: string) => { success: boolean; error?: string };
  logout: () => void;
  forgotPassword: (email: string) => { success: boolean; message: string };
  updateProfile: (updates: Partial<User>) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  deleteAccount: () => void;
  quickSwitchUser: (userId: string) => void;

  // Photo actions
  uploadPhoto: (data: { title: string; description: string; tags: string[]; imageUrl: string; aspectRatio?: 'square' | 'portrait' | 'landscape' }) => Photo;
  editPhoto: (photoId: string, title: string, description: string, tags: string[]) => void;
  deletePhoto: (photoId: string) => void;
  toggleReaction: (photoId: string, reactionType: 'like' | 'dislike') => void;
  toggleSavePhoto: (photoId: string) => void;

  // Comment actions
  addComment: (photoId: string, text: string) => void;
  editComment: (commentId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  addReply: (commentId: string, text: string) => void;
  likeComment: (commentId: string) => void;

  // Follow actions
  toggleFollow: (targetUserId: string) => void;

  // Notifications
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;

  // Admin
  adminDeleteUser: (userId: string) => void;
  adminBanUser: (userId: string) => void;
  adminUnbanUser: (userId: string) => void;
  adminDeletePhoto: (photoId: string) => void;
  adminDeleteComment: (commentId: string) => void;
  getSystemStats: () => SystemStats;

  // Modals & View States
  activePhotoDetail: Photo | null;
  openPhotoDetail: (photo: Photo) => void;
  closePhotoDetail: () => void;

  reactorsModalData: { photo: Photo; defaultTab: 'likes' | 'dislikes' } | null;
  openReactorsModal: (photo: Photo, defaultTab?: 'likes' | 'dislikes') => void;
  closeReactorsModal: () => void;

  activeUserProfileId: string | null;
  openUserProfile: (userId: string) => void;
  closeUserProfile: () => void;

  followersModalData: { user: User; type: 'followers' | 'following' } | null;
  openFollowersModal: (user: User, type: 'followers' | 'following') => void;
  closeFollowersModal: () => void;

  isUploadOpen: boolean;
  setIsUploadOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: 'feed' | 'explore' | 'following' | 'search' | 'admin';
  setActiveTab: (tab: 'feed' | 'explore' | 'following' | 'search' | 'admin') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('snapverse_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('snapverse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Core Data loaded from LocalStorage or Initial Seed
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('snapverse_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('snapverse_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('snapverse_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('snapverse_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Logged-in user
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem('snapverse_current_user_id');
    return saved !== null ? saved : 'user_aria'; // Default to Aria Vance for instant rich experience
  });

  const currentUser = users.find(u => u.id === currentUserId) || null;

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('snapverse_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('snapverse_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('snapverse_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('snapverse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('snapverse_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('snapverse_current_user_id');
    }
  }, [currentUserId]);

  // View States
  const [activePhotoDetail, setActivePhotoDetail] = useState<Photo | null>(null);
  const [reactorsModalData, setReactorsModalData] = useState<{ photo: Photo; defaultTab: 'likes' | 'dislikes' } | null>(null);
  const [activeUserProfileId, setActiveUserProfileId] = useState<string | null>(null);
  const [followersModalData, setFollowersModalData] = useState<{ user: User; type: 'followers' | 'following' } | null>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'following' | 'search' | 'admin'>('feed');

  // Keep activePhotoDetail fresh when photos change
  useEffect(() => {
    if (activePhotoDetail) {
      const updated = photos.find(p => p.id === activePhotoDetail.id);
      if (updated) setActivePhotoDetail(updated);
    }
  }, [photos]);

  // Auth Functions
  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'User with this email was not found.' };
    }
    if (user.isBanned) {
      return { success: false, error: 'This account has been suspended by an administrator.' };
    }
    setCurrentUserId(user.id);
    return { success: true };
  };

  const signup = (fullName: string, username: string, email: string, _pass: string, country: string) => {
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email is already registered.' };
    }
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username is already taken.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: email.trim(),
      username: cleanUsername,
      fullName: fullName.trim(),
      bio: 'New memory collector on SnapVerse. 📸',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
      country: country.trim() || 'United States',
      joinDate: new Date().toISOString().split('T')[0],
      followersCount: 0,
      followingCount: 0,
      photosCount: 0,
      role: 'user',
      isBanned: false,
      followers: [],
      following: [],
      savedPhotoIds: []
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const forgotPassword = (email: string) => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      return { success: false, message: 'No account found with this email address.' };
    }
    return { success: true, message: `Password reset instructions sent to ${email}` };
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
    
    // Also update photos where this user is author
    if (updates.username || updates.avatarUrl || updates.fullName) {
      setPhotos(prev => prev.map(p => {
        if (p.userId === currentUser.id) {
          return {
            ...p,
            username: updates.username || p.username,
            userAvatar: updates.avatarUrl || p.userAvatar,
            userFullName: updates.fullName || p.userFullName
          };
        }
        return p;
      }));
    }
  };

  const changePassword = (_oldPass: string, _newPass: string) => {
    return { success: true };
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    const uid = currentUser.id;
    // Remove user, user's photos, user's comments, notifications
    setUsers(prev => prev.filter(u => u.id !== uid));
    setPhotos(prev => prev.filter(p => p.userId !== uid));
    setComments(prev => prev.filter(c => c.userId !== uid));
    setNotifications(prev => prev.filter(n => n.recipientUserId !== uid && n.actorUserId !== uid));
    setCurrentUserId(null);
  };

  const quickSwitchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && !user.isBanned) {
      setCurrentUserId(user.id);
    }
  };

  // Photos
  const uploadPhoto = (data: { title: string; description: string; tags: string[]; imageUrl: string; aspectRatio?: 'square' | 'portrait' | 'landscape' }) => {
    if (!currentUser) throw new Error('Must be logged in to upload');

    const newPhoto: Photo = {
      id: `photo_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      userFullName: currentUser.fullName,
      title: data.title,
      description: data.description,
      tags: data.tags,
      imageUrl: data.imageUrl,
      uploadDate: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      likes: [],
      dislikes: [],
      views: 1,
      aspectRatio: data.aspectRatio || 'landscape'
    };

    setPhotos(prev => [newPhoto, ...prev]);

    // Increment photos count for current user
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, photosCount: u.photosCount + 1 };
      }
      return u;
    }));

    return newPhoto;
  };

  const editPhoto = (photoId: string, title: string, description: string, tags: string[]) => {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, title, description, tags } : p));
  };

  const deletePhoto = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    setPhotos(prev => prev.filter(p => p.id !== photoId));
    setComments(prev => prev.filter(c => c.photoId !== photoId));

    // Decrement photo count
    setUsers(prev => prev.map(u => {
      if (u.id === photo.userId) {
        return { ...u, photosCount: Math.max(0, u.photosCount - 1) };
      }
      return u;
    }));

    if (activePhotoDetail?.id === photoId) {
      setActivePhotoDetail(null);
    }
  };

  const toggleReaction = (photoId: string, reactionType: 'like' | 'dislike') => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    setPhotos(prev => prev.map(p => {
      if (p.id !== photoId) return p;

      const userAlreadyLiked = p.likes.some(l => l.userId === currentUser.id);
      const userAlreadyDisliked = p.dislikes.some(d => d.userId === currentUser.id);

      let newLikes = [...p.likes];
      let newDislikes = [...p.dislikes];

      const now = new Date().toISOString();

      if (reactionType === 'like') {
        if (userAlreadyLiked) {
          // Remove like
          newLikes = newLikes.filter(l => l.userId !== currentUser.id);
        } else {
          // Add like, remove dislike if exists
          newLikes.push({
            userId: currentUser.id,
            username: currentUser.username,
            avatarUrl: currentUser.avatarUrl,
            timestamp: now
          });
          newDislikes = newDislikes.filter(d => d.userId !== currentUser.id);

          // Add notification to photo owner if not self
          if (p.userId !== currentUser.id) {
            addNotification({
              recipientUserId: p.userId,
              actorUserId: currentUser.id,
              actorUsername: currentUser.username,
              actorAvatar: currentUser.avatarUrl,
              type: 'like',
              photoId: p.id,
              photoTitle: p.title,
              photoThumbnail: p.imageUrl,
              text: `liked your photo "${p.title}"`,
              date: now,
              read: false
            });
          }
        }
      } else {
        if (userAlreadyDisliked) {
          // Remove dislike
          newDislikes = newDislikes.filter(d => d.userId !== currentUser.id);
        } else {
          // Add dislike, remove like if exists
          newDislikes.push({
            userId: currentUser.id,
            username: currentUser.username,
            avatarUrl: currentUser.avatarUrl,
            timestamp: now
          });
          newLikes = newLikes.filter(l => l.userId !== currentUser.id);

          // Add notification to photo owner if not self
          if (p.userId !== currentUser.id) {
            addNotification({
              recipientUserId: p.userId,
              actorUserId: currentUser.id,
              actorUsername: currentUser.username,
              actorAvatar: currentUser.avatarUrl,
              type: 'dislike',
              photoId: p.id,
              photoTitle: p.title,
              photoThumbnail: p.imageUrl,
              text: `disliked your photo "${p.title}"`,
              date: now,
              read: false
            });
          }
        }
      }

      return {
        ...p,
        likes: newLikes,
        dislikes: newDislikes,
        likesCount: newLikes.length,
        dislikesCount: newDislikes.length
      };
    }));
  };

  const toggleSavePhoto = (photoId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const isSaved = currentUser.savedPhotoIds?.includes(photoId);
    const updated = isSaved
      ? (currentUser.savedPhotoIds || []).filter(id => id !== photoId)
      : [...(currentUser.savedPhotoIds || []), photoId];

    updateProfile({ savedPhotoIds: updated });
  };

  // Comment Actions
  const addComment = (photoId: string, text: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    if (!text.trim()) return;

    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const now = new Date().toISOString();
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      photoId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      text: text.trim(),
      date: now,
      likesCount: 0,
      likes: [],
      replies: []
    };

    setComments(prev => [newComment, ...prev]);

    // Increment photo comment count
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, commentsCount: p.commentsCount + 1 } : p));

    // Send notification
    if (photo.userId !== currentUser.id) {
      addNotification({
        recipientUserId: photo.userId,
        actorUserId: currentUser.id,
        actorUsername: currentUser.username,
        actorAvatar: currentUser.avatarUrl,
        type: 'comment',
        photoId: photo.id,
        photoTitle: photo.title,
        photoThumbnail: photo.imageUrl,
        text: `commented: "${text.slice(0, 45)}${text.length > 45 ? '...' : ''}"`,
        date: now,
        read: false
      });
    }
  };

  const editComment = (commentId: string, text: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, text } : c));
  };

  const deleteComment = (commentId: string) => {
    const target = comments.find(c => c.id === commentId);
    if (!target) return;

    setComments(prev => prev.filter(c => c.id !== commentId));

    // Decrement comment count on photo
    setPhotos(prev => prev.map(p => p.id === target.photoId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p));
  };

  const addReply = (commentId: string, text: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    if (!text.trim()) return;

    const now = new Date().toISOString();
    const targetComment = comments.find(c => c.id === commentId);

    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const newReply = {
        id: `reply_${Date.now()}`,
        commentId,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatarUrl,
        text: text.trim(),
        date: now,
        likesCount: 0,
        likes: []
      };
      return {
        ...c,
        replies: [...c.replies, newReply]
      };
    }));

    if (targetComment && targetComment.userId !== currentUser.id) {
      const photo = photos.find(p => p.id === targetComment.photoId);
      addNotification({
        recipientUserId: targetComment.userId,
        actorUserId: currentUser.id,
        actorUsername: currentUser.username,
        actorAvatar: currentUser.avatarUrl,
        type: 'reply',
        photoId: photo?.id,
        photoTitle: photo?.title,
        photoThumbnail: photo?.imageUrl,
        text: `replied to your comment: "${text.slice(0, 45)}${text.length > 45 ? '...' : ''}"`,
        date: now,
        read: false
      });
    }
  };

  const likeComment = (commentId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const alreadyLiked = c.likes.includes(currentUser.id);
      const newLikes = alreadyLiked
        ? c.likes.filter(id => id !== currentUser.id)
        : [...c.likes, currentUser.id];
      return {
        ...c,
        likes: newLikes,
        likesCount: newLikes.length
      };
    }));
  };

  // Follow
  const toggleFollow = (targetUserId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    if (targetUserId === currentUser.id) return;

    const isFollowing = currentUser.following.includes(targetUserId);
    const now = new Date().toISOString();

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updatedFollowing = isFollowing
          ? u.following.filter(id => id !== targetUserId)
          : [...u.following, targetUserId];
        return {
          ...u,
          following: updatedFollowing,
          followingCount: updatedFollowing.length
        };
      }
      if (u.id === targetUserId) {
        const updatedFollowers = isFollowing
          ? u.followers.filter(id => id !== currentUser.id)
          : [...u.followers, currentUser.id];
        return {
          ...u,
          followers: updatedFollowers,
          followersCount: updatedFollowers.length
        };
      }
      return u;
    }));

    if (!isFollowing) {
      addNotification({
        recipientUserId: targetUserId,
        actorUserId: currentUser.id,
        actorUsername: currentUser.username,
        actorAvatar: currentUser.avatarUrl,
        type: 'follow',
        text: `started following you`,
        date: now,
        read: false
      });
    }
  };

  // Notification helper
  const addNotification = (notif: Omit<Notification, 'id'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.recipientUserId === currentUser.id ? { ...n, read: true } : n));
  };

  // Admin Actions
  const adminDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setPhotos(prev => prev.filter(p => p.userId !== userId));
    setComments(prev => prev.filter(c => c.userId !== userId));
    if (currentUserId === userId) logout();
  };

  const adminBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: true } : u));
    if (currentUserId === userId) logout();
  };

  const adminUnbanUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: false } : u));
  };

  const adminDeletePhoto = (photoId: string) => {
    deletePhoto(photoId);
  };

  const adminDeleteComment = (commentId: string) => {
    deleteComment(commentId);
  };

  const getSystemStats = (): SystemStats => {
    const totalLikes = photos.reduce((acc, p) => acc + p.likesCount, 0);
    const totalDislikes = photos.reduce((acc, p) => acc + p.dislikesCount, 0);
    const totalComments = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
    const totalBannedUsers = users.filter(u => u.isBanned).length;

    return {
      totalUsers: users.length,
      totalPhotos: photos.length,
      totalLikes,
      totalDislikes,
      totalComments,
      totalBannedUsers
    };
  };

  // Modal Helpers
  const openPhotoDetail = (photo: Photo) => setActivePhotoDetail(photo);
  const closePhotoDetail = () => setActivePhotoDetail(null);

  const openReactorsModal = (photo: Photo, defaultTab: 'likes' | 'dislikes' = 'likes') => {
    setReactorsModalData({ photo, defaultTab });
  };
  const closeReactorsModal = () => setReactorsModalData(null);

  const openUserProfile = (userId: string) => setActiveUserProfileId(userId);
  const closeUserProfile = () => setActiveUserProfileId(null);

  const openFollowersModal = (user: User, type: 'followers' | 'following') => {
    setFollowersModalData({ user, type });
  };
  const closeFollowersModal = () => setFollowersModalData(null);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        photos,
        comments,
        notifications,
        theme,
        toggleTheme,

        login,
        signup,
        logout,
        forgotPassword,
        updateProfile,
        changePassword,
        deleteAccount,
        quickSwitchUser,

        uploadPhoto,
        editPhoto,
        deletePhoto,
        toggleReaction,
        toggleSavePhoto,

        addComment,
        editComment,
        deleteComment,
        addReply,
        likeComment,

        toggleFollow,

        markNotificationRead,
        markAllNotificationsRead,

        adminDeleteUser,
        adminBanUser,
        adminUnbanUser,
        adminDeletePhoto,
        adminDeleteComment,
        getSystemStats,

        activePhotoDetail,
        openPhotoDetail,
        closePhotoDetail,

        reactorsModalData,
        openReactorsModal,
        closeReactorsModal,

        activeUserProfileId,
        openUserProfile,
        closeUserProfile,

        followersModalData,
        openFollowersModal,
        closeFollowersModal,

        isUploadOpen,
        setIsUploadOpen,
        isAuthOpen,
        setIsAuthOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,

        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
