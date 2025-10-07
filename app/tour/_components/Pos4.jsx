// File: app/tour/_components/Pos4.jsx

"use client";
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRNavigation from './VRNavigation';

export default function Pos4() {
  // ✅ Ambil fungsi clearAudioTimer
  const { setCurrentPos, startAudioTimer, clearAudioTimer } = useTour();

  useEffect(() => {
    setCurrentPos(4);
    startAudioTimer(28); // Durasi untuk Pos 4

    // ✅ TAMBAHKAN CLEANUP FUNCTION untuk membersihkan timer
    return () => {
      clearAudioTimer();
    };
  }, []); // ✅ Pastikan dependency array kosong

  return (
    <>
      {/* Background 360 untuk Pos 4 */}
      <a-sky src="/images/360/pos4-360.jpg" rotation="0 -90 0" />
      
      {/* SFX: Pos 4 - Sludge Distribution */}
      <audio
        src="/sounds/sfx_5_sludge Distribution.MP3"
        autoPlay
        preload="auto"
        playsInline
      />

      {/* Wrapper untuk Judul */}
      <a-plane
        position="0 3 -3.05"
        width="5"
        height="1.2"
        color="#F3F4F6"
        opacity="0.85"
        material="side: double; transparent: true"
      ></a-plane>
      
      <a-text 
        value="POS 4\nSludge Distribution" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      {/* ✅ maxPos sudah benar */}
      <VRNavigation currentPosId={4} maxPos={6} />
    </>
  );
}