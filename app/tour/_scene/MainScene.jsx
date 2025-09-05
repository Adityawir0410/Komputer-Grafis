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

  useEffect(() => {
    // Ensure A-Frame is loaded
    if (typeof window !== "undefined") {
      const scene = document.querySelector("a-scene");
      if (scene) {
        scene.setAttribute("background", "color", "#87CEEB"); // Sky blue
      }
    }
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
        {/* Asset management */}
        <a-assets>
          <a-mixin
            id="ground-material"
            material="color: #4A5568; roughness: 0.8; metalness: 0.2"
          ></a-mixin>
        </a-assets>

        {/* Lighting */}
        <a-light type="ambient" color="#404040" intensity="0.4"></a-light>
        <a-light
          type="directional"
          position="2 4 5"
          color="#ffffff"
          intensity="0.8"
          shadow="cast: true"
        ></a-light>

        {/* Ground/Floor */}
        <a-plane
          position="0 0 0"
          rotation="-90 0 0"
          width="50"
          height="50"
          mixin="ground-material"
          shadow="receive: true"
        ></a-plane>

        {/* Grid pattern on ground for better depth perception */}
        <a-plane
          position="0 0.001 0"
          rotation="-90 0 0"
          width="50"
          height="50"
          material="color: #2D3748; opacity: 0.3; transparent: true"
          geometry="primitive: plane; segmentsWidth: 50; segmentsHeight: 50"
          wireframe="true"
        ></a-plane>

        {/* Invisible walls to prevent falling off */}
        <a-box
          position="25 2.5 0"
          width="0.1"
          height="5"
          depth="50"
          material="color: #ffffff; opacity: 0; transparent: true"
          visible="false"
        ></a-box>
        <a-box
          position="-25 2.5 0"
          width="0.1"
          height="5"
          depth="50"
          material="color: #ffffff; opacity: 0; transparent: true"
          visible="false"
        ></a-box>
        <a-box
          position="0 2.5 25"
          width="50"
          height="5"
          depth="0.1"
          material="color: #ffffff; opacity: 0; transparent: true"
          visible="false"
        ></a-box>
        <a-box
          position="0 2.5 -25"
          width="50"
          height="5"
          depth="0.1"
          material="color: #ffffff; opacity: 0; transparent: true"
          visible="false"
        ></a-box>

        {/* Camera with controls */}
        <a-camera
          look-controls="enabled: true"
          wasd-controls="enabled: true; acceleration: 20"
          position="0 1.6 4"
          cursor="rayOrigin: mouse"
        ></a-camera>

        {/* VR Content */}
        {children}
      </a-scene>
    </div>
  );
}
