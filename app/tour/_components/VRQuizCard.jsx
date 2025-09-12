"use client";
import { useState, useEffect } from "react";
import { useTour } from "../_context/TourContext";

export default function VRQuizCard({ isOpen, onClose, posId, position = "0 2 -4" }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { completeQuiz } = useTour();

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

  return (
    <a-entity position={position} visible={isOpen}>
      {/* Main Card Background */}
      <a-plane
        position="0 0 -0.1"
        width="4.5"
        height="3.2"
        color="#FFFFFF"
        opacity="0.98"
        animation="property: scale; from: 0.8 0.8 0.8; to: 1 1 1; dur: 400"
      ></a-plane>

      {/* Card Border */}
      <a-plane
        position="0 0 -0.09"
        width="4.6"
        height="3.3"
        color="#E5E7EB"
      ></a-plane>

      {!showResult ? (
        <>
          {/* Header */}
          <a-text
            value={`Quiz Pos ${posId}`}
            position="-2 1.4 0"
            color="#1F2937"
            width="7"
            align="left"
          ></a-text>

          <a-text
            value={`${currentQuestion + 1}/${questions.length}`}
            position="2 1.4 0"
            color="#6B7280"
            width="5"
            align="right"
          ></a-text>

          {/* Close Button */}
          <a-circle
            position="1.8 1.1 0.01"
            radius="0.12"
            color="#EF4444"
            class="clickable"
            onClick={onClose}
          >
            <a-text
              value="×"
              position="0 0 0.01"
              color="white"
              width="10"
              align="center"
            ></a-text>
          </a-circle>

          {/* Progress Bar */}
          <a-plane
            position="0 0.85 0.01"
            width="4"
            height="0.08"
            color="#F3F4F6"
          ></a-plane>

          <a-plane
            position={`${-2 + (((currentQuestion + 1) / questions.length) * 4) / 2} 0.85 0.02`}
            width={((currentQuestion + 1) / questions.length) * 4}
            height="0.08"
            color="#3B82F6"
          ></a-plane>

          {/* Question */}
          <a-text
            value={question?.question || "Loading..."}
            position="-2 0.3 0"
            color="#1F2937"
            width="5.5"
            wrap-count="35"
          ></a-text>

          {/* Answer Options */}
          {question?.type === "true_false" ? (
            <>
              {/* True Option */}
              <a-plane
                position="-1 -0.3 0.01"
                width="1.8"
                height="0.4"
                color={selectedAnswer === 0 ? "#DBEAFE" : "#F9FAFB"}
                class="clickable"
                onClick={() => handleAnswerSelect(0)}
              >
                <a-plane
                  position="0 0 -0.01"
                  width="1.85"
                  height="0.45"
                  color={selectedAnswer === 0 ? "#3B82F6" : "#E5E7EB"}
                ></a-plane>
                <a-text
                  value="True"
                  position="0 0 0.01"
                  color={selectedAnswer === 0 ? "#FFFFFF" : "#374151"}
                  width="5"
                  align="center"
                ></a-text>
              </a-plane>

              {/* False Option */}
              <a-plane
                position="1 -0.3 0.01"
                width="1.8"
                height="0.4"
                color={selectedAnswer === 1 ? "#DBEAFE" : "#F9FAFB"}
                class="clickable"
                onClick={() => handleAnswerSelect(1)}
              >
                <a-plane
                  position="0 0 -0.01"
                  width="1.85"
                  height="0.45"
                  color={selectedAnswer === 1 ? "#3B82F6" : "#E5E7EB"}
                ></a-plane>
                <a-text
                  value="False"
                  position="0 0 0.01"
                  color={selectedAnswer === 1 ? "#FFFFFF" : "#374151"}
                  width="5"
                  align="center"
                ></a-text>
              </a-plane>
            </>
          ) : (
            (question?.options || []).map((option, index) => (
              <a-plane
                key={index}
                position={`0 ${0.1 - (index * 0.25)} 0.01`}
                width="4"
                height="0.22"
                color={selectedAnswer === index ? "#DBEAFE" : "#F9FAFB"}
                class="clickable"
                onClick={() => handleAnswerSelect(index)}
              >
                <a-plane
                  position="0 0 -0.01"
                  width="4.05"
                  height="0.27"
                  color={selectedAnswer === index ? "#3B82F6" : "#E5E7EB"}
                ></a-plane>
                <a-text
                  value={option}
                  position="-1.8 0 0.01"
                  color={selectedAnswer === index ? "#FFFFFF" : "#374151"}
                  width="5"
                  wrap-count="30"
                ></a-text>
              </a-plane>
            ))
          )}

          {/* Navigation Buttons */}
          <a-plane
            position="-1.2 -1.3 0.01"
            width="1.2"
            height="0.3"
            color="#6B7280"
            class="clickable"
            onClick={onClose}
          >
            <a-text
              value="Cancel"
              position="0 0 0.01"
              color="white"
              width="5"
              align="center"
            ></a-text>
          </a-plane>

          <a-plane
            position="1.2 -1.3 0.01"
            width="1.2"
            height="0.3"
            color={selectedAnswer !== null ? "#3B82F6" : "#9CA3AF"}
            class="clickable"
            onClick={selectedAnswer !== null ? handleNextQuestion : undefined}
          >
            <a-text
              value={currentQuestion < questions.length - 1 ? "Next" : "Finish"}
              position="0 0 0.01"
              color="white"
              width="5"
              align="center"
            ></a-text>
          </a-plane>
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

          <a-plane
            position="0 -0.9 0.01"
            width="2"
            height="0.4"
            color="#3B82F6"
            class="clickable"
            onClick={handleCloseQuiz}
          >
            <a-text
              value="Continue"
              position="0 0 0.01"
              color="white"
              width="5"
              align="center"
            ></a-text>
          </a-plane>
        </>
      )}
    </a-entity>
  );
}
