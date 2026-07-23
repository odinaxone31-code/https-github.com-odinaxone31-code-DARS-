import { User, Photo, Comment, Notification } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    email: 'admin@snapverse.com',
    username: 'admin_master',
    fullName: 'Platform Moderator',
    bio: 'Official Admin & System Guardian for SnapVerse Photo Platform. Keeping our visual community inspiring and safe.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    country: 'United States',
    joinDate: '2025-01-01',
    followersCount: 1420,
    followingCount: 12,
    photosCount: 2,
    role: 'admin',
    isBanned: false,
    followers: ['user_aria', 'user_julian', 'user_elena'],
    following: ['user_aria', 'user_julian'],
    savedPhotoIds: ['photo_1', 'photo_3']
  },
  {
    id: 'user_aria',
    email: 'aria@snapverse.com',
    username: 'aria_vance',
    fullName: 'Aria Vance',
    bio: 'Visual storyteller & fine-art photographer based in Kyoto & San Francisco. Golden hour enthusiast. 📷 Leica M11',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    country: 'Japan',
    joinDate: '2025-02-14',
    followersCount: 890,
    followingCount: 210,
    photosCount: 4,
    role: 'user',
    isBanned: false,
    followers: ['user_admin', 'user_julian', 'user_elena', 'user_lucas'],
    following: ['user_julian', 'user_elena'],
    savedPhotoIds: ['photo_2', 'photo_4']
  },
  {
    id: 'user_julian',
    email: 'julian@snapverse.com',
    username: 'nature_captures',
    fullName: 'Julian Thorne',
    bio: 'Wilderness explorer, landscape lover, and alpine hiking enthusiast. Capturing nature in raw high contrast.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    country: 'Canada',
    joinDate: '2025-03-01',
    followersCount: 654,
    followingCount: 140,
    photosCount: 3,
    role: 'user',
    isBanned: false,
    followers: ['user_aria', 'user_elena'],
    following: ['user_aria', 'user_admin'],
    savedPhotoIds: []
  },
  {
    id: 'user_elena',
    email: 'elena@snapverse.com',
    username: 'urban_arch',
    fullName: 'Elena Rostova',
    bio: 'Architectural geometry & minimalist urban aesthetic photographer. Structural beauty in black & shadow.',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    country: 'Germany',
    joinDate: '2025-03-10',
    followersCount: 432,
    followingCount: 98,
    photosCount: 3,
    role: 'user',
    isBanned: false,
    followers: ['user_aria', 'user_julian'],
    following: ['user_aria', 'user_julian'],
    savedPhotoIds: []
  },
  {
    id: 'user_lucas',
    email: 'lucas@snapverse.com',
    username: 'astro_luke',
    fullName: 'Lucas Chen',
    bio: 'Stargazer & night sky astro-photographer. Searching for deep space nebulas and dark sky reserves.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    country: 'New Zealand',
    joinDate: '2025-04-05',
    followersCount: 310,
    followingCount: 88,
    photosCount: 2,
    role: 'user',
    isBanned: false,
    followers: ['user_aria'],
    following: ['user_aria'],
    savedPhotoIds: []
  }
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'photo_1',
    userId: 'user_aria',
    username: 'aria_vance',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    userFullName: 'Aria Vance',
    title: 'Kyoto Golden Twilight Pagoda',
    description: 'Serene evening dusk reflecting over historical bamboo groves and traditional rooftops in eastern Kyoto. Taken during peak sunset glow.',
    tags: ['kyoto', 'japan', 'architecture', 'sunset', 'travel', 'goldenhour'],
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80',
    uploadDate: '2026-07-22T18:30:00Z',
    likesCount: 3,
    dislikesCount: 0,
    commentsCount: 2,
    views: 1240,
    aspectRatio: 'landscape',
    likes: [
      { userId: 'user_admin', username: 'admin_master', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-22T19:00:00Z' },
      { userId: 'user_julian', username: 'nature_captures', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-22T19:15:00Z' },
      { userId: 'user_elena', username: 'urban_arch', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-22T20:10:00Z' }
    ],
    dislikes: []
  },
  {
    id: 'photo_2',
    userId: 'user_julian',
    username: 'nature_captures',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    userFullName: 'Julian Thorne',
    title: 'Emerald Alpine Mirror Lake',
    description: 'Morning stillness in the Canadian Rockies. The lake surface created a mirror reflection of the towering snow peaks.',
    tags: ['mountains', 'nature', 'canada', 'reflection', 'wilderness', 'landscape'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    uploadDate: '2026-07-21T14:20:00Z',
    likesCount: 2,
    dislikesCount: 1,
    commentsCount: 1,
    views: 980,
    aspectRatio: 'landscape',
    likes: [
      { userId: 'user_aria', username: 'aria_vance', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-21T15:00:00Z' },
      { userId: 'user_lucas', username: 'astro_luke', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-21T16:30:00Z' }
    ],
    dislikes: [
      { userId: 'user_elena', username: 'urban_arch', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-21T17:00:00Z' }
    ]
  },
  {
    id: 'photo_3',
    userId: 'user_elena',
    username: 'urban_arch',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    userFullName: 'Elena Rostova',
    title: 'Monolithic Curves of Modern Steel',
    description: 'Abstract architectural perspectives exploring shadow geometry and metallic reflection in central Berlin.',
    tags: ['architecture', 'monochrome', 'design', 'urban', 'modern', 'germany'],
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    uploadDate: '2026-07-20T09:15:00Z',
    likesCount: 3,
    dislikesCount: 0,
    commentsCount: 2,
    views: 1100,
    aspectRatio: 'square',
    likes: [
      { userId: 'user_admin', username: 'admin_master', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-20T10:00:00Z' },
      { userId: 'user_aria', username: 'aria_vance', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-20T10:15:00Z' },
      { userId: 'user_julian', username: 'nature_captures', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-20T11:20:00Z' }
    ],
    dislikes: []
  },
  {
    id: 'photo_4',
    userId: 'user_lucas',
    username: 'astro_luke',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    userFullName: 'Lucas Chen',
    title: 'Milky Way Core Over Mt. Cook',
    description: '30-second long exposure tracking the galactic core above the Southern Alps of New Zealand. Pure dark skies.',
    tags: ['astrophotography', 'space', 'milkyway', 'nightsky', 'stars', 'newzealand'],
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    uploadDate: '2026-07-19T23:45:00Z',
    likesCount: 4,
    dislikesCount: 0,
    commentsCount: 1,
    views: 1560,
    aspectRatio: 'portrait',
    likes: [
      { userId: 'user_admin', username: 'admin_master', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-20T00:10:00Z' },
      { userId: 'user_aria', username: 'aria_vance', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-20T00:30:00Z' },
      { userId: 'user_julian', username: 'nature_captures', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-20T01:15:00Z' },
      { userId: 'user_elena', username: 'urban_arch', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-20T02:00:00Z' }
    ],
    dislikes: []
  },
  {
    id: 'photo_5',
    userId: 'user_aria',
    username: 'aria_vance',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    userFullName: 'Aria Vance',
    title: 'Mist in the Redwood Forest',
    description: 'Early morning rays penetrating through ancient giant Sequoia trees along the northern California coast.',
    tags: ['trees', 'forest', 'california', 'mist', 'lightrays', 'nature'],
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    uploadDate: '2026-07-18T11:10:00Z',
    likesCount: 2,
    dislikesCount: 0,
    commentsCount: 1,
    views: 890,
    aspectRatio: 'landscape',
    likes: [
      { userId: 'user_julian', username: 'nature_captures', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-18T12:00:00Z' },
      { userId: 'user_lucas', username: 'astro_luke', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', timestamp: '2026-07-18T13:40:00Z' }
    ],
    dislikes: []
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comment_1',
    photoId: 'photo_1',
    userId: 'user_julian',
    username: 'nature_captures',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    text: 'Breathtaking colors Aria! What shutter speed did you use to get that silk soft light?',
    date: '2026-07-22T19:15:00Z',
    likesCount: 2,
    likes: ['user_aria', 'user_admin'],
    replies: [
      {
        id: 'reply_1',
        commentId: 'comment_1',
        userId: 'user_aria',
        username: 'aria_vance',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        text: 'Thanks Julian! It was 1/4s at f/8 with an ND filter. Golden hour was magical!',
        date: '2026-07-22T19:40:00Z',
        likesCount: 1,
        likes: ['user_julian']
      }
    ]
  },
  {
    id: 'comment_2',
    photoId: 'photo_1',
    userId: 'user_elena',
    username: 'urban_arch',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    text: 'The framing of the traditional eaves against the sky is pure harmony.',
    date: '2026-07-22T20:12:00Z',
    likesCount: 1,
    likes: ['user_aria'],
    replies: []
  },
  {
    id: 'comment_3',
    photoId: 'photo_2',
    userId: 'user_aria',
    username: 'aria_vance',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    text: 'The clarity of that water mirror is insane! Looks almost surreal.',
    date: '2026-07-21T15:02:00Z',
    likesCount: 1,
    likes: ['user_julian'],
    replies: []
  },
  {
    id: 'comment_4',
    photoId: 'photo_3',
    userId: 'user_admin',
    username: 'admin_master',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    text: 'Exquisite architectural composition. Featured in SnapVerse Weekly Highlights!',
    date: '2026-07-20T10:05:00Z',
    likesCount: 2,
    likes: ['user_elena', 'user_aria'],
    replies: []
  },
  {
    id: 'comment_5',
    photoId: 'photo_4',
    userId: 'user_aria',
    username: 'aria_vance',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    text: 'The dark skies in NZ are truly second to none. Amazing star tracker work Lucas!',
    date: '2026-07-20T00:32:00Z',
    likesCount: 1,
    likes: ['user_lucas'],
    replies: []
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    recipientUserId: 'user_aria',
    actorUserId: 'user_julian',
    actorUsername: 'nature_captures',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    type: 'like',
    photoId: 'photo_1',
    photoTitle: 'Kyoto Golden Twilight Pagoda',
    photoThumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80',
    text: 'liked your photo "Kyoto Golden Twilight Pagoda"',
    date: '2026-07-22T19:15:00Z',
    read: false
  },
  {
    id: 'notif_2',
    recipientUserId: 'user_aria',
    actorUserId: 'user_julian',
    actorUsername: 'nature_captures',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    type: 'comment',
    photoId: 'photo_1',
    photoTitle: 'Kyoto Golden Twilight Pagoda',
    photoThumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80',
    text: 'commented: "Breathtaking colors Aria! What shutter speed did you use..."',
    date: '2026-07-22T19:15:00Z',
    read: false
  },
  {
    id: 'notif_3',
    recipientUserId: 'user_julian',
    actorUserId: 'user_elena',
    actorUsername: 'urban_arch',
    actorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    type: 'dislike',
    photoId: 'photo_2',
    photoTitle: 'Emerald Alpine Mirror Lake',
    photoThumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    text: 'disliked your photo "Emerald Alpine Mirror Lake"',
    date: '2026-07-21T17:00:00Z',
    read: true
  }
];
