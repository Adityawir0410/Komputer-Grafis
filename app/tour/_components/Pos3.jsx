"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';
import { useRouter } from 'next/navigation';
import VRQuizCard from './VRQuizCard';
import VRNavigation from './VRNavigation';

export default function Pos3() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { setCurrentPos, quizCompleted, quizPositions } = useTour();

  useEffect(() => {
    setCurrentPos(3);
  }, [setCurrentPos]);

  return (
    <>
    {/* Background 360 untuk Pos 3 */}
  <a-sky src="/images/360/pos3-360.jpg" rotation="0 -120 0" />
      {/* SFX: Pos 3 - Oxidation Ditch */}
      <audio
        src="/sounds/sfx_4_Oxidation Ditch.MP3"
        autoPlay
        preload="auto"
        playsInline
      />


      {/* Title Wrapper like Pos1 */}
      <a-box 
        position="0 3 -3.1" 
        width="3.5" 
        height="1.2" 
        depth="0.15" 
        color="#F3F4F6" 
        opacity="0.85" 
      ></a-box>
      <a-text 
        value="POS 3\nOxidation Ditch" 
        position="0 3 -3" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>

      {/* Quiz Circle in VR - This was missing! */}
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
        position="0 3.5 -3"
      />

      {/* VR Navigation - Updated maxPos to 7 */}
      <VRNavigation currentPosId={3} maxPos={7} />
    </>
  );
}
//       {/* VR Navigation */}
//       <VRNavigation currentPosId={3} maxPos={3} />

//       {/* Completion message when all quizzes done */}
//       {canFinishTour && (
//         <a-text 
//           value="All quizzes completed!\nLook right for the finish button." 
//           position="0 2 -2" 
//           align="center" 
//           color="#10B981"
//           width="6"
//           animation="property: scale; to: 1.05 1.05 1.05; dir: alternate; loop: true; dur: 2000"
//         ></a-text>
//       )}
//     </>
//   );
// }
            
