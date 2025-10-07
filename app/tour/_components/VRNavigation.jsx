// File: app/tour/_components/VRNavigation.jsx

"use client";
import { useRouter } from 'next/navigation';
import { useTour } from '../_context/TourContext';

export default function VRNavigation({ currentPosId, maxPos }) {
  const router = useRouter();
  const { quizCompleted, quizPositions, handleFinishTour, isAudioFinished } = useTour();

  // --- Semua Logika Tetap Sama ---
  const goToPrevious = () => { if (currentPosId > 1) router.push(`/tour/pos/${currentPosId - 1}`); };
  const goToNext = () => { if (currentPosId < maxPos) router.push(`/tour/pos/${currentPosId + 1}`); };
  const goToFinish = () => { handleFinishTour(); router.push('/tour/closing'); };
  const isQuizRequired = quizPositions.includes(currentPosId);
  const isCurrentQuizCompleted = quizCompleted[currentPosId];
  const isNextLocked = !isAudioFinished || (isQuizRequired && !isCurrentQuizCompleted);
  const canGoNext = currentPosId < maxPos;
  const canGoPrev = currentPosId > 1;
  const allQuizzesComplete = quizPositions.every(pos => quizCompleted[pos]);
  const canFinish = allQuizzesComplete && currentPosId === maxPos;

  return (
    // ✅ PERBAIKAN: Posisi Y digeser jauh ke bawah (-0.8), scale diperbesar menjadi 4.0
    <a-entity position="0 -3 1" scale="8.0 8.0 8.0">
      
      {/* Tombol Kiri (Previous) */}
      {canGoPrev && (
        <a-entity position="-1 -0.2 0.1" className="clickable" onClick={goToPrevious}>
          <a-cylinder
            position="0 0 0"
            radius="0.15"
            height="0.05"
            color="#374151"
            animation="property: scale; to: 1.1 1.1 1; startEvents: mouseenter; endEvents: mouseleave; dur: 200"
          >
            <a-text value="<" position="0 0 0.03" align="center" color="white" width="4"></a-text>
          </a-cylinder>
          <a-text
            value={`POS ${currentPosId - 1}`}
            position="0 -0.15 0"
            align="center"
            color="#E5E7EB"
            width="1.5"
          ></a-text>
        </a-entity>
      )}

      {/* Tombol Kanan (Next/Finish) */}
      {(canGoNext || canFinish) && (
        <a-entity position="1 -0.2 0.2" className={!isNextLocked ? "clickable" : ""} onClick={!isNextLocked ? (canFinish ? goToFinish : goToNext) : null}>
          <a-cylinder
            position="0 0 0"
            radius="0.15"
            height="0.05"
            color={isNextLocked ? "#6B7280" : (canFinish ? "#10B981" : "#3B82F6")}
            animation__scale={!isNextLocked ? "property: scale; to: 1.1 1.1 1; startEvents: mouseenter; endEvents: mouseleave; dur: 200" : ""}
          >
            <a-text value={canFinish ? "✓" : ">"} position="0 0 0.03" align="center" color="white" width="4"></a-text>
          </a-cylinder>
          <a-text
            value={canFinish ? "FINISH" : `POS ${currentPosId + 1}`}
            position="0 -0.15 0"
            align="center"
            color={isNextLocked ? "#9CA3AF" : (canFinish ? "#10B981" : "#E5E7EB")}
            width="1.5"
          ></a-text>
        </a-entity>
      )}
      
    </a-entity>
  );
}