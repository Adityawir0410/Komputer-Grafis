"use client";
import { useState } from "react";
import { useAuth } from "./_context/AuthContext";
import LoginModal from "./_components/LoginModal";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleStartTour = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    // Redirect to tour after checking authentication
    window.location.href = '/tour/briefing';
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileModal(false);
  };

  return (
    <>
      {/* Main Game Lobby Interface */}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        
        {/* Left Sidebar - Menu */}
        <div className="absolute left-0 top-0 h-full w-80 bg-white/90 backdrop-blur-sm shadow-2xl border-r border-gray-200">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CLEANSCAPE</h1>
                <p className="text-sm text-gray-500">VR Experience</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4 space-y-2">
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium">
              🏠 MULAI &gt;
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200">
              🎓 WISATA SIER &gt;
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200">
              🏭 BANGUNAN PABRIK SIAP PAKAI &gt;
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200">
              🏢 SARANA INDUSTRI USAHA KECIL &gt;
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200">
              📦 LOGISTIK &gt;
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200">
              🏗️ FASILITAS &gt;
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200">
              🏆 ARENA OLAHRAGA SIER &gt;
            </button>
            <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200">
              💰 INVESTOR &gt;
            </button>
          </div>

          {/* Language/Auth Section */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="border-t border-gray-200 pt-4"></div>
            <div className="flex space-x-2">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Login
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    English
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-80 min-h-screen flex items-center justify-center relative">
          {/* Background Image or VR Preview */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20"></div>
          
          {/* Central Play Button */}
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">CLEANSCAPE VR</h1>
              <p className="text-xl text-gray-600 mb-8">Virtual Wastewater Treatment Plant Experience</p>
            </div>
            
            {/* Giant Play Button */}
            <button
              onClick={handleStartTour}
              className="group relative w-32 h-32 bg-white rounded-full shadow-2xl border-4 border-blue-500 hover:border-blue-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            >
              <svg 
                className="w-12 h-12 text-blue-500 group-hover:text-blue-600 ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
              
              {/* Pulsing animation */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse opacity-75"></div>
            </button>
            
            <p className="mt-6 text-lg text-gray-700 font-medium">
              {isAuthenticated ? 'Klik PLAY untuk memulai tour VR' : 'Login terlebih dahulu untuk memulai'}
            </p>
          </div>

          {/* Status indicators */}
          <div className="absolute top-8 right-8 space-y-4">
            {isAuthenticated && user && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Logged in as {user.fullName}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right Controls */}
        <div className="absolute bottom-6 right-6 flex space-x-4">
          <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Profile Modal */}
      {showProfileModal && isAuthenticated && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowProfileModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
                <p className="text-gray-500">{user.nim}</p>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-500">NIM</label>
                  <p className="text-gray-900 font-medium">{user.nim}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-gray-900 font-medium">{user.fullName}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-500">Fakultas</label>
                  <p className="text-gray-900 font-medium">{user.fakultas}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-500">Program Studi</label>
                  <p className="text-gray-900 font-medium">{user.programStudi}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
