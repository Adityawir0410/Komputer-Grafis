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

      {/* Interactive Elements */}
      <a-tetrahedron 
        position="-3 1 -4" 
        radius="0.6" 
        color="#F59E0B"
        animation="property: rotation; to: 360 0 360; loop: true; dur: 4000"
        shadow="cast: true"
      ></a-tetrahedron>

      <a-ring 
        position="3 1 -4" 
        radius-inner="0.3"
        radius-outer="0.7" 
        color="#34D399"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
        shadow="cast: true"
      ></a-ring>

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
