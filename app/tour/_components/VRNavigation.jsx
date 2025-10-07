// File: app/tour/_components/VRNavigation.jsx

"use client";
import { useRouter } from 'next/navigation';
import { useTour } from '../_context/TourContext';

export default function VRNavigation({ currentPosId, maxPos }) {
  const router = useRouter();
  const { quizCompleted, quizPositions, handleFinishTour, isAudioFinished, navigationMap } = useTour();

  // --- Semua Logika Inti Tetap Sama ---
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

  // Baca aturan navigasi untuk Pos saat ini dari peta
  const navRules = navigationMap[currentPosId] || { left: null, right: 'next' };

  // Komponen kecil untuk merender tombol
  const NavButton = ({ type }) => {
    let config = {};

    if (type === 'back' && canGoPrev) {
      config = {
        action: goToPrevious, isLocked: false, icon: '<',
        label: `POS ${currentPosId - 1}`, color: "#374151", labelColor: "#E5E7EB",
      };
    } else if (type === 'next' && (canGoNext || canFinish)) {
      const isFinishButton = canFinish && !canGoNext;
      config = {
        action: isFinishButton ? goToFinish : goToNext, isLocked: isNextLocked,
        icon: isFinishButton ? '✓' : '>', label: isFinishButton ? 'FINISH' : `POS ${currentPosId + 1}`,
        color: isNextLocked ? "#6B7280" : (isFinishButton ? "#10B981" : "#3B82F6"),
        labelColor: isNextLocked ? "#9CA3AF" : (isFinishButton ? "#10B981" : "#E5E7EB"),
      };
    } else {
      return null;
    }

    return (
      <a-entity className={!config.isLocked ? "clickable" : ""} onClick={!config.isLocked ? config.action : null}>
        <a-cylinder
          radius="0.15" height="0.05" color={config.color}
          animation__scale={!config.isLocked ? "property: scale; to: 1.1 1.1 1; startEvents: mouseenter; endEvents: mouseleave; dur: 200" : ""}
        >
          <a-text value={config.icon} position="0 0 0.03" align="center" color="white" width="4"></a-text>
        </a-cylinder>
        <a-text
          value={config.label} position="0 -0.15 0" align="center"
          color={config.labelColor} width="1.5"
        ></a-text>
      </a-entity>
    );
  };

  return (
    // ✅ Menggunakan posisi dan skala yang sudah Anda atur manual
    <a-entity position="0 -3 1" scale="8.0 8.0 8.0">
      
      {/* Tombol Kiri, dirender secara dinamis berdasarkan `navRules` */}
      <a-entity position="-1 -0.2 0.1">
        <NavButton type={navRules.left} />
      </a-entity>

      {/* Tombol Kanan, dirender secara dinamis berdasarkan `navRules` */}
      <a-entity position="1 -0.2 0.2">
        <NavButton type={navRules.right} />
      </a-entity>
      
    </a-entity>
  );
}