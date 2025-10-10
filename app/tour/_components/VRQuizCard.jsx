"use client";
import { useState, useEffect } from "react";
import { useTour } from "../_context/TourContext";

export default function VRQuizCard({ isOpen, onClose, posId, position = "0 2 -3" }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { completeQuiz } = useTour();

  // Estimate wrapped lines to drive flexible layout
  const WRAP_COUNT = 44; // make characters smaller, reduce line count visually
  const estimateLines = (text, wrap = WRAP_COUNT) => {
    if (!text) return 1;
    const words = String(text).split(/\s+/);
    let lines = 1;
    let current = 0;
    for (const w of words) {
      const len = w.length + (current === 0 ? 0 : 1);
      if (current + len > wrap) {
        lines += 1;
        current = w.length;
      } else {
        current += len;
      }
    }
    return Math.max(lines, 1);
  };

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const res = await fetch("/quiz.json", { cache: "no-store" });
        const data = await res.json();
        const all = Array.isArray(data?.questions) ? data.questions : [];
        const pid = Number(posId) || 1;
        
        let posQuestions = [];
        
        // Pos 2: questions 1-9 (indices 0-8)
        // Pos 3: questions 10-19 (indices 9-18)
        // Pos 5: questions 20-29 (indices 19-28)
        if (pid === 2) {
          posQuestions = all.slice(0, 9);
        } else if (pid === 3) {
          posQuestions = all.slice(9, 19);
        } else if (pid === 5) {
          posQuestions = all.slice(19, 29);
        } else {
          // Fallback for other positions
          const start = (pid - 1) * 3;
          const end = pid * 3;
          posQuestions = all.slice(start, end);
        }
        
        if (posQuestions.length === 0 && all.length > 0) {
          posQuestions = all.slice(0, Math.min(3, all.length));
        }
        
        setQuestions(posQuestions);
      } catch (err) {
        console.error("Error loading quiz:", err);
        setQuestions([]);
      }
    };

    load();
  }, [isOpen, posId]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
    } else {
      let correct = 0;
      newAnswers.forEach((ans, idx) => {
        const q = questions[idx];
        if (q?.type === "true_false") {
          const correctIndex = typeof q.correct_answer === "boolean" ? (q.correct_answer ? 0 : 1) : q.correct_answer;
          if (ans === correctIndex) correct++;
        } else if (q?.type === "multiple_choice") {
          if (ans === q.correct_answer) correct++;
        }
      });

      const finalScore = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleCloseQuiz = () => {
    completeQuiz(posId, score);
    onClose?.();
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResult(false);
    setScore(0);
    setQuestions([]);
  };

  if (!isOpen || questions.length === 0) return null;

  const question = questions[currentQuestion];
  const progress = questions.length > 0 ? (currentQuestion + 1) / questions.length : 0;
  // Layout constants to keep inside frame
  const CARD_INNER_WIDTH = 4.2; // must be <= main card width - margins
  const OPTION_HEIGHT = 0.3;
  const OPTION_GAP = 0.34; // spacing between options to avoid overlap

  const optionCount = question?.type === "true_false" ? 2 : (question?.options?.length || 0);
  const qLines = estimateLines(question?.question, WRAP_COUNT);
  const BASE_CARD_HEIGHT = 3.1;
  const headerBlock = 0.9; // title + counter + progress + spacing
  const footerBlock = 0.6; // buttons area
  const LINE_SPACING = 0.24; // vertical spacing per question line (world units)
  const optionsBlock = optionCount * OPTION_GAP + 0.12;
  const questionBlock = qLines * LINE_SPACING + 0.22;
  const requiredHeight = headerBlock + questionBlock + optionsBlock + footerBlock;
  const mainHeight = Math.max(BASE_CARD_HEIGHT, requiredHeight);
  const outerHeight = mainHeight + 0.2;
  const half = mainHeight / 2;
  const topEdge = half;
  const bottomEdge = -half;
  const headerY = topEdge - 0.37;
  const dividerY = headerY - 0.40;
  const questionTopY = dividerY - 0.12;
  const optionsStartY = questionTopY - qLines * LINE_SPACING - 0.20;
  const buttonsY = bottomEdge + 0.45;

  return (
    <a-entity position={position} visible={isOpen} ui-overlay>
      {/* Subtle drop shadow */}
      <a-plane
        position="0 -0.03 -0.15"
        width="4.6"
        height={outerHeight}
        color="#000000"
        opacity="0.10"
        material="transparent: true; side: double"
      ></a-plane>

      {/* Outer frame */}
      <a-plane
        position="0 0 -0.12"
        width="4.6"
        height={outerHeight}
        color="#E5E7EB"
        material="side: double"
      ></a-plane>

      {/* Main card */}
      <a-plane
        position="0 0 -0.1"
        width="4.4"
        height={mainHeight}
        color="#FFFFFF"
        opacity="0.98"
        material="shader: flat; side: double; transparent: true"
        animation="property: scale; from: 0.92 0.92 0.92; to: 1 1 1; dur: 250"
      ></a-plane>

      {!showResult ? (
        <>
          {/* Header */}
          <a-entity position={`0 ${headerY} 0.02`}>
            {/* Title */}
            <a-text
              value={`Quiz Pos ${posId}`}
              position="-2.0 0.18 0"
              color="#0F172A"
              width="5"
              align="left"
            ></a-text>
            {/* Counter */}
            <a-text
              value={`${currentQuestion + 1}/${questions.length}`}
              position="2.0 0.18 0"
              color="#6B7280"
              width="5"
              align="right"
            ></a-text>
            {/* Close Button */}
            <a-entity position="2.0 -0.06 0.02">
              <a-circle
                radius="0.12"
                color="#EF4444"
                class="clickable"
                onClick={onClose}
              ></a-circle>
              <a-text
                value="×"
                position="0 0 0.03"
                color="#ffffff"
                width="10"
                align="center"
              ></a-text>
            </a-entity>
            {/* Progress bar */}
            <a-plane position={`0 -0.34 0.01`} width={CARD_INNER_WIDTH} height="0.08" color="#EEF2FF" material="side: double"></a-plane>
            <a-plane position={`${-(CARD_INNER_WIDTH/2) + (progress * CARD_INNER_WIDTH) / 2} -0.34 0.03`} width={Math.max(0.02, progress * CARD_INNER_WIDTH)} height="0.08" color="#3B82F6" material="side: double"></a-plane>
          </a-entity>

          {/* Divider */}
          <a-plane position={`0 ${dividerY} 0.01`} width={CARD_INNER_WIDTH} height="0.01" color="#E5E7EB" material="side: double"></a-plane>

          {/* Question */}
          <a-text
            value={question?.question || "Loading..."}
            position={`${-(CARD_INNER_WIDTH/2)} ${questionTopY} 0.02`}
            color="#111827"
            width={CARD_INNER_WIDTH}
            wrap-count={WRAP_COUNT}
            align="left"
            baseline="top"
          ></a-text>

          {/* Answer Options */}
          {question?.type === "true_false" ? (
            <>
              {/* True Option */}
              {/* Arrange vertically for consistency */}
              {/* TRUE */}
              <a-entity position={`0 ${optionsStartY} 0.02`} class="clickable" onClick={() => handleAnswerSelect(0)}>
                <a-plane
                  position="0 0 -0.02"
                  width={CARD_INNER_WIDTH - 0.04}
                  height={OPTION_HEIGHT + 0.04}
                  color={selectedAnswer === 0 ? "#3B82F6" : "#E5E7EB"}
                  material="side: double"
                ></a-plane>
                <a-plane
                  position="0 0 0"
                  width={CARD_INNER_WIDTH}
                  height={OPTION_HEIGHT}
                  color={selectedAnswer === 0 ? "#DBEAFE" : "#F9FAFB"}
                  material="side: double"
                ></a-plane>
                <a-circle position={`${-(CARD_INNER_WIDTH/2) + 0.2} 0 0.03`} radius="0.09" color={selectedAnswer === 0 ? "#2563EB" : "#9CA3AF"} material="side: double"></a-circle>
                <a-text value="True" position={`${-(CARD_INNER_WIDTH/2) + 0.45} 0 0.04`} color={selectedAnswer === 0 ? "#1F2937" : "#374151"} width={CARD_INNER_WIDTH - 0.8} align="left" wrap-count="28"></a-text>
              </a-entity>
              {/* FALSE */}
              <a-entity position={`0 ${optionsStartY - OPTION_GAP} 0.02`} class="clickable" onClick={() => handleAnswerSelect(1)}>
                <a-plane
                  position="0 0 -0.02"
                  width={CARD_INNER_WIDTH - 0.04}
                  height={OPTION_HEIGHT + 0.04}
                  color={selectedAnswer === 1 ? "#3B82F6" : "#E5E7EB"}
                  material="side: double"
                ></a-plane>
                <a-plane
                  position="0 0 0"
                  width={CARD_INNER_WIDTH}
                  height={OPTION_HEIGHT}
                  color={selectedAnswer === 1 ? "#DBEAFE" : "#F9FAFB"}
                  material="side: double"
                ></a-plane>
                <a-circle position={`${-(CARD_INNER_WIDTH/2) + 0.2} 0 0.03`} radius="0.09" color={selectedAnswer === 1 ? "#2563EB" : "#9CA3AF"} material="side: double"></a-circle>
                <a-text value="False" position={`${-(CARD_INNER_WIDTH/2) + 0.45} 0 0.04`} color={selectedAnswer === 1 ? "#1F2937" : "#374151"} width={CARD_INNER_WIDTH - 0.8} align="left" wrap-count="28"></a-text>
              </a-entity>
            </>
          ) : (
            (question?.options || []).map((option, index) => {
              const y = optionsStartY - index * OPTION_GAP; // start under question, spaced evenly
              const isSel = selectedAnswer === index;
              const letter = String.fromCharCode(65 + index);
              return (
                <a-entity key={index} position={`0 ${y} 0.02`} class="clickable" onClick={() => handleAnswerSelect(index)}>
                  <a-plane position="0 0 -0.02" width={CARD_INNER_WIDTH - 0.04} height={OPTION_HEIGHT + 0.04} color={isSel ? "#3B82F6" : "#E5E7EB"} material="side: double"></a-plane>
                  <a-plane position="0 0 0" width={CARD_INNER_WIDTH} height={OPTION_HEIGHT} color={isSel ? "#DBEAFE" : "#F9FAFB"} material="side: double"></a-plane>
                  <a-circle position={`${-(CARD_INNER_WIDTH/2) + 0.2} 0 0.03`} radius="0.1" color={isSel ? "#2563EB" : "#9CA3AF"} material="side: double"></a-circle>
                  <a-text value={letter} position={`${-(CARD_INNER_WIDTH/2) + 0.2} 0 0.04`} color="#FFFFFF" width="6" align="center"></a-text>
                  <a-text value={option} position={`${-(CARD_INNER_WIDTH/2) + 0.45} 0 0.04`} color={isSel ? "#1F2937" : "#374151"} width={CARD_INNER_WIDTH - 0.8} wrap-count="32" align="left"></a-text>
                </a-entity>
              );
            })
          )}

          {/* Navigation Buttons */}
          <a-entity position={`0 ${buttonsY} 0.02`}>
            {/* Cancel */}
            <a-entity position="-1.25 0 0" class="clickable" onClick={onClose}>
              <a-plane position="0 0 -0.02" width="1.44" height="0.36" color="#9CA3AF" material="side: double"></a-plane>
              <a-plane position="0 0 0" width="1.4" height="0.32" color="#E5E7EB" material="side: double"></a-plane>
              <a-text value="Cancel" position="0 0 0.03" color="#FFFFFF" width="5" align="center"></a-text>
            </a-entity>
            {/* Next / Finish */}
            <a-entity
              position="1.25 0 0"
              class={selectedAnswer !== null ? "clickable" : ""}
              onClick={selectedAnswer !== null ? handleNextQuestion : undefined}
            >
              <a-plane position="0 0 -0.02" width="1.64" height="0.36" color={selectedAnswer !== null ? "#2563EB" : "#9CA3AF"} material="side: double"></a-plane>
              <a-plane position="0 0 0" width="1.6" height="0.32" color={selectedAnswer !== null ? "#3B82F6" : "#D1D5DB"} material="side: double"></a-plane>
              <a-text
                value={currentQuestion < questions.length - 1 ? "Next" : "Finish"}
                position="0 0 0.03"
                color="#FFFFFF"
                width="6"
                align="center"
              ></a-text>
            </a-entity>
          </a-entity>
        </>
      ) : (
        /* Results */
        <>
          {/* Trophy */}
          <a-text
            value="🏆"
            position="0 0.8 0"
            color={score >= 70 ? "#10B981" : "#EF4444"}
            width="12"
            align="center"
          ></a-text>

          <a-text
            value={`${score}%`}
            position="0 0.3 0"
            color="#1F2937"
            width="10"
            align="center"
          ></a-text>

          <a-text
            value={score >= 70 ? "Great Job!" : "Keep Learning!"}
            position="0 0 0"
            color="#1F2937"
            width="6"
            align="center"
          ></a-text>

          <a-text
            value={`You scored ${score} points!`}
            position="0 -0.3 0"
            color="#6B7280"
            width="5"
            align="center"
          ></a-text>

          <a-entity position="0 -0.9 0.01" class="clickable" onClick={handleCloseQuiz}>
            <a-plane position="0 0 -0.02" width="2.25" height="0.46" color="#2563EB" material="side: double"></a-plane>
            <a-plane position="0 0 0" width="2.2" height="0.42" color="#3B82F6" material="side: double"></a-plane>
            <a-text value="Continue" position="0 0 0.03" color="#FFFFFF" width="6" align="center"></a-text>
          </a-entity>
        </>
      )}
    </a-entity>
  );
}
