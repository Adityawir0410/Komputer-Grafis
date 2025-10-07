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
  let lockReason = isNextLocked ? (!isAudioFinished ? "Please listen to the audio to proceed" : "Please complete the quiz to proceed") : "";
  const canGoNext = currentPosId < maxPos;
  const canGoPrev = currentPosId > 1;
  const allQuizzesComplete = quizPositions.every(pos => quizCompleted[pos]);
  const canFinish = allQuizzesComplete && currentPosId === maxPos;

  return (
    // ✅ PERBAIKAN UTAMA: Tambahkan 'scale' untuk memperbesar semua elemen di dalamnya
    <a-entity position="0 -0.6 -1" scale="1.5 1.5 1.5">
      
      {/* Tombol Kiri (Previous) */}
      {canGoPrev && (
        <a-entity position="-0.4 0 0" className="clickable" onClick={goToPrevious}>
          <a-cylinder position="0 0 0" radius="0.15" height="0.05" color="#374151" animation="property: scale; to: 1.1 1.1 1; startEvents: mouseenter; endEvents: mouseleave; dur: 200">
            <a-text value="<" position="0 0 0.03" align="center" color="white" width="4"></a-text>
          </a-cylinder>
        </a-entity>
      )}

      {/* Tombol Kanan (Next/Finish) */}
      {(canGoNext || canFinish) && (
        <a-entity position="0.4 0 0" className={!isNextLocked ? "clickable" : ""} onClick={!isNextLocked ? (canFinish ? goToFinish : goToNext) : null}>
          <a-cylinder position="0 0 0" radius="0.15" height="0.05" color={isNextLocked ? "#6B7280" : (canFinish ? "#10B981" : "#3B82F6")} animation__scale={!isNextLocked ? "property: scale; to: 1.1 1.1 1; startEvents: mouseenter; endEvents: mouseleave; dur: 200" : ""}>
            <a-text value={canFinish ? "✓" : ">"} position="0 0 0.03" align="center" color="white" width="4"></a-text>
          </a-cylinder>
        </a-entity>
      )}

      {/* Indikator Posisi Tengah */}
      <a-entity position="0 0.25 0">
        <a-plane position="0 0 0" width="0.7" height="0.18" color="#1F2937" opacity="0.8" rounded="radius: 0.03;"></a-plane>
        <a-text value={`POS ${currentPosId}/${maxPos}`} position="0 0 0.01" align="center" color="white" width="1.2"></a-text>
      </a-entity>

      {/* Teks Instruksi/Alasan Terkunci */}
      {isNextLocked && canGoNext && (
        <a-text
          value={lockReason}
          position="0 0.45 0"
          align="center"
          color="#FBBF24"
          width="1.5"
          wrap-count="30"
        ></a-text>
      )}
    </a-entity>
  );
}