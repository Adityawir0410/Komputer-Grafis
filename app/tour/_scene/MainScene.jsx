"use client";
import { useEffect, useState } from "react";

export default function MainScene({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (typeof window !== "undefined") {
        // ⬇️ perbaiki path dan tambahkan .js
        await import("../_aframe/register.client");
        if (alive) setReady(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!ready) {
    return (
      <div
        className="w-full bg-gray-100"
        style={{ height: "calc(100vh - 56px)" }}
      />
    );
  }

  return (
    <div className="w-full" style={{ height: "calc(100vh - 56px)" }}>
      <a-scene
        embedded
        vr-mode-ui="enabled: true"
        renderer="antialias: true"
        background="color: #ECECEC"
      >
        <a-entity position="0 1.6 0">
          <a-camera 
            wasd-controls-enabled="true"
            look-controls-enabled="true"
            look-controls="pointerLockEnabled: false; reverseMouseDrag: false; reverseTouchDrag: false; touchEnabled: true; mouseEnabled: true"
            cursor="rayOrigin: mouse"
          ></a-camera>
        </a-entity>

        {children}

        <a-entity light="type: ambient; intensity: 0.6"></a-entity>
        <a-entity light="type: directional; intensity: 0.8" position="0 5 -2"></a-entity>
        <a-sky color="#f9fafb"></a-sky>
        <a-plane rotation="-90 0 0" width="30" height="30" color="#e5e7eb"></a-plane>
      </a-scene>
    </div>
  );
}
