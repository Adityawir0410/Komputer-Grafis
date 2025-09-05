"use client";
import { TourProvider } from './_context/TourContext';
import HUD from './_components/HUD';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
    <TourProvider>
      <div className="relative min-h-screen bg-gray-100">
        {/* Global HUD for VR pages */}
        {isVRPage && <HUD />}
        
        {children}
      </div>
    </TourProvider>
  );
}