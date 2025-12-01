"use client";
import { TourProvider } from './_context/TourContext';
import HUD from './_components/HUD';
import MiniMap from './_components/MiniMap';
import ProtectedRoute from '../_components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';

export default function TourLayout({ children }) {
  const [isVRPage, setIsVRPage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if current page is a VR position page
    const checkVRPage = () => {
      setIsVRPage(pathname?.includes('/pos/') || false);
    };

    checkVRPage();
  }, [pathname]);

  return (
    <ProtectedRoute>
      <TourProvider>
        <div className="relative min-h-screen bg-gray-100">
          {/* Global HUD for VR pages */}
          {isVRPage && <HUD />}
          
          {/* Mini Map for VR pages */}
          {isVRPage && <MiniMap />}
          
          {children}
        </div>
      </TourProvider>
    </ProtectedRoute>
  );
}

TourLayout.propTypes = {
  children: PropTypes.node.isRequired,
};