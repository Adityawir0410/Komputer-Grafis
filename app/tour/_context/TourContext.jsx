"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export function TourProvider({ children }) {
  const [sceneScore, setSceneScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes in seconds
  const [currentPos, setCurrentPos] = useState(1);
  const [maxPos] = useState(3);
  const [quizCompleted, setQuizCompleted] = useState({});

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const addSceneScore = (points) => {
    setSceneScore(prev => prev + points);
    setTotalScore(prev => prev + points);
  };

  const completeQuiz = (posId, score) => {
    setQuizCompleted(prev => ({ ...prev, [posId]: true }));
    addSceneScore(score);
  };

  const resetSceneScore = () => {
    setSceneScore(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const value = {
    sceneScore,
    totalScore,
    timeRemaining,
    currentPos,
    maxPos,
    quizCompleted,
    setCurrentPos,
    addSceneScore,
    completeQuiz,
    resetSceneScore,
    formatTime
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
}