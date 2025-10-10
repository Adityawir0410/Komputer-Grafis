// File: app/tour/(flow)/closing/page.jsx

"use client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTour } from "../../_context/TourContext";
import { useAuth } from "../../../_context/AuthContext";
import { useEffect, useRef, useState } from "react";
import VRLoading from "../../_components/VRLoading";
import PointerOverlay from "../../_components/PointerOverlay";

const AFrameWrapper = dynamic(
  () => import('../../../_components/AFrameWrapper'),
  { ssr: false, loading: () => <VRLoading /> }
);

export default function ClosingPage() {
  // ... (semua logika hooks Anda tetap sama)
  const { totalScore, completeTourAndReset, formatTime, timeRemaining, setIsCenterPointerMode } = useTour();
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState('pending');
  const router = useRouter();
  const hasSaved = useRef(false);

  useEffect(() => {
    // ... (logika useEffect Anda tetap sama)
    const saveResult = async () => {
      if (user && !hasSaved.current) {
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
        } catch (error) {
          setSaveStatus('error');
          console.error('Gagal menyimpan hasil:', error);
        }
      }
    };
    saveResult();
  }, [user, totalScore, timeRemaining]);

  // Default: enable center pointer mode on Closing page
  useEffect(() => {
    setIsCenterPointerMode(true);
    return () => setIsCenterPointerMode(false);
  }, [setIsCenterPointerMode]);

  const handleReturnHome = () => {
    completeTourAndReset();
    router.push('/');
  };

  return (
    <div className="w-screen h-screen">
      <audio
        src="/sounds/AudioSpeedUp/sfx_9_Closing.mp3"
        autoPlay
        preload="auto"
        playsInline
      />
      
      <AFrameWrapper>
        <PointerOverlay />
        <a-sky src="/images/360/loby-ipal-sier-360.jpg" rotation="0 -80 0" color="#ECEFF1" />
        <a-entity position="0 1.8 -3">
          
          <a-plane
            position="0 0 -0.05"
            width="4"
            height="3.5"
            color="#FFFFFF"
            opacity="0.9"
            material="shader: flat"
          ></a-plane>

          <a-text
            value="Selamat!"
            position="0 1.2 0"
            align="center"
            color="#1F2937"
            width="6"
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
            scale="1.2 1.2 1.2"
          ></a-text>
          
          {/* ✅ Posisi Y digeser ke bawah untuk memberi jarak */}
          <a-text
            value="Anda telah menyelesaikan tour VR Wastewater Treatment Plant"
            position="0 0.6 0"
            align="center"
            color="#4B5563"
            width="3.5"
            wrap-count="40"
            scale="1.1 1.1 1.1"
          ></a-text>

          {/* ... (sisa kode dari garis pemisah ke bawah tidak diubah) ... */}
          <a-plane position="0 0.35 0" width="3.5" height="0.02" color="#E5E7EB"></a-plane>
          <a-entity position="0 -0.25 0">
            <a-text value="Total Score" position="-0.9 0.2 0" align="center" color="#6B7280" width="3.5"></a-text>
            <a-text value={totalScore} position="-0.9 -0.1 0" align="center" color="#10B981" width="7" font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
            <a-text value="Waktu Final" position="0.9 0.2 0" align="center" color="#6B7280" width="3.5"></a-text>
            <a-text value={formatTime(timeRemaining)} position="0.9 -0.1 0" align="center" color="#F59E0B" width="7" font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"></a-text>
          </a-entity>
          <a-entity position="0 -1.0 0" className="clickable" onClick={handleReturnHome}>
            <a-plane
              width="3"
              height="0.6"
              color="#2563EB"
              animation="property: scale; to: 1.05 1.05 1.05; startEvents: mouseenter; endEvents: mouseleave; dur: 200"
            ></a-plane>
            <a-text value="Kembali ke Home" align="center" color="white" width="6"></a-text>
          </a-entity>
        </a-entity>
      </AFrameWrapper>
    </div>
  );
}