"use client";
import { useRouter } from 'next/navigation';
import { useTour } from '../_context/TourContext';

export default function VRNavigation({ currentPosId, maxPos }) {
  const router = useRouter();
  const { quizCompleted, quizPositions } = useTour();

  const goToPrevious = () => {
    if (currentPosId > 1) {
      router.push(`/tour/pos/${currentPosId - 1}`);
    }
  };

  const goToNext = () => {
    if (currentPosId < maxPos) {
      router.push(`/tour/pos/${currentPosId + 1}`);
    }
  };

  const goToFinish = () => {
    router.push('/tour/closing');
  };

  const canGoNext = currentPosId < maxPos;
  const canGoPrev = currentPosId > 1;
  
  // Check if tour can be finished (only at Pos 7)
  const allQuizzesComplete = quizPositions.every(pos => quizCompleted[pos]);
  const canFinish = allQuizzesComplete && Object.keys(quizCompleted).length >= quizPositions.length && currentPosId === maxPos;

  return (
    <>
      {/* Left Navigation Button (Previous) */}
      {canGoPrev && (
        <a-entity position="-1.5 0.8 0.5">
          <a-cylinder
            position="0 0 0"
            radius="0.25"
            height="0.08"
            color="#374151"
            class="clickable"
            onClick={goToPrevious}
            animation="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; endEvents: mouseleave; dur: 200"
          >
            <a-text
              value="←"
              position="0 0 0.05"
              align="center"
              color="white"
              width="10"
            ></a-text>
          </a-cylinder>
          
          <a-cylinder
            position="0 0 -0.01"
            radius="0.3"
            height="0.04"
            color="#4B5563"
            opacity="0"
            animation="property: opacity; to: 0.8; startEvents: mouseenter; endEvents: mouseleave; dur: 200"
          ></a-cylinder>

          <a-text
            value={`POS ${currentPosId - 1}`}
            position="0 -0.4 0"
            align="center"
            color="#6B7280"
            width="3"
          ></a-text>
        </a-entity>
      )}

      {/* Right Navigation Button (Next or Finish) */}
      {(canGoNext || canFinish) && (
        <a-entity position="1.5 0.8 0.5">
          <a-cylinder
            position="0 0 0"
            radius="0.25"
            height="0.08"
            color={canFinish ? "#10B981" : "#374151"}
            class="clickable"
            onClick={canFinish ? goToFinish : goToNext}
            animation="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; endEvents: mouseleave; dur: 200"
          >
            <a-text
              value={canFinish ? "🏁" : "→"}
              position="0 0 0.05"
              align="center"
              color="white"
              width="10"
            ></a-text>
          </a-cylinder>
          
          <a-cylinder
            position="0 0 -0.01"
            radius="0.3"
            height="0.04"
            color={canFinish ? "#059669" : "#4B5563"}
            opacity="0"
            animation="property: opacity; to: 0.8; startEvents: mouseenter; endEvents: mouseleave; dur: 200"
          ></a-cylinder>

          <a-text
            value={canFinish ? "FINISH" : `POS ${currentPosId + 1}`}
            position="0 -0.4 0"
            align="center"
            color={canFinish ? "#10B981" : "#6B7280"}
            width="3"
          ></a-text>
        </a-entity>
      )}

      {/* Current Position Indicator */}
      <a-entity position="0 0.2 -0.5">
        <a-plane
          position="0 0 0"
          width="2.0"
          height="0.3"
          color="#1F2937"
          opacity="0.85"
        ></a-plane>

        <a-text
          value={`POS ${currentPosId} / ${maxPos}`}
          position="0 0 0.01"
          align="center"
          color="white"
          width="5"
        ></a-text>

        <a-entity position="0 -0.1 0.01">
          {Array.from({ length: maxPos }, (_, i) => {
            const posNum = i + 1;
            const xPos = (i - (maxPos - 1) / 2) * 0.2; // Reduced spacing for 7 positions
            
            return (
              <a-circle
                key={posNum}
                position={`${xPos} 0 0`}
                radius="0.03"
                color={posNum <= currentPosId ? "#3B82F6" : "#6B7280"}
              ></a-circle>
            );
          })}
        </a-entity>
      </a-entity>

      {/* Navigation Instructions */}
      <a-text
        value={canFinish ? "All complete! Click finish when ready →" : "← → Click to navigate"}
        position="0 0.5 -0.8"
        align="center"
        color={canFinish ? "#10B981" : "#6B7280"}
        width="3"
        opacity="0.6"
      ></a-text>
    </>
  );
}
//       <a-text
//         value={canFinish ? "All complete! Click finish when ready →" : "← → Click to navigate"}
//         position="0 0.5 -0.8"
//         align="center"
//         color={canFinish ? "#10B981" : "#6B7280"}
//         width="3"
//         opacity="0.6"
//       ></a-text>
//     </>
//   );
// }
