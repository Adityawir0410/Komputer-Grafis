"use client";
import { TourProvider } from './_context/TourContext';

export default function TourLayout({ children }) {
  return (
    <TourProvider>
      <div className="relative min-h-screen bg-gray-100">
        <header className="p-4 bg-gray-800 text-white">
          <h2 className="text-lg font-semibold">DEMO VR</h2>
        </header>
        {children}
      </div>
    </TourProvider>
  );
}