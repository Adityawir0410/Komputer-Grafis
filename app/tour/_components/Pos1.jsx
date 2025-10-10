// File: app/tour/_components/Pos1.jsx

"use client";
import VRNavigation from './VRNavigation';
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';

export default function Pos1() {
  const { setCurrentPos, startTimer, timerStarted, startAudioTimer, isAudioFinished, markAudioCompleted } = useTour();

  useEffect(() => {
    setCurrentPos(1);
    if (!timerStarted) {
      startTimer();
    }
    startAudioTimer(29, 1); // Pass posId sebagai parameter kedua
    
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
      <audio src="/sounds/sfx_2_Collection Tank.MP3" autoPlay preload="auto" playsInline />

      <a-plane position="0 3 -3.05" width="5.5" height="1.2" color="#fff" opacity="0.75" material="side: double; transparent: true" />
      <a-text value={"Pos 1\nCollection Tank & Pumping Stage"} position="0 3 -3" align="center" color="#1F2937" width="6" side="double"></a-text>
      <VRNavigation currentPosId={1} maxPos={6} />
    </>
  );
}