
"use client";
import VRNavigation from './VRNavigation';
import { useEffect } from 'react';
import { useTour } from '../_context/TourContext';

export default function Pos1() {
  const { setCurrentPos, startTimer, timerStarted } = useTour();

  useEffect(() => {
    setCurrentPos(1);
    if (!timerStarted) {
      startTimer();
    }
  }, [setCurrentPos, startTimer, timerStarted]);

  return (
    <>
      {/* Background 360 untuk Pos 1 */}
      <a-sky src="/images/360/pos1-360.jpg" rotation="-2 -80 0" />

      {/* Welcome Text dengan background */}
      <a-plane position="0 3 -3.05" width="6.5" height="1.1" color="#fff" opacity="0.75" material="side: double; transparent: true" />
      <a-text 
        value={"Selamat datang di Pos 1!\nIni adalah area pertama dalam tour VR.\nTimer dimulai sekarang!"}
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
        side="double"
      ></a-text>
      {/* Navigation Buttons */}
      <VRNavigation currentPosId={1} maxPos={7} />
    </>
  );
}
