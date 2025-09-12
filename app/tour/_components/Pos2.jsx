"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRQuizCard from './VRQuizCard';
import VRNavigation from './VRNavigation';

export default function Pos2() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { setCurrentPos, quizCompleted } = useTour();

  // Set current pos when component mounts
  useEffect(() => {
    setCurrentPos(2);
  }, [setCurrentPos]);

  return (
    <>
      {/* Main Pos 2 Box */}
      <a-box 
        position="0 1 -5" 
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

      {/* Interactive Cylinder */}
      <a-cylinder 
        position="3 1 -4" 
        radius="0.5" 
        height="1" 
        color="#10B981"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
      ></a-cylinder>

      {/* Interactive Octahedron */}
      <a-octahedron 
        position="-3 1 -4" 
        radius="0.6" 
        color="#F59E0B"
        animation="property: position; to: -3 2.5 -4; dir: alternate; loop: true; dur: 2500"
      ></a-octahedron>

      {/* Interactive Area Text */}
      {/* <a-text 
        value="Pos 2: Area Interaktif\nLihat objek-objek yang bergerak!" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text> */}

      {/* Quiz Circle in VR */}
      <a-circle
        position="4 2 -3"
        radius="0.4"
        color={quizCompleted[2] ? "#10B981" : "#3B82F6"}
        class="clickable"
        onClick={() => !quizCompleted[2] && setShowQuiz(true)}
        animation={!quizCompleted[2] ? "property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 1000" : ""}
      >
        <a-text
          value={quizCompleted[2] ? "✓" : "?"}
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

      {/* VR Quiz Card - Moved higher */}
      <VRQuizCard 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        posId={2}
        position="0 3.5 -3"
      />

      {/* VR Navigation - Updated maxPos to 7 */}
      <VRNavigation currentPosId={2} maxPos={7} />
    </>
  );
}