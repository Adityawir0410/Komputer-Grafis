"use client";
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import { usePathname } from 'next/navigation';

export default function PointerOverlay() {
  const { currentPos } = useTour();
  const pathname = usePathname();

  // Cek apakah di halaman pos 1-6 atau closing
  const isPointerMode = pathname?.includes('/pos/') || pathname?.includes('/closing');

  useEffect(() => {
    // Pointer lock mode: hide cursor and lock pointer to control camera with mouse movement
    if (typeof document !== 'undefined' && isPointerMode) {
      const canvas = document.querySelector('canvas');
      const camera = document.querySelector('[camera]');
      
      if (canvas && camera) {
        // Hide system cursor
        document.body.style.cursor = 'none';
        
        // Request pointer lock on canvas
        canvas.requestPointerLock = canvas.requestPointerLock || 
                                     canvas.mozRequestPointerLock || 
                                     canvas.webkitRequestPointerLock;
        //test
        const requestLock = () => {
          if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
          }
        };

        // Request lock when user clicks
        canvas.addEventListener('click', requestLock);
        
        // Handle mouse movement for camera control
        const handleMouseMove = (e) => {
          if (document.pointerLockElement === canvas) {
            const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
            const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
            
            // Get current camera rotation
            const rotation = camera.getAttribute('rotation');
            const sensitivity = 0.15; // Adjust sensitivity here
            
            // Update camera rotation based on mouse movement
            camera.setAttribute('rotation', {
              x: Math.max(-90, Math.min(90, rotation.x - movementY * sensitivity)),
              y: rotation.y - movementX * sensitivity,
              z: 0
            });
          }
        };

        document.addEventListener('mousemove', handleMouseMove);
        
        return () => {
          canvas.removeEventListener('click', requestLock);
          document.removeEventListener('mousemove', handleMouseMove);
          document.body.style.cursor = '';
          if (document.exitPointerLock) {
            document.exitPointerLock();
          }
        };
      }
    } else {
      // Not in pointer mode - ensure everything is cleaned up
      if (typeof document !== 'undefined') {
        document.body.style.cursor = '';
        if (document.exitPointerLock) {
          document.exitPointerLock();
        }
      }
    }
  }, [isPointerMode]);

  if (!isPointerMode) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Center reticle - stays in the middle with blue outline */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full border-2 border-white/90 shadow-[0_0_12px_rgba(59,130,246,0.8)] ring-2 ring-blue-500/60" />
      </div>
      {/* Helper hint */}
      <div className="absolute bottom-4 right-4 text-white/80 text-xs bg-black/60 rounded px-2 py-1">
        <div>Click canvas to enable mouse look</div>
        <div>Move mouse to look around</div>
        <div className="text-white/60 mt-1">Press ESC to release pointer</div>
      </div>
    </div>
  );
}


