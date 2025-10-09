"use client";
import { useEffect, useCallback, useState } from 'react';
import { useTour } from '../_context/TourContext';

export default function PointerOverlay() {
  const { isCenterPointerMode, setIsCenterPointerMode } = useTour();
  const [isLocked, setIsLocked] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Alt') {
      setIsCenterPointerMode(prev => !prev);
    }
  }, [setIsCenterPointerMode]);

  const requestLock = useCallback(() => {
    if (!isCenterPointerMode) return;
    const target = document.body || document.documentElement;
    if (target.requestPointerLock) target.requestPointerLock();
  }, [isCenterPointerMode]);

  const updateLockState = useCallback(() => {
    const locked = typeof document !== 'undefined' && !!document.pointerLockElement;
    setIsLocked(locked);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerlockchange', updateLockState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerlockchange', updateLockState);
    };
  }, [handleKeyDown, updateLockState]);

  useEffect(() => {
    // Hide/show system cursor globally while in center-pointer mode
    if (typeof document !== 'undefined') {
      if (isCenterPointerMode) {
        document.body.style.cursor = 'none';
      } else {
        document.body.style.cursor = '';
        if (document.exitPointerLock) document.exitPointerLock();
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = '';
      }
    };
  }, [isCenterPointerMode]);

  if (!isCenterPointerMode) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Click-catcher to engage pointer lock when entering center mode */}
      {!isLocked && (
        <button
          type="button"
          className="absolute inset-0 w-full h-full bg-transparent"
          onClick={requestLock}
          aria-label="Engage pointer lock"
        />
      )}
      {/* Center reticle */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-4 h-4 rounded-full border-2 border-white/90 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>
      {/* Helper hint at bottom-right */}
      <div className="pointer-events-none absolute bottom-4 right-4 text-white/80 text-xs bg-black/60 rounded px-2 py-1">
        ALT: toggle cursor / pointer
      </div>
    </div>
  );
}


