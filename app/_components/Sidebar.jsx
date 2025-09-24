"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";
import { motion } from "framer-motion";
import { Menu, X, Play, User, LogOut, LogIn, Waves, Droplets, Zap } from "lucide-react";
import Image from "next/image";

export default function Sidebar({ onLoginClick, onProfileClick }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handlePlayClick = () => {
    router.push("/tour/briefing");
  };

  const sidebarVariants = {
    hidden: { x: -320 },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white bg-opacity-90 p-3 rounded-xl shadow-lg backdrop-blur-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-800" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800" />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`
          fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40
          w-80 h-screen bg-white bg-opacity-95 shadow-2xl flex flex-col backdrop-blur-md
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Close button for mobile */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Logo Section */}
        <motion.div 
          className="p-6 border-b border-gray-200 flex-shrink-0"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-center">
            <Image
              src="/images/Universitas Brawijaya.png"
              alt="Universitas Brawijaya"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">CLEANSCAPE</h1>
            <p className="text-sm text-gray-600 mt-1">Virtual Reality Experience</p>
            <p className="text-xs text-blue-600 mt-1">Universitas Brawijaya</p>
          </div>
        </motion.div>

        {/* Main Content Section - Takes remaining space */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* User Profile Section - Show when authenticated */}
          {isAuthenticated && user && (
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{user.fullName}</h3>
                <p className="text-blue-700 font-mono text-sm">{user.nim}</p>
                <p className="text-blue-600 text-sm">{user.fakultas}</p>
                <p className="text-gray-600 text-xs mt-1">{user.programStudi}</p>
              </div>
            </motion.div>
          )}

          {/* Info Section */}
          <div className="text-center text-gray-500">
            <h3 className="font-semibold text-lg mb-2">CleanScape VR</h3>
            <p className="text-sm mb-6">Pengalaman Virtual Reality untuk Pengolahan Air Limbah</p>
            
            {/* Simple info cards without excessive animations */}
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-center space-x-2">
                  <Waves className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 text-sm font-medium">8 Station Tour</span>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <div className="flex items-center justify-center space-x-2">
                  <Droplets className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 text-sm font-medium">VR Experience</span>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700 text-sm font-medium">Quiz System</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Fixed at bottom */}
        <motion.div 
          className="p-6 border-t border-gray-200 bg-white bg-opacity-95 flex-shrink-0"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-4">
            {/* Simple Play Button - Show only when authenticated */}
            {isAuthenticated && (
              <button
                onClick={handlePlayClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-4 rounded-xl transition-colors duration-200 font-bold text-lg shadow-md"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Play className="w-6 h-6" />
                  <span>MULAI TOUR VR</span>
                </div>
              </button>
            )}

            {/* Simple Login/Logout Buttons */}
            <div className="flex space-x-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onProfileClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>PROFILE</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>LOGOUT</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
