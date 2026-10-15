import React, { useState, useEffect } from 'react';
import { mockStorage } from '../lib/mockStorage';
import { MediaAsset } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { MediaViewerModal } from '../components/MediaViewerModal';
import {
  FolderHeart,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Maximize2,
  SlidersHorizontal,
  Image,
  Video,
  Film
} from 'lucide-react';

export const MyCreations: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    setAssets(mockStorage.getAssets());
  }, []);

  const handleDelete = (id: string) => {
    mockStorage.deleteAsset(id);
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleRename = (id: string, newTitle: string) => {
    mockStorage.renameAsset(id, newTitle);
    setAssets(prev => prev.map(a => a.id === id ? { ...a, title: newTitle } : a));
  };

  const filteredAssets = assets
    .filter((a) => {
      if (filterType !== 'all' && a.asset_type !== filterType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesPrompt = a.prompt?.toLowerCase().includes(query);
        return matchesTitle || matchesPrompt;
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-2">
            <FolderHeart className="w-3.5 h-3.5" />
            Media Storage Library
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            My Creations Cloud
          </h1>
          <p className="text-sm text-slate-400">
            Browse, filter, organize, and export all your generated visual art, animations, and edited assets.
          </p>
        </div>

        {/* View Mode & Filter Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-dark-900 border border-slate-800 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${viewMode === 'grid' ? 'bg-electric-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition ${viewMode === 'list' ? 'bg-electric-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or prompt..."
            className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Asset Type Filter Tabs */}
          <div className="flex rounded-xl bg-dark-950 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Assets ({assets.length})
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === 'image' ? 'bg-electric-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Images ({assets.filter(a => a.asset_type === 'image').length})
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === 'video' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Videos ({assets.filter(a => a.asset_type === 'video').length})
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </GlassCard>

      {/* Asset Display */}
      {filteredAssets.length === 0 ? (
        <GlassCard className="p-16 text-center">
          <FolderHeart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Media Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or generate new media using the Image or Video Studios.
          </p>
        </GlassCard>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <GlassCard
              key={asset.id}
              className="p-3 group overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-52 rounded-xl overflow-hidden mb-3 bg-dark-950">
                {asset.asset_type === 'image' ? (
                  <img
                    src={asset.public_url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setActiveAsset(asset)}
                  />
                ) : (
                  <video
                    src={asset.public_url}
                    className="w-full h-full object-cover cursor-pointer"
                    muted
                    loop
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause();
                      v.currentTime = 0;
                    }}
                    onClick={() => setActiveAsset(asset)}
                  />
                )}

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-dark-950/80 backdrop-blur border border-slate-700 text-slate-300 uppercase">
                  {asset.asset_type}
                </span>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveAsset(asset)}
                    className="p-1.5 rounded-lg bg-dark-950/80 backdrop-blur text-white hover:text-cyan-400 border border-slate-700"
                    title="Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={asset.public_url}
                    download={asset.title}
                    className="p-1.5 rounded-lg bg-dark-950/80 backdrop-blur text-white hover:text-emerald-400 border border-slate-700"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${asset.title}"?`)) handleDelete(asset.id);
                    }}
                    className="p-1.5 rounded-lg bg-dark-950/80 backdrop-blur text-white hover:text-rose-400 border border-slate-700"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white truncate mb-1">{asset.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{(asset.file_size / (1024 * 1024)).toFixed(1)} MB</span>
                  <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredAssets.map((asset) => (
            <GlassCard
              key={asset.id}
              className="p-4 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-dark-950 shrink-0 border border-slate-800">
                  {asset.asset_type === 'image' ? (
                    <img src={asset.public_url} alt={asset.title} className="w-full h-full object-cover" />
                  ) : (
                    <video src={asset.public_url} className="w-full h-full object-cover" muted />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{asset.title}</h4>
                  <p className="text-xs text-slate-400 truncate italic">{asset.prompt || 'Manual canvas edit'}</p>
                  <div className="text-[10px] text-slate-500 flex gap-3 mt-1 uppercase font-semibold">
                    <span>{asset.asset_type}</span>
                    <span>•</span>
                    <span>{(asset.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => setActiveAsset(asset)}>
                  Preview
                </Button>
                <a href={asset.public_url} download={asset.title}>
                  <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                    Download
                  </Button>
                </a>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${asset.title}"?`)) handleDelete(asset.id);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <MediaViewerModal
        asset={activeAsset}
        onClose={() => setActiveAsset(null)}
        onDelete={handleDelete}
        onRename={handleRename}
      />
    </div>
  );
};
