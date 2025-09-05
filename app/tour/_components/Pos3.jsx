"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import { useRouter } from 'next/navigation';
import VRQuizCard from './VRQuizCard';

export default function Pos3() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { setCurrentPos, quizCompleted, maxPos } = useTour();
  const router = useRouter();

  useEffect(() => {
    setCurrentPos(3);
  }, [setCurrentPos]);

  // Check if all quizzes are completed and redirect to closing
  useEffect(() => {
    const allQuizzesComplete = Array.from({ length: maxPos }, (_, i) => i + 1)
      .every(pos => quizCompleted[pos]);
    
    if (allQuizzesComplete && Object.keys(quizCompleted).length === maxPos) {
      // Delay redirect to allow user to see completion
      setTimeout(() => {
        router.push('/tour/closing');
      }, 3000);
    }
  }, [quizCompleted, maxPos, router]);

  return (
    <>
      {/* Main Pos 3 Box */}
      <a-box 
        position="0 1 -5" 
        rotation="0 45 0" 
        color="#DC2626"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
        shadow="cast: true"
      >
        <a-text 
          value="POS 3" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      {/* Victory Cone */}
      <a-cone 
        position="0 1 -6" 
        radius-bottom="0.8" 
        height="1.5" 
        color="#F59E0B"
        animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 1500"
        shadow="cast: true"
      ></a-cone>

      {/* Interactive Dodecahedron */}
      <a-dodecahedron 
        position="-3 1 -4" 
        radius="0.6" 
        color="#EC4899"
        animation="property: rotation; to: 360 360 0; loop: true; dur: 6000"
        shadow="cast: true"
      ></a-dodecahedron>

      {/* Interactive Icosahedron */}
      <a-icosahedron 
        position="3 1 -4" 
        radius="0.5" 
        color="#06B6D4"
        animation="property: position; to: 3 2.5 -4; dir: alternate; loop: true; dur: 1800"
        shadow="cast: true"
      ></a-icosahedron>

      {/* Final Destination Text */}
      <a-text 
        value="Pos 3: Final Destination\nSelamat! Anda telah menyelesaikan tour!" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      {/* Quiz Circle in VR */}
      <a-circle
        position="4 2 -3"
        radius="0.4"
        color={quizCompleted[3] ? "#10B981" : "#3B82F6"}
        class="clickable"
        onClick={() => !quizCompleted[3] && setShowQuiz(true)}
        animation={!quizCompleted[3] ? "property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 1000" : ""}
      >
        <a-text
          value={quizCompleted[3] ? "✓" : "?"}
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

      {/* VR Quiz Card */}
      <VRQuizCard 
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        posId={3}
        position="0 2 -4"
      />

      {/* Completion message when all quizzes done */}
      {Object.keys(quizCompleted).length === maxPos && (
        <a-text 
          value="Semua kuis selesai!\nAnda akan diarahkan ke halaman penutup..." 
          position="0 2 -2" 
          align="center" 
          color="#10B981"
          width="6"
          animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 1000"
        ></a-text>
      )}
    </>
  );
}

