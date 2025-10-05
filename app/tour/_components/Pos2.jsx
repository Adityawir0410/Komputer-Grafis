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
      {/* Background 360 untuk Pos 2 */}
      <a-sky src="/images/360/pos2-360.jpg" rotation="0 -90 0" />

      {/* Welcome Text dengan background (seperti Pos 1) */}
      <a-plane position="0 3 -3.05" width="6.5" height="1.1" color="#fff" opacity="0.75" material="side: double; transparent: true" />
      <a-text 
        value={"Selamat datang di Pos 2!\nSilakan eksplorasi area ini dan lanjutkan tour VR."}
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
        side="double"
      ></a-text>
      
      {/* SFX: Pos 2 - Settling Tank */}
      <audio
        src="/sounds/sfx_3_Settling Tank.MP3"
        autoPlay
        preload="auto"
        playsInline
      />
      
      {/* ✅ SHAPE-SHAPE INI TELAH DIHILANGKAN:
        - <a-box> (Main Pos 2 Box)
        - <a-cylinder> (Interactive Cylinder)
        - <a-octahedron> (Interactive Octahedron)
      */}

      {/* Quiz Circle in VR (Ini tidak dihapus) */}
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

      {/* Teks Label Kuis */}
      <a-text
        value="QUIZ"
        position="4 1.3 -3"
        align="center"
        color="#1F2937"
        width="4"
      ></a-text>

      {/* VR Quiz Card */}
      <VRQuizCard 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        posId={2}
        position="0 3.5 -3"
      />

      {/* VR Navigation */}
      <VRNavigation currentPosId={2} maxPos={7} />
    </>
  );
}