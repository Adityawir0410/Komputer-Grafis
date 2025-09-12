"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRQuizCard from './VRQuizCard';
import VRNavigation from './VRNavigation';

export default function Pos5() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { setCurrentPos, quizCompleted } = useTour();

  useEffect(() => {
    setCurrentPos(5);
  }, [setCurrentPos]);

  return (
    <>
      {/* SFX: Pos 5 - Secondary Clarifier */}
      <audio
        src="/sounds/sfx_6_Secondary Clarifier.MP3"
        autoPlay
        preload="auto"
        playsInline
      />
      {/* Main Pos 5 Box */}
      <a-box 
        position="0 1 -5" 
        rotation="0 45 0" 
        color="#DB2777"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
        shadow="cast: true"
      >
        <a-text 
          value="POS 5" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      {/* Interactive Elements */}
      <a-dodecahedron 
        position="-3 1.5 -4" 
        radius="0.5" 
        color="#06B6D4"
        animation="property: position; to: -3 2.5 -4; dir: alternate; loop: true; dur: 2000"
        shadow="cast: true"
      ></a-dodecahedron>

      <a-capsule 
        position="3 1 -4" 
        radius="0.3"
        height="1.2" 
        color="#F59E0B"
        animation="property: rotation; to: 0 0 360; loop: true; dur: 5000"
        shadow="cast: true"
      ></a-capsule>

      <a-text 
        value="Pos 5: Secondary Clarifier Stage\nComplete the quiz to proceed!" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      {/* Quiz Circle in VR */}
      <a-circle
        position="4 2 -3"
        radius="0.4"
        color={quizCompleted[5] ? "#10B981" : "#3B82F6"}
        class="clickable"
        onClick={() => !quizCompleted[5] && setShowQuiz(true)}
        animation={!quizCompleted[5] ? "property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 1000" : ""}
      >
        <a-text
          value={quizCompleted[5] ? "✓" : "?"}
          position="0 0 0.01"
          align="center"
          color="white"
          width="8"
        ></a-text>
      </a-circle>

      <a-text
        value="QUIZ"
        position="4 1.3 -3"
        align="center"
        color="#1F2937"
        width="4"
      ></a-text>

      <VRQuizCard 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        posId={5}
        position="0 3.5 -3"
      />

      <VRNavigation currentPosId={5} maxPos={7} />
    </>
  );
}
