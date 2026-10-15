import React, { useState } from 'react';
import { MediaAsset } from '../types';
import { X, Download, Edit3, Trash2, Check, Share2, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface MediaViewerModalProps {
  asset: MediaAsset | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  asset,
  onClose,
  onDelete,
  onRename
}) => {
  if (!asset) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(asset.title);
  const [copied, setCopied] = useState(false);

  const handleSaveTitle = () => {
    if (onRename && title.trim()) {
      onRename(asset.id, title.trim());
    }
    setIsEditing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(asset.public_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-dark-950/60">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-electric-500/10 text-electric-400 border border-electric-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-dark-800 border border-slate-700 px-3 py-1 text-sm rounded-lg text-white focus:outline-none focus:border-electric-500"
                  autoFocus
                />
                <button onClick={handleSaveTitle} className="text-emerald-400 hover:text-emerald-300">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-wide">{title}</h3>
                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-white transition">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-dark-950/40">
          {asset.asset_type === 'image' ? (
            <img
              src={asset.public_url}
              alt={asset.title}
              className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-glow-blue border border-slate-800"
            />
          ) : (
            <video
              src={asset.public_url}
              controls
              autoPlay
              loop
              className="max-h-[60vh] max-w-full rounded-2xl shadow-glow-violet border border-slate-800"
            />
          )}
        </div>

        {/* Modal Footer & Metadata */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-dark-950/80 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 max-w-md">
            {asset.prompt && (
              <p className="line-clamp-2 italic">
                <span className="text-electric-400 not-italic font-medium">Prompt:</span> "{asset.prompt}"
              </p>
            )}
            <div className="flex items-center gap-4 mt-1 text-slate-500">
              <span>{asset.mime_type}</span>
              <span>•</span>
              <span>{(asset.file_size / (1024 * 1024)).toFixed(2)} MB</span>
              <span>•</span>
              <span>{new Date(asset.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              onClick={handleShare}
            >
              {copied ? 'Copied' : 'Share'}
            </Button>

            <a href={asset.public_url} download={asset.title} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                Download
              </Button>
            </a>

            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  if (confirm(`Delete "${asset.title}" permanently?`)) {
                    onDelete(asset.id);
                    onClose();
                  }
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
