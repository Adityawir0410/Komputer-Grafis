// File: app/_components/AFrameWrapper.jsx
"use client";

export default function AFrameWrapper({ children }) {
  return (
    <div className="w-screen h-screen">
        <a-scene
            embedded
            vr-mode-ui="enabled: false"
            style={{ height: "100%", width: "100%" }}
        >
            <a-camera position="0 1.6 0" cursor="rayOrigin: mouse"></a-camera>
            {children}
        </a-scene>
    </div>
  );
}