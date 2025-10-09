"use client";
import { useTour } from "../tour/_context/TourContext";

export default function AFrameWrapper({ children }) {
  const { isCenterPointerMode } = useTour();
  return (
    <div className="w-screen h-screen">
        <a-scene
            embedded
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
            style={{ height: "100%", width: "100%" }}
        >
            {/* ✅ PERBAIKAN DI SINI: wasd-controls="enabled: false" */}
            <a-camera
                look-controls={`enabled: true; pointerLockEnabled: ${isCenterPointerMode}`}
                wasd-controls="enabled: false" 
                position="0 1.6 0"
                cursor={`rayOrigin: ${isCenterPointerMode ? 'camera' : 'mouse'}; fuse: false`}
                raycaster="objects: .clickable; interval: 0; far: 50"
            ></a-camera>

            {/* Konten dari Pos1, Pos2, dll akan dirender di sini */}
            {children}
        </a-scene>
    </div>
  );
}