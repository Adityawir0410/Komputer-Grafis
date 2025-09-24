"use client";
import { useState } from "react";
import { useAuth } from "./_context/AuthContext";
import LoginModal from "./_components/LoginModal";
import ProfileModal from "./_components/ProfileModal";
import Sidebar from "./_components/Sidebar";
import MainContent from "./_components/MainContent";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleProfileConfirm = () => {
    setShowProfileModal(false);
    // Auto redirect to tour after profile confirmation
    setTimeout(() => {
      window.location.href = '/tour/briefing';
    }, 500);
  };

  return (
    <>
      {/* Main Container with background similar to SIER */}
      <div className="min-h-screen relative" style={{
        backgroundImage: 'url(/images/ipal-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content Container */}
        <div className="relative z-10 min-h-screen flex">
          {/* Sidebar Component */}
          <Sidebar 
            onLoginClick={handleLoginClick}
            onProfileClick={handleProfileClick}
          />

          {/* Main Content Component */}
          <MainContent />
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onConfirm={handleProfileConfirm}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}