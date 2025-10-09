// File: app/tour/_components/Pos5.jsx

"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRQuizCard from './VRQuizCard';
import VRNavigation from './VRNavigation';

export default function Pos5() {
  const [showQuiz, setShowQuiz] = useState(false);
  // ✅ Ambil fungsi clearAudioTimer
  const { setCurrentPos, quizCompleted, startAudioTimer, clearAudioTimer } = useTour();

  useEffect(() => {
    setCurrentPos(5);
    startAudioTimer(34, 5); // Pass posId sebagai parameter kedua

    // ✅ TAMBAHKAN CLEANUP FUNCTION untuk membersihkan timer
    return () => {
      clearAudioTimer();
    };
  }, []); // ✅ Pastikan dependency array kosong

  return (
    <>
      {/* 360 Background for Pos 5 */}
      <a-sky src="/images/360/pos5-360.jpg" rotation="18 149 20" />
      
      {/* SFX: Pos 5 - Secondary Clarifier */}
      <audio
        src="/sounds/sfx_6_Secondary Clarifier.MP3"
        autoPlay
        preload="auto"
        playsInline
      />
      
      {/* Title wrapped in an entity for animation */}
      <a-entity scale={showQuiz ? "0 0 0" : "1 1 1"}>
        <a-animation attribute="scale" dur="300" ease="ease-in-out"></a-animation>
        
        {/* Title Wrapper */}
        <a-plane 
          position="0 3 -3.05" 
          width="5.0" 
          height="1.2" 
          color="#F3F4F6" 
          opacity="0.85" 
          material="side: double; transparent: true" 
        />

        {/* Title Text */}
        <a-text 
          value="Pos 5\nSecondary Clarifier" 
          position="0 3 -3" 
          align="center" 
          color="#1F2937"
          width="6"
        ></a-text>
      </a-entity>

      {/* Quiz Circle wrapped for positioning & rotation */}
      <a-entity position="4 1.5 -3" rotation="-10 -45 0">
        <a-circle
          position="0 0.4 0"
          radius="0.4"
          color={quizCompleted[5] ? "#10B981" : "#3B82F6"}
          className="clickable"
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
          position="0 -0.3 0"
          align="center"
          color="#1F2937"
          width="4"
        ></a-text>
      </a-entity>

      {/* Quiz Card and Navigation Components */}
      <VRQuizCard 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        posId={5}
        position="0 3.5 -3"
      />
      
      {/* ✅ maxPos sudah benar */}
      <VRNavigation currentPosId={5} maxPos={6} />
    </>
  );
}