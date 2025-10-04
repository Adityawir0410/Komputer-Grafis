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
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        {/* Camera tanpa WASD controls, hanya look-controls */}
        <a-camera
          look-controls="enabled: true"
          wasd-controls="enabled: false"
          position="0 1.6 0"
          cursor="rayOrigin: mouse"
        ></a-camera>

        {/* VR Content */}
        {children}
      </a-scene>
    </div>
  );
}
