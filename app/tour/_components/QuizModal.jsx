"use client";
import { useState, useEffect } from "react";
import { useTour } from "../_context/TourContext";
import {
  Trophy,
  CheckCircle,
  XCircle,
  ArrowRight,
  X,
  HelpCircle, // <- FIX: tambahkan import ini
} from "lucide-react";

export default function QuizModal({ isOpen, onClose, posId }) {
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

        // Pastikan posId angka
        const pid = Number(posId) || 1;
        const start = (pid - 1) * 3;
        const end = pid * 3;

        let posQuestions = all.slice(start, end);

        // fallback: jika kurang dari 1 pertanyaan, ambil 3 pertama
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
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
    } else {
      // Hitung skor
      let correct = 0;
      newAnswers.forEach((ans, idx) => {
        const q = questions[idx];

        if (q?.type === "true_false") {
          // Asumsi: correct_answer bisa boolean (true/false)
          // kita mapping: True -> index 0, False -> index 1
          const correctIndex =
            typeof q.correct_answer === "boolean"
              ? q.correct_answer
                ? 0
                : 1
              : q.correct_answer; // jika sudah berupa index
          if (ans === correctIndex) correct++;
        } else if (q?.type === "multiple_choice") {
          if (ans === q.correct_answer) correct++;
        }
      });

      const finalScore =
        questions.length > 0
          ? Math.round((correct / questions.length) * 100)
          : 0;
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleCloseQuiz = () => {
    completeQuiz(posId, score);
    onClose?.();
    // Reset state
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResult(false);
    setScore(0);
    setQuestions([]);
  };

  if (!isOpen) return null;
  if (!questions || questions.length === 0) {
    // Optional: skeleton / fallback singkat
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          <p className="text-gray-600">Memuat kuis… atau tidak ada pertanyaan.</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showResult ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Quiz Pos {posId}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {currentQuestion + 1} / {questions.length}
                </span>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {question?.question}
              </h3>

              {/* Answer Options */}
              <div className="space-y-3">
                {question?.type === "true_false" ? (
                  <>
                    <button
                      onClick={() => handleAnswerSelect(0)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${
                        selectedAnswer === 0
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      True
                    </button>
                    <button
                      onClick={() => handleAnswerSelect(1)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${
                        selectedAnswer === 1
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                      False
                    </button>
                  </>
                ) : (
                  (question?.options || []).map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  selectedAnswer !== null
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="p-6 text-center">
            <div className="mb-6">
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  score >= 70 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Trophy
                  className={`w-12 h-12 ${
                    score >= 70 ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>
              <div className="text-4xl font-bold mt-4 mb-2">{score}%</div>
              <h3 className="text-2xl font-bold mb-2">
                {score >= 70 ? "Great Job!" : "Keep Learning!"}
              </h3>
              <p className="text-gray-600">You scored {score} points!</p>
            </div>

            <button
              onClick={handleCloseQuiz}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              Continue Tour
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
