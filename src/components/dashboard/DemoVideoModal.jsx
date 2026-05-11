import React from "react";
import { X, Play } from "lucide-react";

export default function DemoVideoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white tracking-wide">EDS Sentrix ASM — Platform Demo</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video */}
        <div className="bg-black aspect-video">
          <video
            className="w-full h-full"
            src="http://googleusercontent.com/generated_video_content/8258293537408892841"
            controls
            autoPlay
            muted
            playsInline
          />
        </div>

        {/* Footer */}
        <div className="bg-slate-900 px-5 py-2.5 flex items-center justify-between border-t border-white/10">
          <span className="text-xs text-slate-500 font-mono">CONFIDENTIAL — EDS Internal Preview Build</span>
          <span className="text-xs text-amber-400 font-semibold">ZERO TRUST · NIST ALIGNED</span>
        </div>
      </div>
    </div>
  );
}