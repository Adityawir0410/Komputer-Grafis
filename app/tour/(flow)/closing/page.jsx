"use client";
import Link from "next/link";
import { useTour } from "../../_context/TourContext";
import { useAuth } from "../../../_context/AuthContext";
import { useEffect, useState, useRef } from "react"; // 1. Import useRef

export default function ClosingPage() {
  const { totalScore, completeTourAndReset, formatTime, timeRemaining } = useTour();
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState('pending');
  
  // 2. Buat useRef sebagai penanda
  const hasSaved = useRef(false); 

  useEffect(() => {
    const saveResult = async () => {
      // 3. Tambahkan kondisi untuk memeriksa penanda
      if (user && !hasSaved.current) { 
        // 4. Set penanda menjadi true agar tidak berjalan lagi
        hasSaved.current = true; 
        
        setSaveStatus('saving');
        try {
          const response = await fetch('/api/tour/save-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: user.fullName,
              nim: user.nim,
              faculty: user.fakultas,
              studyProgram: user.programStudi,
              total_score: totalScore,
              final_time_seconds: timeRemaining,
            }),
          });
          
          if (!response.ok) throw new Error('Gagal mengirim data');
          
          setSaveStatus('success');
          console.log('Hasil berhasil disimpan!');

        } catch (error) {
          setSaveStatus('error');
          console.error('Gagal menyimpan hasil:', error);
        }
      }
    };

    saveResult();
    
  // Hilangkan saveStatus dari dependency array agar tidak memicu eksekusi ulang
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, totalScore, timeRemaining]);

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
              <p className="text-gray-500">Waktu Final</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
        </div>

        <Link 
          href="/" 
          onClick={handleReturnHome}
          className="inline-block w-full rounded-lg bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors font-medium"
        >
          Kembali ke Home
        </Link>
        
        <div className="text-xs text-gray-500 mt-4">
          {saveStatus === 'saving' && <p>Menyimpan hasil Anda...</p>}
          {saveStatus === 'success' && <p className="text-green-600">Hasil Anda telah disimpan.</p>}
          {saveStatus === 'error' && <p className="text-red-600">Gagal menyimpan hasil.</p>}
          <p className="mt-2">* Data tour akan direset untuk pengalaman baru</p>
        </div>
      </div>
    </main>
  );
}