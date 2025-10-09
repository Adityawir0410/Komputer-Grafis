"use client";
import { useEffect, useCallback } from 'react';
import { useTour } from '../_context/TourContext';

export default function PointerOverlay() {
  const { isCenterPointerMode, setIsCenterPointerMode } = useTour();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Alt') {
      setIsCenterPointerMode(prev => !prev);
    }
  }, [setIsCenterPointerMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // Hide/show system cursor globally while in center-pointer mode
    if (typeof document !== 'undefined') {
      if (isCenterPointerMode) {
        document.body.style.cursor = 'none';
        // Try to acquire pointer lock for raw mouse movement
        const target = document.body || document.documentElement;
        if (target && target.requestPointerLock) {
          try { target.requestPointerLock(); } catch (e) { /* no-op */ }
        }
      } else {
        document.body.style.cursor = '';
        if (document.exitPointerLock) document.exitPointerLock();
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = '';
        if (document.exitPointerLock) document.exitPointerLock();
      }
    };
  }, [isCenterPointerMode]);

  if (!isCenterPointerMode) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Center reticle */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-4 h-4 rounded-full border-2 border-white/90 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>
      {/* Helper hint at bottom-right */}
      <div className="absolute bottom-4 right-4 text-white/80 text-xs bg-black/60 rounded px-2 py-1">
        ALT: toggle cursor / pointer
      </div>
    </div>
  );
}


