export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  country: string;
  joinDate: string;
  followersCount: number;
  followingCount: number;
  photosCount: number;
  role: Role;
  isBanned?: boolean;
  followers: string[]; // array of userIds
  following: string[]; // array of userIds
  savedPhotoIds?: string[];
}

export interface ReactionUser {
  userId: string;
  username: string;
  avatarUrl: string;
  timestamp: string;
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  date: string;
  likesCount: number;
  likes: string[]; // userIds
}

export interface Comment {
  id: string;
  photoId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  date: string;
  likesCount: number;
  likes: string[]; // userIds
  replies: Reply[];
}

export interface Photo {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  userFullName: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  uploadDate: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  likes: ReactionUser[];
  dislikes: ReactionUser[];
  views?: number;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface Notification {
  id: string;
  recipientUserId: string;
  actorUserId: string;
  actorUsername: string;
  actorAvatar: string;
  type: 'like' | 'dislike' | 'comment' | 'reply' | 'follow';
  photoId?: string;
  photoTitle?: string;
  photoThumbnail?: string;
  text: string;
  date: string;
  read: boolean;
}

export interface SystemStats {
  totalUsers: number;
  totalPhotos: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  totalBannedUsers: number;
}
