"use client";
import { useState, useEffect, useMemo } from "react";
import { useTour } from "../_context/TourContext";

export default function VRQuizCard({ isOpen, onClose, posId, position = "0 2 -4" }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { completeQuiz } = useTour();

  // ---- Layout constants (mudah diatur) ----
  const CARD_W = 5.2;
  const CARD_H = 3.8;
  const PADDING_X = 0.28;
  const PADDING_Y = 0.28;
  const HEADER_H = 0.7;
  const FOOTER_H = 0.6;
  const CONTENT_H = CARD_H - HEADER_H - FOOTER_H - (PADDING_Y * 2);
  const INNER_W = CARD_W - (PADDING_X * 2);

  // MSDF font agar teks tajam
  const FONT_URL = "https://cdn.aframe.io/fonts/Roboto-msdf.json";

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const res = await fetch("/quiz.json", { cache: "no-store" });
        const data = await res.json();
        const all = Array.isArray(data?.questions) ? data.questions : [];
        const pid = Number(posId) || 1;
        const start = (pid - 1) * 3;
        const end = pid * 3;
        let posQuestions = all.slice(start, end);
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

  const handleAnswerSelect = (answerIndex) => setSelectedAnswer(answerIndex);

  const handleNextQuestion = () => {
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      return;
    }

    // hitung skor
    let correct = 0;
    newAnswers.forEach((ans, idx) => {
      const q = questions[idx];
      if (q?.type === "true_false") {
        const correctIndex =
          typeof q.correct_answer === "boolean" ? (q.correct_answer ? 0 : 1) : q.correct_answer;
        if (ans === correctIndex) correct++;
      } else if (q?.type === "multiple_choice") {
        if (ans === q.correct_answer) correct++;
      }
    });
    const finalScore = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    setScore(finalScore);
    setShowResult(true);
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

  const progressWidth = useMemo(() => {
    const ratio = questions.length ? (currentQuestion + 1) / questions.length : 0;
    return Math.max(0.001, ratio * (INNER_W)); // jangan nol supaya tetap terlihat
  }, [currentQuestion, questions.length, INNER_W]);

  if (!isOpen || questions.length === 0) return null;
  const question = questions[currentQuestion];

  // posisi util
  const headerY = (CARD_H / 2) - PADDING_Y - (HEADER_H / 2);
  const footerY = -(CARD_H / 2) + PADDING_Y + (FOOTER_H / 2);
  const contentTopY = headerY - (HEADER_H / 2) - 0.12;
  const contentCenterY = (contentTopY + footerY) / 2 + 0.2;

  return (
    <a-entity position={position} visible={isOpen}>
      {/* Shadow/backplate */}
      <a-plane
        position={`0 0 -0.18`}
        width={CARD_W + 0.2}
        height={CARD_H + 0.2}
        color="#0B1020"
        opacity="0.18"
      ></a-plane>

      {/* Kartu utama */}
      <a-plane
        position={`0 0 -0.12`}
        width={CARD_W}
        height={CARD_H}
        color="#FFFFFF"
        opacity="0.98"
        material="shader: flat"
        animation="property: scale; from: 0.9 0.9 0.9; to: 1 1 1; dur: 300; easing: easeOutCubic"
      ></a-plane>

      {/* Header */}
      <a-plane
        position={`0 ${headerY} -0.1`}
        width={CARD_W}
        height={HEADER_H}
        color="#F8FAFC"
        material="shader: flat"
      ></a-plane>

      {/* Garis bawah header */}
      <a-plane
        position={`0 ${headerY - (HEADER_H / 2)} -0.09`}
        width={CARD_W}
        height="0.02"
        color="#E2E8F0"
      ></a-plane>

      {!showResult ? (
        <>
          {/* Judul & nomor soal */}
          <a-text
            value={`Quiz Pos ${posId}`}
            position={`${-CARD_W / 2 + PADDING_X} ${headerY + 0.08} 0`}
            color="#0F172A"
            width="8"
            align="left"
            baseline="center"
            font={FONT_URL}
            negate="false"
          ></a-text>

          <a-text
            value={`${currentQuestion + 1}/${questions.length}`}
            position={`${CARD_W / 2 - PADDING_X} ${headerY + 0.08} 0`}
            color="#64748B"
            width="6"
            align="right"
            baseline="center"
            font={FONT_URL}
            negate="false"
          ></a-text>

          {/* Tombol close */}
          <a-plane
            position={`${CARD_W / 2 - PADDING_X - 0.18} ${headerY - 0.06} 0.01`}
            width="0.36"
            height="0.36"
            color="#FEE2E2"
            class="clickable"
            onClick={onClose}
          >
            <a-text
              value="✕"
              position="0 0 0.01"
              color="#B91C1C"
              width="8"
              align="center"
              baseline="center"
              font={FONT_URL}
              negate="false"
            ></a-text>
          </a-plane>

          {/* Progress bar */}
          <a-plane
            position={`0 ${headerY - 0.25} 0.01`}
            width={INNER_W}
            height="0.12"
            color="#F1F5F9"
          ></a-plane>
          <a-plane
            position={`${-INNER_W / 2 + progressWidth / 2} ${headerY - 0.25} 0.02`}
            width={progressWidth}
            height="0.12"
            color="#3B82F6"
          ></a-plane>

          {/* Kontainer pertanyaan */}
          <a-plane
            position={`0 ${contentTopY - 0.35} -0.05`}
            width={INNER_W}
            height="0.9"
            color="#FAFAFA"
            opacity="0.65"
          ></a-plane>
          <a-text
            value={question?.question || "Loading..."}
            position={`${-INNER_W / 2 + 0.1} ${contentTopY - 0.25} 0`}
            color="#0F172A"
            width="6.6"
            wrap-count="40"
            align="left"
            baseline="top"
            font={FONT_URL}
            negate="false"
          ></a-text>

          {/* Opsi jawaban */}
          {question?.type === "true_false" ? (
            <>
              <AnswerButton
                x={-INNER_W / 4}
                y={contentCenterY - 0.15}
                w={INNER_W / 2 - 0.1}
                h={0.46}
                active={selectedAnswer === 0}
                labelLeftIcon="✓"
                label="True"
                onClick={() => handleAnswerSelect(0)}
              />
              <AnswerButton
                x={INNER_W / 4}
                y={contentCenterY - 0.15}
                w={INNER_W / 2 - 0.1}
                h={0.46}
                active={selectedAnswer === 1}
                labelLeftIcon="✗"
                danger
                label="False"
                onClick={() => handleAnswerSelect(1)}
              />
            </>
          ) : (
            (question?.options || []).map((option, index) => {
              const rowTop = contentCenterY - 0.15; // anchor
              const spacing = 0.38;
              const y = rowTop - index * spacing;
              return (
                <AnswerRow
                  key={index}
                  x={0}
                  y={y}
                  w={INNER_W}
                  h={0.34}
                  active={selectedAnswer === index}
                  badge={String.fromCharCode(65 + index)}
                  text={option}
                  onClick={() => handleAnswerSelect(index)}
                  font={FONT_URL}
                />
              );
            })
          )}

          {/* Footer: tombol navigasi */}
          <a-plane
            position={`${-INNER_W / 4} ${footerY} 0.01`}
            width={INNER_W / 2 - 0.1}
            height="0.42"
            color="#6B7280"
            class="clickable"
            onClick={onClose}
          >
            <a-text
              value="Cancel"
              position="0 0 0.01"
              color="white"
              width="6"
              align="center"
              baseline="center"
              font={FONT_URL}
              negate="false"
            ></a-text>
          </a-plane>

          <a-plane
            position={`${INNER_W / 4} ${footerY} 0.01`}
            width={INNER_W / 2 - 0.1}
            height="0.42"
            color={selectedAnswer !== null ? "#3B82F6" : "#CBD5E1"}
            class="clickable"
            onClick={selectedAnswer !== null ? handleNextQuestion : undefined}
          >
            <a-text
              value={currentQuestion < questions.length - 1 ? "Next →" : "Finish"}
              position="0 0 0.01"
              color="white"
              width="6"
              align="center"
              baseline="center"
              font={FONT_URL}
              negate="false"
            ></a-text>
          </a-plane>
        </>
      ) : (
        // ----- Result screen -----
        <>
          <a-circle
            position={`0 ${headerY - 0.2} 0.01`}
            radius="0.64"
            color={score >= 70 ? "#ECFDF5" : "#FEF2F2"}
          ></a-circle>

          <a-text
            value="🏆"
            position={`0 ${headerY - 0.2} 0.02`}
            width="15"
            align="center"
            baseline="center"
          ></a-text>

          <a-text
            value={`${score}%`}
            position={`0 ${contentCenterY + 0.4} 0`}
            color="#0F172A"
            width="12"
            align="center"
            baseline="center"
            font={FONT_URL}
            negate="false"
          ></a-text>

          <a-text
            value={score >= 70 ? "Excellent Work!" : "Keep Learning!"}
            position={`0 ${contentCenterY + 0.1} 0`}
            color="#1E293B"
            width="8"
            align="center"
            baseline="center"
            font={FONT_URL}
            negate="false"
          ></a-text>

          <a-text
            value={`You scored ${score} points out of 100`}
            position={`0 ${contentCenterY - 0.15} 0`}
            color="#64748B"
            width="6"
            align="center"
            baseline="center"
            font={FONT_URL}
            negate="false"
          ></a-text>

          <a-plane
            position={`0 ${footerY} 0.01`}
            width={INNER_W}
            height="0.48"
            color="#10B981"
            class="clickable"
            onClick={handleCloseQuiz}
          >
            <a-text
              value="Continue Tour →"
              position="0 0 0.01"
              color="white"
              width="6"
              align="center"
              baseline="center"
              font={FONT_URL}
              negate="false"
            ></a-text>
          </a-plane>
        </>
      )}
    </a-entity>
  );
}

