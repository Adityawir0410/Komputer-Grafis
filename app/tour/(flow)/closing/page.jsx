// app/tour/(flow)/closing/page.jsx
"use client";
import Link from "next/link";
import { useTour } from "../../_context/TourContext";
import { useEffect } from "react";

export default function ClosingPage() {
  const { totalScore, completeTourAndReset, formatTime, timeRemaining, timerFrozen } = useTour();

  const handleReturnHome = () => {
    completeTourAndReset();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat!
          </h1>
          <p className="text-gray-600">
            Anda telah menyelesaikan tour VR Wastewater Treatment Plant
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Hasil Tour Anda:
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Score</p>
              <p className="text-2xl font-bold text-green-600">{totalScore}</p>
            </div>
            <div>
              <p className="text-gray-500">
                Waktu {timerFrozen ? "Final" : "Tersisa"}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {formatTime(timeRemaining)}
                {timerFrozen && <span className="text-sm ml-1">⏸</span>}
              </p>
            </div>
          </div>
          {timerFrozen && (
            <p className="text-xs text-gray-500 mt-2">
              ⏸ Waktu dibekukan saat tour selesai
            </p>
          )}
        </div>

        <Link 
          href="/" 
          onClick={handleReturnHome}
          className="inline-block w-full rounded-lg bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors font-medium"
        >
          Kembali ke Home
        </Link>
        
        <p className="text-xs text-gray-500 mt-4">
          * Data tour akan direset untuk pengalaman baru
        </p>
      </div>
    </main>
  );
}
