// File: app/tour/_context/TourContext.jsx

"use client";
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const TourContext = createContext();

export function TourProvider({ children }) {
  // --- Main States ---
  const [currentPos, setCurrentPos] = useState(0);
  const [sceneScore, setSceneScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [quizCompleted, setQuizCompleted] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [timerFrozen, setTimerFrozen] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [finishButtonClicked, setFinishButtonClicked] = useState(false);
  
  // State for anti-skip logic
  const [highestPosReached, setHighestPosReached] = useState(0);
  
  // State for audio lock
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const audioTimer = useRef(null);

  const maxPos = 6;
  const quizPositions = [2, 3, 5];

  // Initialize data from localStorage
  useEffect(() => {
    const initializeData = () => {
      const savedHighestPos = localStorage.getItem('tour_highest_pos');
      if (savedHighestPos) {
        setHighestPosReached(parseInt(savedHighestPos, 10));
      }
      
      const savedTotalScore = localStorage.getItem('tour_total_score');
      if (savedTotalScore) setTotalScore(parseInt(savedTotalScore));
      
      const savedQuizCompleted = localStorage.getItem('tour_quiz_completed');
      if (savedQuizCompleted) {
        try { setQuizCompleted(JSON.parse(savedQuizCompleted)); }
        catch (e) { console.error('Error parsing saved quiz data:', e); }
      }

      const startTime = localStorage.getItem('tour_start_time');
      if (startTime) {
        const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        setTimeRemaining(Math.max(0, 600 - elapsedSeconds));
        setTimerStarted(true);
      }
      
      setIsInitialized(true);
    };
    initializeData();
  }, []);

  // Save highest progress to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tour_highest_pos', highestPosReached.toString());
    }
  }, [highestPosReached, isInitialized]);

  // ✅ Function to clear the audio timer
  const clearAudioTimer = () => {
    if (audioTimer.current) {
      clearTimeout(audioTimer.current);
    }
  };

  // Function to start the audio timer
  const startAudioTimer = (durationInSeconds) => {
    setIsAudioFinished(false);
    clearAudioTimer(); // Clear any existing timer
    console.log(`AUDIO TIMER: Started for ${durationInSeconds} seconds.`);
    
    audioTimer.current = setTimeout(() => {
      console.log(`%cAUDIO TIMER: FINISHED!`, 'color: green; font-weight: bold;');
      setIsAudioFinished(true);
    }, durationInSeconds * 1000);
  };
  
  // Function to update position, progress, and reset audio
  const updateCurrentPos = (pos) => {
    const posNumber = parseInt(pos, 10);
    if (!isNaN(posNumber)) {
      setCurrentPos(posNumber);
      setHighestPosReached(prevHighest => Math.max(prevHighest, posNumber));
      setIsAudioFinished(false);
      clearAudioTimer(); // Stop the old audio timer
    }
  };

  // Function to reset the entire tour
  const resetTour = () => {
    ['tour_start_time', 'tour_total_score', 'tour_quiz_completed', 'tour_completed', 'tour_final_time', 'finish_button_clicked', 'tour_highest_pos']
      .forEach(item => localStorage.removeItem(item));
    
    clearAudioTimer();
    
    setCurrentPos(0);
    setHighestPosReached(0);
    setSceneScore(0);
    setTotalScore(0);
    setTimeRemaining(600);
    setQuizCompleted({});
    setTourCompleted(false);
    setTimerFrozen(false);
    setTimerStarted(false);
    setFinishButtonClicked(false);
    setIsAudioFinished(false);
  };

  // --- Other Logic (unchanged) ---
  const startTimer = () => {
    if (!timerStarted && !tourCompleted) {
      localStorage.setItem('tour_start_time', Date.now().toString());
      setTimerStarted(true);
    }
  };

  useEffect(() => {
     if (!isInitialized || !timerStarted || timeRemaining <= 0 || timerFrozen || finishButtonClicked) return;
     const timer = setInterval(() => setTimeRemaining(prev => Math.max(0, prev - 1)), 1000);
     return () => clearInterval(timer);
  }, [timeRemaining, isInitialized, timerStarted, timerFrozen, finishButtonClicked]);
  
  useEffect(() => { if (isInitialized) localStorage.setItem('tour_total_score', totalScore.toString()); }, [totalScore, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('tour_quiz_completed', JSON.stringify(quizCompleted)); }, [quizCompleted, isInitialized]);

  useEffect(() => { 
    if (isInitialized && !finishButtonClicked && quizPositions.every(p => quizCompleted[p])) {
      setTourCompleted(true);
      localStorage.setItem('tour_completed', 'true');
    }
  }, [quizCompleted, isInitialized, finishButtonClicked, quizPositions]);

  const completeQuiz = (posId, score) => {
    setQuizCompleted(prev => ({ ...prev, [posId]: true }));
    setTotalScore(prev => prev + score);
    setSceneScore(score);
  };

  const handleFinishTour = () => {
    setFinishButtonClicked(true);
    setTimerFrozen(true);
    localStorage.setItem('finish_button_clicked', 'true');
    localStorage.setItem('tour_final_time', timeRemaining.toString());
  };

  const completeTourAndReset = () => {
    setTimeout(resetTour, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Values provided by the Context ---
  const value = {
    currentPos,
    setCurrentPos: updateCurrentPos,
    highestPosReached,
    sceneScore,
    setSceneScore,
    totalScore,
    setTotalScore,
    timeRemaining,
    quizCompleted,
    tourCompleted,
    timerFrozen,
    timerStarted,
    finishButtonClicked,
    maxPos,
    quizPositions,
    completeQuiz,
    resetTour,
    completeTourAndReset,
    startTimer,
    handleFinishTour,
    formatTime,
    isInitialized,
    isAudioFinished,
    startAudioTimer,
    clearAudioTimer, // ✅ Export the new clear function
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}