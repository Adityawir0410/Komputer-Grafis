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
        {/* Container diputar -90 derajat pada sumbu X */}
        <a-entity rotation="-90 0 0">
          {/* Outer glow/border effect */}
          <a-rounded
            width="2.55" height="1.15" radius="0.18" position="0 0 -0.01"
            color={config.isLocked ? "#374151" : config.color}
            opacity={config.isLocked ? "0.2" : "0.4"}
            material="shader: flat; transparent: true"
            animation__pulse={!config.isLocked ? 
              `property: scale; from: 1 1 1; to: 1.03 1.03 1; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine` : ""}
          ></a-rounded>

          {/* Main background dengan rounded corners */}
          <a-rounded
            width="2.4" height="1.0" radius="0.15" position="0 0 0"
            color={config.isLocked ? "#1F2937" : config.color}
            opacity={config.isLocked ? "0.35" : "0.65"}
            material="shader: flat; transparent: true"
            animation__hover={!config.isLocked ? "property: scale; to: 1.08 1.08 1; startEvents: mouseenter; endEvents: mouseleave; dur: 250; easing: easeOutQuad" : ""}
            animation__glow={!config.isLocked ? 
              `property: material.opacity; from: 0.55; to: 0.75; dir: alternate; loop: true; dur: 1400; easing: easeInOutSine` : ""}
          ></a-rounded>

          {/* Inner highlight untuk depth */}
          <a-rounded
            width="2.3" height="0.9" radius="0.13" position="0 0.05 0.01"
            color="#FFFFFF"
            opacity={config.isLocked ? "0" : "0.1"}
            material="shader: flat; transparent: true"
          ></a-rounded>

          {/* Shadow layer untuk depth */}
          <a-rounded
            width="2.4" height="1.0" radius="0.15" position="0 -0.05 -0.03"
            color="#000000" opacity="0.5"
            material="shader: flat; transparent: true"
          ></a-rounded>

          {/* Area klik transparan (lebih luas) */}
          <a-plane
            width="2.6" height="1.2" position="0 0 0.02"
            color="#000000" opacity="0.01"
            material="shader: flat; transparent: true"
          ></a-plane>

          {/* Simbol panah dengan animasi smooth dan glow */}
          <a-text
            value={side === 'left' ? '<<<' : '>>>'}
            position="0 0 0.09"
            align="center"
            color={config.isLocked ? "#9CA3AF" : "#FFFFFF"}
            width="10"
            letterSpacing="3"
            material={`shader: flat; transparent: true; opacity: ${config.isLocked ? 0.6 : 1}`}
            animation__fade={config.isLocked ? "" :
              `property: material.opacity; from: 0.7; to: 1; dir: alternate; loop: true; dur: 1100; easing: easeInOutQuad`
            }
            animation__move={config.isLocked ? "" :
              `property: position; from: ${side === 'left' ? '-0.18' : '0.18'} 0 0.09; to: ${side === 'left' ? '0.18' : '-0.18'} 0 0.09; dir: alternate; loop: true; dur: 1400; easing: easeInOutQuad`
            }
            animation__scale={!config.isLocked ? 
              `property: scale; from: 0.96 0.96 0.96; to: 1.04 1.04 1.04; dir: alternate; loop: true; dur: 1400; easing: easeInOutQuad` : ""}
          ></a-text>
        </a-entity>

        {/* Label di bawah tombol dengan background */}
        <a-entity position="0 -0.55 0">
          {/* Background label */}
          <a-rounded
            width="1.4" height="0.35" radius="0.08"
            color={config.isLocked ? "#374151" : "#1F2937"}
            opacity={config.isLocked ? "0.4" : "0.6"}
            material="shader: flat; transparent: true"
          ></a-rounded>
          
          {/* Text label */}
          <a-text
            value={config.label}
            position="0 0 0.02"
            align="center"
            color={config.labelColor}
            width="1.6"
            material="shader: flat; transparent: true"
            animation__labelglow={!config.isLocked ? 
              `property: material.opacity; from: 0.8; to: 1; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine` : ""}
          ></a-text>
        </a-entity>
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