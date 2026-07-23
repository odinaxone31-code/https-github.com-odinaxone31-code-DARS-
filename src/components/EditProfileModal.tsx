import React, { useState } from 'react';
import { X, User, Lock, Trash2, Check, AlertCircle, Camera, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EditProfileModal: React.FC = () => {
  const { 
    currentUser, 
    isEditProfileOpen, 
    setIsEditProfileOpen, 
    updateProfile, 
    changePassword, 
    deleteAccount 
  } = useApp();

  if (!isEditProfileOpen || !currentUser) return null;

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [country, setCountry] = useState(currentUser.country);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, '_'),
      bio: bio.trim(),
      country: country.trim(),
      avatarUrl
    });
    setSuccessMessage('Profile details updated successfully!');
    setTimeout(() => {
      setSuccessMessage(null);
      setIsEditProfileOpen(false);
    }, 1200);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters.');
      return;
    }
    changePassword(oldPassword, newPassword);
    setPasswordMessage('✓ Password changed successfully.');
    setOldPassword('');
    setNewPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm('CRITICAL WARNING: Are you sure you want to permanently delete your account? All your photos, comments, and data will be erased.')) {
      deleteAccount();
      setIsEditProfileOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Account & Profile Settings
          </h2>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" /> Password & Danger Zone
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto flex-1">
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" /> {successMessage}
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Profile Avatar Change */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                />
                <div>
                  <label htmlFor="avatar-file-upload" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                    Change Photo
                  </label>
                  <input
                    id="avatar-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Recommended square image, JPG or PNG.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="E.g. Japan, Germany, USA"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              
              {/* Change Password */}
              <form onSubmit={handleChangePassword} className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Change Account Password
                </h3>

                {passwordMessage && (
                  <div className="p-2.5 bg-purple-50 text-purple-700 font-semibold text-xs rounded-xl">
                    {passwordMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition"
                >
                  Update Password
                </button>
              </form>

              {/* Delete Account */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Danger Zone
                </h3>
                <p className="text-xs text-slate-500">
                  Deleting your account removes all your photos, comments, followers, and profile settings permanently.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete My Account Permanently
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
