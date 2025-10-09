// File: app/tour/_context/TourContext.jsx

"use client";
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const TourContext = createContext();

// ✅ PETA NAVIGASI: Atur tombol 'left' dan 'right' untuk setiap Pos di sini
// 'back' = Tombol Kembali, 'next' = Tombol Lanjut, null = Tidak ada tombol
const navigationMap = {
  1: { left: null, right: 'next' },         // Pos 1: kanan >>>
  2: { left: 'next', right: 'back' },       // Pos 2: kiri <<<, kanan >>>
  3: { left: 'back', right: 'next' },       // Pos 3: kiri >>>, kanan <<<
  4: { left: 'next', right: 'back' },       // Pos 4: kiri <<<, kanan >>>
  5: { left: 'next', right: 'back' },       // Pos 5: kiri <<<, kanan >>>
  6: { left: null, right: 'next' },         // Pos 6: kanan >>>
};

export function TourProvider({ children }) {
  // --- State Utama ---
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
  const [highestPosReached, setHighestPosReached] = useState(0);
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [isCenterPointerMode, setIsCenterPointerMode] = useState(false);
  const [visitedPos, setVisitedPos] = useState({}); // Track pos yang sudah pernah dikunjungi sebagai object
  const [audioCompleted, setAudioCompleted] = useState({}); // Track pos yang sudah selesai audionya (PERSISTENT seperti quizCompleted)
  const audioTimer = useRef(null);

  const maxPos = 6;
  const quizPositions = [2, 3, 5];

  // Inisialisasi data dari localStorage
  useEffect(() => {
    const initializeData = () => {
      const savedHighestPos = localStorage.getItem('tour_highest_pos');
      if (savedHighestPos) setHighestPosReached(parseInt(savedHighestPos, 10));
      
      const savedTotalScore = localStorage.getItem('tour_total_score');
      if (savedTotalScore) setTotalScore(parseInt(savedTotalScore));
      
      const savedQuizCompleted = localStorage.getItem('tour_quiz_completed');
      if (savedQuizCompleted) {
        try { setQuizCompleted(JSON.parse(savedQuizCompleted)); }
        catch (e) { console.error('Error parsing saved quiz data:', e); }
      }

      const savedAudioCompleted = localStorage.getItem('tour_audio_completed');
      if (savedAudioCompleted) {
        try { 
          setAudioCompleted(JSON.parse(savedAudioCompleted)); 
          console.log('Loaded audio completed:', JSON.parse(savedAudioCompleted));
        }
        catch (e) { console.error('Error parsing saved audio completed:', e); }
      }

      const savedVisitedPos = localStorage.getItem('tour_visited_pos');
      if (savedVisitedPos) {
        try { 
          setVisitedPos(JSON.parse(savedVisitedPos)); 
          console.log('Loaded visited pos:', JSON.parse(savedVisitedPos));
        }
        catch (e) { console.error('Error parsing saved visited pos:', e); }
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

  // Menyimpan state penting ke localStorage
  useEffect(() => { if (isInitialized) localStorage.setItem('tour_highest_pos', highestPosReached.toString()); }, [highestPosReached, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('tour_total_score', totalScore.toString()); }, [totalScore, isInitialized]);
  useEffect(() => { if (isInitialized) localStorage.setItem('tour_quiz_completed', JSON.stringify(quizCompleted)); }, [quizCompleted, isInitialized]);
  useEffect(() => { 
    if (isInitialized) {
      localStorage.setItem('tour_audio_completed', JSON.stringify(audioCompleted));
      console.log('Saved audio completed:', audioCompleted);
    }
  }, [audioCompleted, isInitialized]);
  useEffect(() => { 
    if (isInitialized) {
      localStorage.setItem('tour_visited_pos', JSON.stringify(visitedPos));
      console.log('Saved visited pos:', visitedPos);
    }
  }, [visitedPos, isInitialized]);

  // Fungsi untuk menandai pos sebagai completed (audio selesai)
  const markAudioCompleted = (posId) => {
    console.log('Marking audio completed for pos', posId);
    setAudioCompleted(prev => {
      const updated = { ...prev, [posId]: true };
      console.log('Updated audioCompleted:', updated);
      return updated;
    });
  };

  // Fungsi untuk menandai pos sebagai completed (backward compatibility)
  const markPosAsCompleted = (posId) => {
    markAudioCompleted(posId);
  };

  // Fungsi untuk audio timer
  const clearAudioTimer = () => { if (audioTimer.current) clearTimeout(audioTimer.current); };
  const startAudioTimer = (durationInSeconds, posId) => {
    console.log('startAudioTimer called for pos:', posId, 'audioCompleted?', audioCompleted[posId]);
    
    // Jika audio pos sudah pernah selesai, langsung set audio finished
    if (audioCompleted[posId]) {
      console.log('Pos', posId, 'audio already completed, skipping audio');
      setIsAudioFinished(true);
      clearAudioTimer();
      return;
    }
    
    // Jika audio belum selesai, jalankan timer normal
    console.log('Pos', posId, 'audio not completed, starting audio timer for', durationInSeconds, 'seconds');
    setIsAudioFinished(false);
    clearAudioTimer();
    audioTimer.current = setTimeout(() => {
      console.log('Audio finished for pos', posId, '- marking as audio completed');
      setIsAudioFinished(true);
      markAudioCompleted(posId); // Tandai audio pos sudah selesai
    }, durationInSeconds * 1000);
  };
  
  // Fungsi utama untuk update posisi, progres, dan audio
  const updateCurrentPos = (pos) => {
    const posNumber = parseInt(pos, 10);
    if (!isNaN(posNumber)) {
      setCurrentPos(posNumber);
      setHighestPosReached(prev => Math.max(prev, posNumber));
      
      console.log('updateCurrentPos:', posNumber, 'audioCompleted?', audioCompleted[posNumber]);
      
      // Jika audio pos sudah selesai, langsung set audio finished
      if (audioCompleted[posNumber]) {
        console.log('Setting audio finished for completed pos', posNumber);
        setIsAudioFinished(true);
      } else {
        setIsAudioFinished(false);
      }
      clearAudioTimer();
    }
  };

  // Fungsi untuk mereset seluruh progres tour
  const resetTour = () => {
    ['tour_highest_pos', 'tour_start_time', 'tour_total_score', 'tour_quiz_completed', 'tour_completed', 'tour_final_time', 'finish_button_clicked', 'tour_visited_pos', 'tour_audio_completed']
      .forEach(item => localStorage.removeItem(item));
    
    clearAudioTimer();
    setCurrentPos(0); setHighestPosReached(0); setSceneScore(0); setTotalScore(0);
    setTimeRemaining(600); setQuizCompleted({}); setTourCompleted(false);
    setTimerFrozen(false); setTimerStarted(false); setFinishButtonClicked(false);
    setIsAudioFinished(false); setVisitedPos({}); setAudioCompleted({});
  };

  // Logika lainnya (timer, penyelesaian kuis, dll)
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
  
  useEffect(() => { 
    if (isInitialized && !finishButtonClicked && quizPositions.every(p => quizCompleted[p])) {
      setTourCompleted(true);
      localStorage.setItem('tour_completed', 'true');
    }
  }, [quizCompleted, isInitialized, finishButtonClicked, quizPositions]);

  const completeQuiz = (posId, score) => {
    console.log('Quiz completed for pos', posId, 'with score', score);
    setQuizCompleted(prev => ({ ...prev, [posId]: true }));
    setTotalScore(prev => prev + score);
    setSceneScore(score);
    // Tandai audio pos sebagai completed setelah quiz selesai
    markAudioCompleted(posId);
  };

  const handleFinishTour = () => {
    setFinishButtonClicked(true);
    setTimerFrozen(true);
    localStorage.setItem('finish_button_clicked', 'true');
    localStorage.setItem('tour_final_time', timeRemaining.toString());
  };

  const completeTourAndReset = () => setTimeout(resetTour, 1000);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const value = {
    currentPos, setCurrentPos: updateCurrentPos, highestPosReached,
    sceneScore, setSceneScore, totalScore, setTotalScore,
    timeRemaining, formatTime, timerStarted, startTimer, timerFrozen,
    quizCompleted, completeQuiz, quizPositions,
    tourCompleted, handleFinishTour, finishButtonClicked, completeTourAndReset,
    resetTour, maxPos, isInitialized,
    isAudioFinished, startAudioTimer, clearAudioTimer,
    navigationMap, // ✅ Ekspor peta navigasi kustom
    isCenterPointerMode, setIsCenterPointerMode,
    visitedPos, markPosAsCompleted, // ✅ Ekspor state visited pos dan fungsi mark
    audioCompleted, markAudioCompleted, // ✅ Ekspor state audio completed (PERSISTENT)
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within a TourProvider');
  return context;
}