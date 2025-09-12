"use client";
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRNavigation from './VRNavigation';

export default function Pos1() {
  const { setCurrentPos, startTimer, timerStarted } = useTour();

  useEffect(() => {
    setCurrentPos(1);
    
    // Start timer when reaching Pos 1 for the first time
    if (!timerStarted) {
      startTimer();
    }
  }, [setCurrentPos, startTimer, timerStarted]);

  return (
    <>
      {/* Main Pos 1 Box */}
      <a-box 
        position="0 1 -5" 
        rotation="0 45 0" 
        color="#4F46E5"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
        shadow="cast: true"
      >
        <a-text 
          value="POS 1" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      {/* Interactive Sphere */}
      <a-sphere 
        position="-3 1 -4" 
        radius="0.5" 
        color="#EF4444"
        animation="property: position; to: -3 2 -4; dir: alternate; loop: true; dur: 2000"
        shadow="cast: true"
      ></a-sphere>

      {/* Interactive Torus */}
      <a-torus 
        position="3 1 -4" 
        radius="0.8" 
        radius-tubular="0.2" 
        color="#8B5CF6"
        animation="property: rotation; to: 360 0 0; loop: true; dur: 4000"
        shadow="cast: true"
      ></a-torus>

      {/* Welcome Text */}
      <a-text 
        value="Selamat datang di Pos 1!\nIni adalah area pertama dalam tour VR.\nTimer dimulai sekarang!" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      {/* Timer start indicator */}
      <a-text 
        value="⏰ TIMER STARTED!" 
        position="0 2.3 -3" 
        align="center" 
        color="#10B981"
        width="5"
        animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 1000"
      ></a-text>

      {/* Navigation instruction */}
      <a-text 
        value="Lanjutkan ke Pos 2 untuk mulai quiz!" 
        position="0 1.8 -3" 
        align="center" 
        color="#6366F1"
        width="5"
      ></a-text>

      {/* VR Navigation - Updated maxPos to 7 */}
      <VRNavigation currentPosId={1} maxPos={7} />
    </>
  );
}