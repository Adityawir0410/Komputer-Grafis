// /tour/_components/HUD.jsx
"use client";
import { useTour } from '../_context/TourContext';

export default function HUD() {
  const { 
    sceneScore, 
    totalScore, 
    timeRemaining, 
    currentPos, 
    maxPos, 
    formatTime, 
    isInitialized, 
    timerFrozen, 
    tourCompleted,
    timerStarted,
    quizPositions,
    quizCompleted
  } = useTour();

  // Don't render until context is properly initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="absolute top-6 left-6 right-6 z-20 pointer-events-none">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* Scores and Timer */}
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-300">Scene Score</p>
              <p className="text-xl font-bold text-yellow-400">{sceneScore}</p>
            </div>
            <div>
              <p className="text-xs text-gray-300">Total Score</p>
              <p className="text-xl font-bold text-green-400">{totalScore}</p>
            </div>
            <div>
              <p className="text-xs text-gray-300">
                {!timerStarted ? 'Time (Not Started)' : 'Time'}
                {!timerStarted && <span className="text-gray-400 ml-1">⏸</span>}
              </p>
              <p className={`text-xl font-bold ${
                !timerStarted ? 'text-gray-400' :
                timerFrozen ? 'text-orange-400' : 'text-blue-400'
              }`}>
                {formatTime(timeRemaining)}
              </p>
              {!timerStarted && (
                <p className="text-xs text-gray-400 mt-1">Reach Pos 1 to start</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD - Progress */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Progress:</span>
            <div className="flex gap-2">
              {Array.from({ length: maxPos }, (_, i) => {
                const posNum = i + 1;
                const hasQuiz = quizPositions.includes(posNum);
                const isQuizCompleted = quizCompleted[posNum];
                
                return (
                  <div key={posNum} className="relative">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        posNum <= currentPos 
                          ? tourCompleted 
                            ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                            : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                          : 'bg-gray-600'
                      }`}
                    />
                    {hasQuiz && (
                      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                        isQuizCompleted ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-sm text-gray-300">
              {currentPos}/{maxPos}
              {tourCompleted && <span className="text-green-400 ml-2">✓</span>}
            </span>
          </div>
          {/* <div className="text-xs text-gray-400 mt-1 text-center">
            Quiz: Pos 2 & 3 only
          </div> */}
        </div>
      </div>
    </div>
  );
}