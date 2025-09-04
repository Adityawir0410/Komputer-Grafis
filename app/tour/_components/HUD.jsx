// /tour/_components/HUD.jsx
"use client";
import { useTour } from '../_context/TourContext';

export default function HUD({ onQuizClick }) {
  const { sceneScore, totalScore, timeRemaining, currentPos, maxPos, formatTime, quizCompleted } = useTour();

  return (
    <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* Left side - Scores and Timer */}
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
              <p className="text-xs text-gray-300">Time</p>
              <p className="text-xl font-bold text-blue-400">{formatTime(timeRemaining)}</p>
            </div>
          </div>
        </div>

        {/* Right side - Quiz Button */}
        <button
          onClick={onQuizClick}
          className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-white font-bold text-lg transition-all duration-300 pointer-events-auto ${
            quizCompleted[currentPos]
              ? 'bg-green-600 border-green-400 shadow-lg shadow-green-400/50'
              : 'bg-blue-600 border-blue-400 hover:bg-blue-700 hover:scale-110 animate-pulse'
          }`}
          disabled={quizCompleted[currentPos]}
        >
          {quizCompleted[currentPos] ? '✓' : '?'}
        </button>
      </div>

      {/* Bottom HUD - Progress */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Progress:</span>
            <div className="flex gap-2">
              {Array.from({ length: maxPos }, (_, i) => (
                <div
                  key={i + 1}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    i + 1 <= currentPos 
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">{currentPos}/{maxPos}</span>
          </div>
        </div>
      </div>
    </div>
  );
}