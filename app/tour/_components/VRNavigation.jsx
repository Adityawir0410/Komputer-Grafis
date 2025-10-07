// File: app/tour/_components/VRNavigation.jsx

"use client";
import { useRouter } from 'next/navigation';
import { useTour } from '../_context/TourContext';

export default function VRNavigation({ currentPosId, maxPos }) {
  const router = useRouter();
  const { quizCompleted, quizPositions, handleFinishTour, isAudioFinished } = useTour();

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
    handleFinishTour();
    router.push('/tour/closing');
  };

  const isQuizRequired = quizPositions.includes(currentPosId);
  const isCurrentQuizCompleted = quizCompleted[currentPosId];
  const isNextLocked = !isAudioFinished || (isQuizRequired && !isCurrentQuizCompleted);
  
  let lockReason = "";
  if (!isAudioFinished) {
    lockReason = "Please listen to the audio to proceed";
  } else if (isQuizRequired && !isCurrentQuizCompleted) {
    lockReason = "Please complete the quiz to proceed";
  }

  const canGoNext = currentPosId < maxPos;
  const canGoPrev = currentPosId > 1;
  
  const allQuizzesComplete = quizPositions.every(pos => quizCompleted[pos]);
  const canFinish = allQuizzesComplete && currentPosId === maxPos;

  // Log untuk debugging bisa Anda hapus atau biarkan
  console.log({ currentPosId, isAudioFinished, isQuizRequired, isCurrentQuizCompleted, isNextLocked, canFinish });

  return (
    <>
      {/* Tombol Previous */}
      {canGoPrev && (
        <a-entity position="-2 1.6 -3" className="clickable" onClick={goToPrevious}>
          <a-circle radius="0.3" color="#4B5563" animation="property: scale; to: 1.1 1.1 1.1; startEvents: mouseenter; endEvents: mouseleave; dur: 200"></a-circle>
          <a-text value="<" position="0 0 0.01" align="center" color="white" width="4"></a-text>
        </a-entity>
      )}

      {/* ✅ PERBAIKAN UTAMA DI SINI: Kondisi diubah menjadi (canGoNext || canFinish) */}
      {(canGoNext || canFinish) && (
        <a-entity position="2 1.6 -3" className={!isNextLocked ? "clickable" : ""} onClick={!isNextLocked ? (canFinish ? goToFinish : goToNext) : null}>
          
          <a-circle 
            radius="0.3" 
            color={isNextLocked ? "#9CA3AF" : (canFinish ? "#10B981" : "#3B82F6")}
            animation__scale={!isNextLocked ? "property: scale; to: 1.1 1.1 1.1; startEvents: mouseenter; endEvents: mouseleave; dur: 200" : ""}
          ></a-circle>
          
          <a-text 
            value={canFinish ? "✓" : ">"} 
            position="0 0 0.01" 
            align="center" 
            color="white" 
            width="4"
          ></a-text>
        </a-entity>
      )}
      
      {/* Teks Bantuan Dinamis Saat Tombol Terkunci */}
      {isNextLocked && canGoNext && (
        <a-text
          value={lockReason}
          position="0 1.2 -3"
          align="center"
          color="#FBBF24"
          width="3"
          wrap-count="35"
        ></a-text>
      )}
    </>
  );
}