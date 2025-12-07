// File: app/tour/_components/Pos1.jsx

"use client";
import VRNavigation from './VRNavigation';
import { useEffect, useRef } from 'react';
import { useTour } from '../_context/TourContext';

export default function Pos1() {
  const { setCurrentPos, startTimer, timerStarted, startAudioTimer, isAudioFinished, markAudioCompleted } = useTour();
  const audioRef = useRef(null);

  useEffect(() => {
    setCurrentPos(1);
    if (!timerStarted) {
      startTimer();
    }
    startAudioTimer(23, 1); // Pass posId sebagai parameter kedua (durasi 23 detik)

    // Play audio safely
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }

    return () => {
      // Cleanup: stop audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    
  // ✅ PERBAIKAN UTAMA: Pastikan useEffect hanya berjalan sekali saat komponen dimuat
  }, []);
  
  // Mark audio sebagai completed ketika audio selesai (untuk pos non-quiz)
  useEffect(() => {
    if (isAudioFinished) {
      console.log('Audio finished for Pos 1, marking audio as completed');
      markAudioCompleted(1);
    }
  }, [isAudioFinished]);

  return (
    <>
      {/* 360 Background for Pos 1 */}
      <a-sky src="/images/360/pos1-360.jpg" rotation="-2 -80 0" />

      {/* SFX: Pos 1 - Collection Tank */}
      <audio ref={audioRef} src="/sounds/AudioSpeedUp/sfx_2_Collection Tank.mp3" preload="auto" playsInline />

      <a-plane position="0 3 -3.05" width="5.5" height="1.2" color="#fff" opacity="0.75" material="side: double; transparent: true" />
      <a-text value={"Pos 1\nCollection Tank & Pumping Stage"} position="0 3 -3" align="center" color="#1F2937" width="6" side="double"></a-text>
      <VRNavigation currentPosId={1} maxPos={6} />
    </>
  );
}