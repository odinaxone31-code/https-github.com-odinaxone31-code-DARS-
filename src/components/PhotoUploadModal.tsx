import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle, Sparkles, Check, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PhotoUploadModal: React.FC = () => {
  const { isUploadOpen, setIsUploadOpen, uploadPhoto } = useApp();

  const [imageSrc, setImageSrc] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait' | 'square'>('landscape');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [sepia, setSepia] = useState(0);

  if (!isUploadOpen) return null;

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);

    // Strict video check
    if (file.type.startsWith('video/') || /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(file.name)) {
      setErrorMessage('❌ Video uploads are strictly disabled on SnapVerse. Please select an image file (JPG, PNG, WEBP).');
      return;
    }

    // Strict image format check
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validImageTypes.includes(file.type) && !/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      setErrorMessage('Unsupported file format. Please upload JPG, PNG, or WEBP image files only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePresetSample = (sampleUrl: string, sampleTitle: string) => {
    setImageSrc(sampleUrl);
    setTitle(sampleTitle);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageSrc) {
      setErrorMessage('Please select or upload an image.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please provide a title for your photo.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, '').toLowerCase())
      .filter(t => t.length > 0);

    uploadPhoto({
      title: title.trim(),
      description: description.trim(),
      tags,
      imageUrl: imageSrc,
      aspectRatio
    });

    // Reset & close
    setImageSrc('');
    setTitle('');
    setDescription('');
    setTagsInput('');
    setErrorMessage(null);
    setIsUploadOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Upload New Photo
            </h2>
          </div>

          <button
            onClick={() => setIsUploadOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Image Upload Area */}
          {!imageSrc ? (
            <div className="space-y-4">
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl p-8 text-center transition bg-slate-50 dark:bg-slate-950/40 flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Drag and drop your image here, or browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supported formats: <strong className="text-slate-600 dark:text-slate-300">JPG, JPEG, PNG, WEBP</strong>
                </p>
                <p className="text-[11px] font-semibold text-rose-500 mt-1">
                  🚫 Videos are completely disabled
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="photo-file-input"
                />

                <label
                  htmlFor="photo-file-input"
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Select Image File
                </label>
              </div>

              {/* Or Paste Sample Image Preset */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Or pick a sample photography theme:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetSample('https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&auto=format&fit=crop&q=80', 'Golden Hour Feline')}
                    className="p-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 overflow-hidden text-left bg-slate-50 dark:bg-slate-950"
                  >
                    <img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&auto=format&fit=crop&q=80" alt="Preset 1" className="w-full h-20 object-cover rounded-lg" />
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block p-1 truncate">Golden Sunset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSample('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80', 'Tropical Coast Horizons')}
                    className="p-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 overflow-hidden text-left bg-slate-50 dark:bg-slate-950"
                  >
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80" alt="Preset 2" className="w-full h-20 object-cover rounded-lg" />
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block p-1 truncate">Ocean Waves</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSample('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80', 'Alpine Foggy Mountain Summit')}
                    className="p-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 overflow-hidden text-left bg-slate-50 dark:bg-slate-950"
                  >
                    <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=80" alt="Preset 3" className="w-full h-20 object-cover rounded-lg" />
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block p-1 truncate">Alpine Fog</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Filtered Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3]">
                <img
                  src={imageSrc}
                  alt="Preview"
                  className="w-full h-full object-cover transition"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) sepia(${sepia}%)`
                  }}
                />
                <button
                  type="button"
                  onClick={() => setImageSrc('')}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition"
                  title="Change image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Adjustments */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-2 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-500" />
                  Image Enhancement Filters:
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1">Brightness: {brightness}%</label>
                    <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-purple-600" />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1">Contrast: {contrast}%</label>
                    <input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-purple-600" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Photo Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Sunrise over Kyoto Pagoda"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Share the story behind this photograph..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hashtags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. nature, mountains, goldenhour, leica"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition"
            >
              Publish Photo
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
