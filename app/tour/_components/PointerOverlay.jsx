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

        // Handle mouse wheel for zoom (FOV control)
        const handleWheel = (e) => {
          e.preventDefault();
          
          // Get current FOV (convert to number)
          let currentFov = parseFloat(camera.getAttribute('fov')) || 80;
          
          // Adjust FOV based on scroll direction
          const zoomSpeed = 3;
          const delta = e.deltaY > 0 ? zoomSpeed : -zoomSpeed;
          
          // Calculate new FOV (smaller FOV = more zoom)
          let newFov = currentFov + delta;
          
          // Clamp FOV between safe range: 50 (zoomed in) and 90 (zoomed out)
          newFov = Math.max(50, Math.min(90, newFov));
          
          // Apply new FOV smoothly
          camera.setAttribute('camera', 'fov', newFov);
          camera.setAttribute('fov', newFov);
        };

        document.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
          canvas.removeEventListener('click', requestLock);
          document.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('wheel', handleWheel);
          document.body.style.cursor = '';
          if (document.exitPointerLock) {
            document.exitPointerLock();
          }
          // Reset FOV when leaving
          camera.setAttribute('camera', 'fov', 80);
          camera.setAttribute('fov', 80);
        };
      }
    } else {
      // Not in pointer mode - ensure everything is cleaned up
      if (typeof document !== 'undefined') {
        document.body.style.cursor = '';
        if (document.exitPointerLock) {
          document.exitPointerLock();
        }
        // Also reset FOV when exiting pointer mode
        const camera = document.querySelector('[camera]');
        if (camera) {
          camera.setAttribute('camera', 'fov', 80);
          camera.setAttribute('fov', 80);
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
        <div>Scroll wheel to zoom in/out</div>
        <div className="text-white/60 mt-1">Press ESC to release pointer</div>
      </div>
    </div>
  );
}


