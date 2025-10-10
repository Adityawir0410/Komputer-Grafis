"use client";
import { useTour } from '../_context/TourContext';

export default function PosProgress({ currentPosId, maxPos = 3 }) {
  const { audioCompleted, quizPositions, quizCompleted } = useTour();
  
  // Debug log
  console.log('PosProgress render:', {
    currentPosId,
    audioCompleted,
    quizCompleted
  });
  
  const getPositionStatus = (posId) => {
    // Pos saat ini = biru
    if (posId === currentPosId) {
      return 'bg-blue-600';
    }
    
    const isPosQuiz = quizPositions.includes(posId);
    const isQuizDone = quizCompleted[posId] === true;
    const isAudioDone = audioCompleted[posId] === true;
    
    // Untuk pos QUIZ: hijau jika quiz sudah selesai
    if (isPosQuiz) {
      return isQuizDone ? 'bg-green-500' : 'bg-gray-300';
    }
    
    // Untuk pos NON-QUIZ: hijau jika audio sudah selesai
    console.log(`Pos ${posId} (non-quiz) - audioCompleted:`, isAudioDone);
    
    if (isAudioDone) {
      return 'bg-green-500';
    }
    
    // Pos yang belum selesai = abu-abu
    return 'bg-gray-300';
  };
  
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 mr-1">Progress:</span>
          <div className="flex gap-2">
            {Array.from({ length: maxPos }, (_, i) => {
              const posId = i + 1;
              const status = getPositionStatus(posId);
              const isPosQuiz = quizPositions.includes(posId);
              const isQuizDone = quizCompleted[posId];
              
              let title = `Pos ${posId}`;
              if (posId === currentPosId) {
                title += ' (Current)';
              } else if (status === 'bg-green-500') {
                title += ' (Completed)';
              }
              if (isPosQuiz) {
                title += ` [Quiz${isQuizDone ? ' ✓' : ''}]`;
              }
              
              return (
                <div
                  key={posId}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${status}`}
                  title={title}
                ></div>
              );
            })}
          </div>
          <span className="text-xs font-semibold text-gray-700 ml-1">
            {currentPosId}/{maxPos}
          </span>
          {Object.keys(visitedPos).length === maxPos && (
            <span className="ml-1 text-green-500">✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

