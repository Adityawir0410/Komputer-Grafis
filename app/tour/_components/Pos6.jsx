"use client";
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRNavigation from './VRNavigation';

export default function Pos6() {
  const { setCurrentPos } = useTour();

  useEffect(() => {
    setCurrentPos(6);
  }, [setCurrentPos]);

  return (
    <>
      {/* Main Pos 6 Box */}
      <a-box 
        position="0 1 -5" 
        rotation="0 45 0" 
        color="#059669"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
        shadow="cast: true"
      >
        <a-text 
          value="POS 6" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      {/* Interactive Elements */}
      <a-triangle 
        position="-3 1 -4" 
        color="#F59E0B"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
        shadow="cast: true"
      ></a-triangle>

      <a-cylinder 
        position="3 1 -4" 
        radius="0.4"
        height="1.5" 
        color="#8B5CF6"
        animation="property: position; to: 3 2 -4; dir: alternate; loop: true; dur: 2500"
        shadow="cast: true"
      ></a-cylinder>

      <a-text 
        value="Pos 6: Final Processing\nAlmost at the end - no quiz here!" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      <a-text 
        value="Continue to the final position!" 
        position="0 1.8 -3" 
        align="center" 
        color="#059669"
        width="5"
      ></a-text>

      <VRNavigation currentPosId={6} maxPos={7} />
    </>
  );
}
