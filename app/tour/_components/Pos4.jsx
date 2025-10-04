"use client";
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRNavigation from './VRNavigation';

export default function Pos4() {
  const { setCurrentPos } = useTour();

  useEffect(() => {
    setCurrentPos(4);
  }, [setCurrentPos]);

  return (
    <>
    {/* Background 360 untuk Pos 4 */}
  <a-sky src="/images/360/pos4-360.jpg" rotation="0 -80 0" />
      {/* SFX: Pos 4 - Sludge Distribution */}
      <audio
        src="/sounds/sfx_5_sludge Distribution.MP3"
        autoPlay
        preload="auto"
        playsInline
      />
      {/* Main Pos 4 Box */}
      <a-box 
        position="0 1 -5" 
        rotation="0 45 0" 
        color="#7C3AED"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
        shadow="cast: true"
      >
        <a-text 
          value="POS 4" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>



      <a-text 
        value="Pos 4: Intermediate Stage\nThis position has no quiz - continue exploring!" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      <a-text 
        value="No quiz required here - proceed to the next position!" 
        position="0 1.8 -3" 
        align="center" 
        color="#7C3AED"
        width="5"
      ></a-text>

      <VRNavigation currentPosId={4} maxPos={7} />
    </>
  );
}
