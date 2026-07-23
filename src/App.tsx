import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PhotoCard } from './components/PhotoCard';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { ReactorsModal } from './components/ReactorsModal';
import { FollowersModal } from './components/FollowersModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AdminPanel } from './components/AdminPanel';
import { ProfileView } from './components/ProfileView';
import { SearchView } from './components/SearchView';
import { EditPhotoModal } from './components/EditPhotoModal';
import { Photo } from './types';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Compass, 
  Camera, 
  UserPlus, 
  Filter,
  Layers,
  Heart
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    photos, 
    currentUser, 
    activeTab, 
    setActiveTab, 
    activeUserProfileId, 
    closeUserProfile,
    users,
    toggleFollow,
    openUserProfile
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // Filter photos according to active tab and category
  let displayedPhotos = [...photos];

  if (activeTab === 'following') {
    if (currentUser) {
      displayedPhotos = photos.filter(p => currentUser.following.includes(p.userId) || p.userId === currentUser.id);
    } else {
      displayedPhotos = [];
    }
  }

  if (categoryFilter !== 'all') {
    displayedPhotos = displayedPhotos.filter(p => 
      p.tags.some(t => t.toLowerCase() === categoryFilter.toLowerCase()) ||
      p.title.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(categoryFilter.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-purple-500 selection:text-white">
      
      {/* Sticky Top Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* If viewing a specific user profile */}
        {activeUserProfileId ? (
          <ProfileView userId={activeUserProfileId} onBack={closeUserProfile} />
        ) : activeTab === 'search' ? (
          <SearchView />
        ) : (
          <div className="space-y-6">
            
            {/* Feed Control Header & Filter Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {activeTab === 'feed' && <span className="flex items-center gap-2"><Sparkles className="w-6 h-6 text-purple-600" /> Community Photo Feed</span>}
                  {activeTab === 'explore' && <span className="flex items-center gap-2"><Compass className="w-6 h-6 text-purple-600" /> Explore Trending Imagery</span>}
                  {activeTab === 'following' && <span className="flex items-center gap-2"><Users className="w-6 h-6 text-purple-600" /> Following Activity</span>}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Discover high-definition photography, react with likes or dislikes, and engage with creator stories.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Photos' },
                  { id: 'kyoto', label: '🇯🇵 Japan' },
                  { id: 'mountains', label: '🏔️ Mountains' },
                  { id: 'architecture', label: '🏛️ Architecture' },
                  { id: 'astrophotography', label: '🌌 Night Sky' },
                  { id: 'goldenhour', label: '🌅 Golden Hour' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                      categoryFilter === cat.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Empty Feed State */}
            {displayedPhotos.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No photos found in this view
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {activeTab === 'following'
                      ? 'Follow photographers to see their newest high-res photos here!'
                      : 'Try resetting your filter category or uploading a new photo.'}
                  </p>
                </div>

                {/* Suggested creators to follow if empty following tab */}
                {activeTab === 'following' && (
                  <div className="pt-4 max-w-md mx-auto space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Photographers:</div>
                    <div className="grid grid-cols-2 gap-3">
                      {users.filter(u => u.id !== currentUser?.id).slice(0, 4).map(u => (
                        <div key={u.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-2">
                          <button onClick={() => openUserProfile(u.id)} className="flex items-center gap-2 text-left truncate">
                            <img src={u.avatarUrl} alt={u.username} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">@{u.username}</div>
                              <div className="text-[10px] text-slate-400">{u.fullName}</div>
                            </div>
                          </button>
                          <button
                            onClick={() => toggleFollow(u.id)}
                            className="p-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Photo Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPhotos.map(photo => (
                  <PhotoCard 
                    key={photo.id} 
                    photo={photo} 
                    onEditPhoto={(p) => setEditingPhoto(p)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Modals & Overlays */}
      <PhotoUploadModal />
      <PhotoDetailModal />
      <ReactorsModal />
      <FollowersModal />
      <NotificationsModal />
      <AuthModal />
      <EditProfileModal />
      <AdminPanel />
      <EditPhotoModal photo={editingPhoto} onClose={() => setEditingPhoto(null)} />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
