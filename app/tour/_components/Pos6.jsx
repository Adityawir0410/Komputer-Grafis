// File: app/tour/_components/Pos6.jsx

"use client";
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRNavigation from './VRNavigation';

export default function Pos6() {
  // ✅ Ambil fungsi clearAudioTimer
  const { setCurrentPos, startAudioTimer, clearAudioTimer, isAudioFinished, markAudioCompleted } = useTour();

  useEffect(() => {
    setCurrentPos(6);
    startAudioTimer(31, 6); // Pass posId sebagai parameter kedua

    // ✅ TAMBAHKAN CLEANUP FUNCTION untuk membersihkan timer
    return () => {
      clearAudioTimer();
    };
  }, []); // ✅ Pastikan dependency array kosong
  
  // Mark audio sebagai completed ketika audio selesai (untuk pos non-quiz)
  useEffect(() => {
    if (isAudioFinished) {
      console.log('Audio finished for Pos 6, marking audio as completed');
      markAudioCompleted(6);
    }
  }, [isAudioFinished]);

  return (
    <>
      {/* 360 Background for Pos 6 */}
      <a-sky src="/images/360/pos6-360.jpg" rotation="-2 -80 30" />

      {/* SFX: Pos 6 - Effluent Tank */}
      <audio
        src="/sounds/sfx_7_Effluent Tank.MP3"
        autoPlay
        preload="auto"
        playsInline
      />
      
      {/* Title Block */}
      <a-plane
        position="0 3 -3.05"
        width="5.0"
        height="1.2"
        color="#F3F4F6"
        opacity="0.85"
        material="side: double; transparent: true"
      ></a-plane>
      
      <a-text 
        value="Pos 6\nEffluent Tank" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      {/* ✅ maxPos sudah benar */}
      <VRNavigation currentPosId={6} maxPos={6} />
    </>
  );
}