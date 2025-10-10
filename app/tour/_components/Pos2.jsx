// File: app/tour/_components/Pos2.jsx

"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import VRQuizCard from './VRQuizCard';
import VRNavigation from './VRNavigation';

export default function Pos2() {
  const [showQuiz, setShowQuiz] = useState(false);
  // ✅ Ambil fungsi clearAudioTimer
  const { setCurrentPos, quizCompleted, startAudioTimer, clearAudioTimer } = useTour();

  useEffect(() => {
    setCurrentPos(2);
    startAudioTimer(22, 2); // Pass posId sebagai parameter kedua (durasi 22 detik)
    
    // ✅ TAMBAHKAN CLEANUP FUNCTION untuk membersihkan timer
    return () => {
      clearAudioTimer();
    };
  }, []); // ✅ Pastikan dependency array kosong agar hanya berjalan sekali

  return (
    <>
      {/* 360 Background for Pos 2 */}
      <a-sky src="/images/360/pos2-360.jpg" rotation="0 -90 0" />

      {/* Title elements wrapped in an entity for animation */}
      <a-entity scale={showQuiz ? "0 0 0" : "1 1 1"}>
        <a-animation attribute="scale" dur="300" ease="ease-in-out"></a-animation>
        <a-plane 
          position="0 3 -3.05" 
          width="6.0" 
          height="1.2" 
          color="#fff" 
          opacity="0.75" 
          material="side: double; transparent: true" 
        />
        <a-text 
          value={"Pos 2\nSedimentation I/Primary Settling Tank"}
          position="0 3 -3" 
          align="center" 
          color="#1F2937"
          width="5.5"
          side="double"
        ></a-text>
      </a-entity>
      
      {/* SFX: Pos 2 - Settling Tank */}
      <audio
        src="/sounds/AudioSpeedUp/sfx_3_Settling Tank.mp3"
        autoPlay
        preload="auto"
        playsInline
      />
      
      {/* Quiz Circle wrapped for positioning & rotation */}
      <a-entity position="4 1.5 -3" rotation="-10 -45 0">
        <a-circle
          position="0 0.4 0"
          radius="0.4"
          color={quizCompleted[2] ? "#10B981" : "#3B82F6"}
          className="clickable"
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
          position="0 -0.3 0"
          align="center"
          color="#1F2937"
          width="4"
        ></a-text>
      </a-entity>

      {/* VR Quiz Card */}
      <VRQuizCard 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        posId={2}
        position="0 3.5 -3"
      />

      {/* ✅ maxPos diubah menjadi 6 */}
      <VRNavigation currentPosId={2} maxPos={6} />
    </>
  );
}