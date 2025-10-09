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
  const NavButton = ({ type, side }) => {
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
      <a-entity
        className={!config.isLocked ? "clickable" : ""}
        onClick={!config.isLocked ? config.action : null}
      >
        {/* Container diputar -90 derajat pada sumbu X; arah panah mengikuti sisi */}
        <a-entity rotation={side === 'left' ? "-90 180 0" : "-90 0 0"}>
          {/* Area klik transparan */}
          <a-plane
            width="2.1" height="0.80" position="0 0 0"
            color="#000000" opacity="0.01"
            material="transparent: true; side: double"
            animation__hover={!config.isLocked ? "property: scale; to: 1.08 1.08 1; startEvents: mouseenter; endEvents: mouseleave; dur: 150" : ""}
          ></a-plane>

          {/* Grup chevron animasi (3 buah) */}
          <a-entity position="0 0 0.06">
          {Array.from({ length: 3 }).map((_, i) => {
            const delay = 120 * i;
            const baseX = -0.20 + i * 0.20;
            const zOffset = 0.01 + (0.02 * i); // Increased z-spacing to prevent z-fighting
            const encoded = '%23FFFFFF';
            const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encoded}'><path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z'/></svg>`;
            return (
              <a-image
                key={i}
                src={svg}
                width="0.56"
                height="0.56"
                position={`${baseX} 0 ${zOffset}`}
                material="transparent: true; side: double; alphaTest: 0.1"
                opacity={config.isLocked ? "0.35" : "1"}
                animation__fade={config.isLocked ? "" :
                  `property: opacity; from: 0.6; to: 1; dir: alternate; loop: true; dur: 550; delay: ${delay}`
                }
                animation__move={config.isLocked ? "" :
                  `property: position; from: ${baseX - 0.035} 0 ${zOffset}; to: ${baseX + 0.035} 0 ${zOffset}; dir: alternate; loop: true; dur: 550; delay: ${delay}`
                }
              ></a-image>
            );
          })}
          </a-entity>
        </a-entity>

        {/* Label di bawah tombol */}
        <a-text
          value={config.label} position="0 -0.2 0" align="center"
          color={config.labelColor} width="1.8"
        ></a-text>
      </a-entity>
    );
  };

  return (
    // ✅ Menggunakan posisi dan skala yang sudah Anda atur manual
    <a-entity position="0 -3 1" scale="8.0 8.0 8.0">
      
      {/* Tombol Kiri, dirender secara dinamis berdasarkan `navRules` */}
      <a-entity position="-1 -0.2 0.1">
        <NavButton type={navRules.left} side="left" />
      </a-entity>

      {/* Tombol Kanan, dirender secara dinamis berdasarkan `navRules` */}
      <a-entity position="1 -0.2 0.2">
        <NavButton type={navRules.right} side="right" />
      </a-entity>
      
    </a-entity>
  );
}