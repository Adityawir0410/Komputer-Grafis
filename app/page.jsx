// File: app/page.jsx

"use client";
import { useState } from "react";
import dynamic from "next/dynamic"; // <-- 1. Import 'dynamic'
import { useAuth } from "./_context/AuthContext";
import LoginModal from "./_components/LoginModal";
import ProfileModal from "./_components/ProfileModal";
import Sidebar from "./_components/Sidebar";

// 2. Impor komponen A-Frame secara dinamis (hanya render di client)
const LobbyScene = dynamic(
  () => import('./_components/LobbyScene'),
  { 
    ssr: false, // <-- Ini kuncinya
    loading: () => <div className="flex-grow h-screen bg-black" /> // Tampilan saat loading
  }
);

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleProfileClick = () => setShowProfileModal(true);
  const handleLoginSuccess = () => setShowLoginModal(false);
  const handleProfileConfirm = () => {
    setShowProfileModal(false);
    setTimeout(() => { window.location.href = '/tour/briefing'; }, 500);
  };

  return (
    <>
      <div className="min-h-screen flex">
        <Sidebar 
          onLoginClick={handleLoginClick}
          onProfileClick={handleProfileClick}
        />
        {/* 3. Panggil komponen yang sudah aman, bukan <MainContent> lagi */}
        <LobbyScene />
      </div>
      
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} onConfirm={handleProfileConfirm} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />
    </>
  );
}