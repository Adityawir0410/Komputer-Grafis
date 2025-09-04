"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import HUD from './HUD';
import QuizModal from './QuizModal';

export default function Pos2() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { setCurrentPos } = useTour();

  // Set current pos when component mounts
  useEffect(() => {
    setCurrentPos(2);
  }, [setCurrentPos]);

  return (
    <>
      {/* VR Content */}
      <a-box 
        position="0 1 -3" 
        rotation="0 45 0" 
        color="#059669"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
      >
        <a-text 
          value="POS 2" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      <a-cylinder 
        position="2 1 -2" 
        radius="0.5" 
        height="1" 
        color="#10B981"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
      ></a-cylinder>

      <a-octahedron 
        position="-2 1 -2" 
        radius="0.6" 
        color="#F59E0B"
        animation="property: position; to: -2 2.5 -2; dir: alternate; loop: true; dur: 2500"
      ></a-octahedron>

      <a-plane 
        position="0 0.5 -4" 
        width="2" 
        height="2" 
        color="#3B82F6"
        animation="property: rotation; to: 0 0 360; loop: true; dur: 5000"
      ></a-plane>

      <a-text 
        value="Pos 2: Area Interaktif\nLihat objek-objek yang bergerak!" 
        position="0 2.5 -1" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      {/* HUD Overlay */}
      <HUD onQuizClick={() => setShowQuiz(true)} />

      {/* Quiz Modal */}
      <QuizModal 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        posId={2}
      />
    </>
  );
}