"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import { useRouter } from 'next/navigation';
import VRNavigation from './VRNavigation';

export default function Pos7() {
  const { setCurrentPos, quizPositions, quizCompleted } = useTour();
  const router = useRouter();

  useEffect(() => {
    setCurrentPos(7);
  }, [setCurrentPos]);

  const allQuizzesComplete = quizPositions.every(pos => quizCompleted[pos]);
  const canFinishTour = allQuizzesComplete && Object.keys(quizCompleted).length >= quizPositions.length;

  return (
    <>
      {/* Main Pos 7 Box */}
      <a-box 
        position="0 1 -5" 
        rotation="0 45 0" 
        color="#DC2626"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
        shadow="cast: true"
      >
        <a-text 
          value="POS 7" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      {/* Victory Elements */}
      <a-cone 
        position="0 1 -6" 
        radius-bottom="0.8" 
        height="1.5" 
        color="#F59E0B"
        animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 1500"
        shadow="cast: true"
      ></a-cone>

      <a-dodecahedron 
        position="-3 1 -4" 
        radius="0.6" 
        color="#EC4899"
        animation="property: rotation; to: 360 360 0; loop: true; dur: 6000"
        shadow="cast: true"
      ></a-dodecahedron>

      <a-icosahedron 
        position="3 1 -4" 
        radius="0.5" 
        color="#06B6D4"
        animation="property: position; to: 3 2.5 -4; dir: alternate; loop: true; dur: 1800"
        shadow="cast: true"
      ></a-icosahedron>

      <a-text 
        value="Pos 7: Final Destination\nSelamat! Anda telah menyelesaikan tour!" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      <VRNavigation currentPosId={7} maxPos={7} />

      {/* Completion message */}
      {canFinishTour ? (
        <a-text 
          value="All quizzes completed!\nLook right for the finish button." 
          position="0 2 -2" 
          align="center" 
          color="#10B981"
          width="6"
          animation="property: scale; to: 1.05 1.05 1.05; dir: alternate; loop: true; dur: 2000"
        ></a-text>
      ) : (
        <a-text 
          value="Complete all quizzes (Pos 2, 3, 5) to finish the tour!" 
          position="0 2 -2" 
          align="center" 
          color="#DC2626"
          width="6"
          animation="property: scale; to: 1.05 1.05 1.05; dir: alternate; loop: true; dur: 1500"
        ></a-text>
      )}
    </>
  );
}
