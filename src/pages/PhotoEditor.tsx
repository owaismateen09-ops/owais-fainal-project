import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStorage } from '../lib/mockStorage';
import { MediaAsset } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Undo2,
  Redo2,
  Download,
  Save,
  Upload,
  Check,
  Eye,
  ZoomIn,
  ZoomOut,
  RefreshCw
} from 'lucide-react';

interface FilterState {
  brightness: number; // 0 - 200 (100 is normal)
  contrast: number;   // 0 - 200 (100 is normal)
  saturation: number; // 0 - 200 (100 is normal)
  grayscale: number;  // 0 - 100
  sepia: number;      // 0 - 100
  blur: number;       // 0 - 20
  invert: number;     // 0 - 100
  rotation: number;   // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  zoom: number;       // 0.5 to 2.5
}

const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  invert: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  zoom: 1
};

export const PhotoEditor: React.FC = () => {
  const { user } = useAuth();
  const [imageSrc, setImageSrc] = useState<string>(
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80'
  );
  const [originalName, setOriginalName] = useState<string>('cyberpunk_city.jpg');

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [history, setHistory] = useState<FilterState[]>([DEFAULT_FILTERS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Load image element
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageElementRef.current = img;
      renderCanvas(filters);
    };
  }, [imageSrc]);

  // Re-render when filters change
  useEffect(() => {
    if (imageElementRef.current) {
      renderCanvas(showOriginal ? DEFAULT_FILTERS : filters);
    }
  }, [filters, showOriginal]);

  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newFilters);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFilters(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFilters(history[newIndex]);
    }
  };

  const resetAll = () => {
    updateFilters(DEFAULT_FILTERS);
  };

  const renderCanvas = (f: FilterState) => {
    const canvas = canvasRef.current;
    const img = imageElementRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isRotated90or270 = f.rotation === 90 || f.rotation === 270;
    const width = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
    const height = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply CSS-compatible canvas filters
    ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) grayscale(${f.grayscale}%) sepia(${f.sepia}%) blur(${f.blur}px) invert(${f.invert}%)`;

    // Position context at center for transforms
    ctx.translate(width / 2, height / 2);
    ctx.rotate((f.rotation * Math.PI) / 180);
    ctx.scale(f.flipH ? -1 : 1, f.flipV ? -1 : 1);

    // Draw image centered
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    ctx.restore();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setFilters(DEFAULT_FILTERS);
        setHistory([DEFAULT_FILTERS]);
        setHistoryIndex(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportImage = (format: 'image/png' | 'image/jpeg' = 'image/png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Real canvas data URL export containing actual edits!
    const dataUrl = canvas.toDataURL(format, 0.95);
    const link = document.createElement('a');
    link.download = `edited_${Date.now()}.${format === 'image/png' ? 'png' : 'jpg'}`;
    link.href = dataUrl;
    link.click();
  };

  const saveToMyCreations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const asset: MediaAsset = {
      id: 'asset_' + Date.now(),
      owner_id: user?.user_id || 'demo-user',
      asset_type: 'image',
      storage_path: `user-assets/edited_${Date.now()}.jpg`,
      public_url: dataUrl,
      mime_type: 'image/jpeg',
      file_size: Math.round(dataUrl.length * 0.75),
      width: canvas.width,
      height: canvas.height,
      title: `Edited - ${originalName.replace(/\.[^/.]+$/, '')}`,
      created_at: new Date().toISOString(),
      tags: ['Photo Editor', 'Canvas Edited']
    };

    mockStorage.saveAsset(asset);
    setSaveSuccess('Saved to My Creations successfully!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-2">
            <Crop className="w-3.5 h-3.5" />
            Canvas Photo Studio
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Non-Destructive Image Editor
          </h1>
          <p className="text-sm text-slate-400">
            Real-time HTML5 canvas pixel editing with filters, rotation, mirroring, undo/redo history, and export.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />}>
              Open Image
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </Button>
          </label>
          <Button variant="secondary" size="sm" icon={<Save className="w-4 h-4 text-cyan-400" />} onClick={saveToMyCreations}>
            Save to Creations
          </Button>
          <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => exportImage('image/png')}>
            Export PNG
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Canvas Preview Viewport */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <GlassCard className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center min-h-[480px] bg-dark-950/80 overflow-hidden relative">
            {/* Viewport Top Controls (Undo, Redo, Zoom, Before/After) */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              <div className="flex items-center gap-1 pointer-events-auto bg-dark-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={resetAll}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                  title="Reset All Adjustments"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition ${
                    showOriginal
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-dark-900/90 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                  title="Hold to preview original"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Hold for Before
                </button>
              </div>
            </div>

            {/* The Actual Canvas Element */}
            <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
              <canvas
                ref={canvasRef}
                style={{
                  transform: `scale(${filters.zoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease'
                }}
                className="max-h-[500px] max-w-full rounded-xl shadow-2xl border border-slate-800/80 object-contain"
              />
            </div>

            {/* Zoom Slider at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-dark-900/90 backdrop-blur-md border border-slate-800 text-xs text-slate-400">
              <button
                onClick={() => setFilters(f => ({ ...f, zoom: Math.max(0.5, f.zoom - 0.2) }))}
                className="hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-white text-[11px]">{Math.round(filters.zoom * 100)}%</span>
              <button
                onClick={() => setFilters(f => ({ ...f, zoom: Math.min(2.5, f.zoom + 0.2) }))}
                className="hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Controls & Filters */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 space-y-6">
            {/* Transform Controls (Rotate & Flip) */}
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Orientation & Transform
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => updateFilters({ ...filters, rotation: (filters.rotation + 270) % 360 })}
                  className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white flex flex-col items-center gap-1 transition"
                  title="Rotate Counter-Clockwise"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px]">-90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateFilters({ ...filters, rotation: (filters.rotation + 90) % 360 })}
                  className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white flex flex-col items-center gap-1 transition"
                  title="Rotate Clockwise"
                >
                  <RotateCw className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px]">+90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateFilters({ ...filters, flipH: !filters.flipH })}
                  className={`p-2.5 rounded-xl border text-slate-300 hover:text-white flex flex-col items-center gap-1 transition ${
                    filters.flipH ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-dark-950 border-slate-800'
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px]">Flip H</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateFilters({ ...filters, flipV: !filters.flipV })}
                  className={`p-2.5 rounded-xl border text-slate-300 hover:text-white flex flex-col items-center gap-1 transition ${
                    filters.flipV ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-dark-950 border-slate-800'
                  }`}
                  title="Flip Vertical"
                >
                  <FlipVertical className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px]">Flip V</span>
                </button>
              </div>
            </div>

            {/* Adjustment Sliders */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Color & Light Adjustments</span>
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              </h3>

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Brightness</span>
                  <span className="font-mono text-cyan-400">{filters.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={(e) => updateFilters({ ...filters, brightness: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Contrast</span>
                  <span className="font-mono text-cyan-400">{filters.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) => updateFilters({ ...filters, contrast: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Saturation</span>
                  <span className="font-mono text-cyan-400">{filters.saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.saturation}
                  onChange={(e) => updateFilters({ ...filters, saturation: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Grayscale */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Grayscale (B&W)</span>
                  <span className="font-mono text-cyan-400">{filters.grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.grayscale}
                  onChange={(e) => updateFilters({ ...filters, grayscale: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Sepia */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Sepia Tone</span>
                  <span className="font-mono text-cyan-400">{filters.sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.sepia}
                  onChange={(e) => updateFilters({ ...filters, sepia: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Gaussian Blur</span>
                  <span className="font-mono text-cyan-400">{filters.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={filters.blur}
                  onChange={(e) => updateFilters({ ...filters, blur: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 shadow-glow-cyan"
                onClick={() => exportImage('image/png')}
                icon={<Download className="w-4 h-4" />}
              >
                Download Edited PNG
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => exportImage('image/jpeg')}
              >
                Download JPEG (Compressed)
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
