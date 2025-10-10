// File: app/_components/LobbyScene.jsx
"use client";

export default function LobbyScene() {
    return (
        <div className="flex-grow h-screen">
            <a-scene embedded style={{ width: '100%', height: '100%' }}>
                <a-sky 
                    src="/images/360/loby-ftp-360.jpg" 
                    rotation="-10 -340 8" // Lebih noleh ke kanan lagi
                ></a-sky>
            </a-scene>
        </div>
    );
}