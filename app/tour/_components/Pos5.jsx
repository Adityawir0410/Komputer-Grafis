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
      {/* Background 360 untuk Pos 5 */}
      <a-sky src="/images/360/pos5-360.jpg" rotation="18 149 20" />
      
      {/* SFX: Pos 5 - Secondary Clarifier */}
      <audio
        src="/sounds/sfx_6_Secondary Clarifier.MP3"
        autoPlay
        preload="auto"
        playsInline
      />
      
      {/* ✅ PEMBUNGKUS JUDUL DITAMBAHKAN DI SINI */}
      <a-plane 
        position="0 3 -3.05" 
        width="6.5" 
        height="1.1" 
        color="#fff" 
        opacity="0.75" 
        material="side: double; transparent: true" 
      />

      {/* Teks Judul */}
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

      {/* Teks Label Kuis */}
      <a-text
        value="QUIZ"
        position="4 1.3 -3"
        align="center"
        color="#1F2937"
        width="4"
      ></a-text>

      {/* Komponen Kartu Kuis dan Navigasi */}
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