/** Komponen opsi jawaban berbentuk bar penuh */
function AnswerRow({ x, y, w, h, active, badge, text, onClick, font }) {
  const baseColor = active ? "#2563EB" : "#E2E8F0";
  const fillColor = active ? "#DBEAFE" : "#F8FAFC";
  const textColor = active ? "#FFFFFF" : "#374151";
  const badgeBg = active ? "#FFFFFF" : "#94A3B8";
  const badgeText = active ? "#2563EB" : "#FFFFFF";

  return (
    <a-plane position={`${x} ${y} 0.01`} width={w} height={h} color={fillColor} class="clickable" onClick={onClick}>
      <a-plane position={`0 0 -0.01`} width={w + 0.04} height={h + 0.04} color={baseColor} opacity="0.8"></a-plane>

      {/* Badge kiri */}
      <a-circle position={`${-w / 2 + 0.25} 0 0.01`} radius="0.07" color={badgeBg}>
        <a-text
          value={badge}
          position="0 0 0.01"
          color={badgeText}
          width="8"
          align="center"
          baseline="center"
          font={font}
          negate="false"
        ></a-text>
      </a-circle>

      {/* Teks opsi */}
      <a-text
        value={text}
        position={`${-w / 2 + 0.45} 0 0.01`}
        color={textColor}
        width="6.5"
        wrap-count="46"
        align="left"
        baseline="center"
        font={font}
        negate="false"
      ></a-text>
    </a-plane>
  );
}

/** Komponen tombol jawaban True/False */
function AnswerButton({ x, y, w, h, active, labelLeftIcon, label, danger, onClick }) {
  const base = active ? (danger ? "#DC2626" : "#2563EB") : "#E2E8F0";
  const fill = active ? (danger ? "#FEE2E2" : "#DBEAFE") : "#F8FAFC";
  const text = active ? "#FFFFFF" : "#374151";
  const iconBg = danger ? "#EF4444" : "#10B981";

  return (
    <a-plane position={`${x} ${y} 0.01`} width={w} height={h} color={fill} class="clickable" onClick={onClick}>
      <a-plane position={`0 0 -0.01`} width={w + 0.04} height={h + 0.04} color={base} opacity="0.85"></a-plane>

      <a-circle position={`${-w / 2 + 0.25} 0 0.01`} radius="0.085" color={iconBg}>
        <a-text value={labelLeftIcon} position="0 0 0.01" color="#FFFFFF" width="8" align="center" baseline="center"></a-text>
      </a-circle>

      <a-text
        value={label}
        position={`${-w / 2 + 0.5} 0 0.01`}
        color={active ? "#0B1020" : text}
        width="5"
        align="left"
        baseline="center"
      ></a-text>
    </a-plane>
  );
}
