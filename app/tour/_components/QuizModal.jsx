"use client";
import { useState, useEffect } from 'react';
import { useTour } from '../_context/TourContext';

export default function QuizModal({ isOpen, onClose, posId }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { completeQuiz } = useTour();

  useEffect(() => {
    if (isOpen) {
      // Load quiz questions from public/quiz.json
      fetch('/quiz.json')
        .then(res => res.json())
        .then(data => {
          // Filter questions for current pos or use random questions
          const posQuestions = data.questions.slice((posId - 1) * 3, posId * 3);
          setQuestions(posQuestions);
        })
        .catch(err => console.error('Error loading quiz:', err));
    }
  }, [isOpen, posId]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score
      let correctAnswers = 0;
      newAnswers.forEach((answer, index) => {
        const question = questions[index];
        if (question.type === 'true_false') {
          if (answer === (question.correct_answer ? 0 : 1)) correctAnswers++;
        } else if (question.type === 'multiple_choice') {
          if (answer === question.correct_answer) correctAnswers++;
        }
      });
      
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleCloseQuiz = () => {
    completeQuiz(posId, score);
    onClose();
    // Reset quiz state
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  if (!isOpen || questions.length === 0) return null;

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showResult ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Quiz Pos {posId}
              </h2>
              <div className="text-sm text-gray-500">
                {currentQuestion + 1} / {questions.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {question.question}
              </h3>

              {/* Answer Options */}
              <div className="space-y-3">
                {question.type === 'true_false' ? (
                  <>
                    <button
                      onClick={() => handleAnswerSelect(0)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === 0
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      True
                    </button>
                    <button
                      onClick={() => handleAnswerSelect(1)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === 1
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      False
                    </button>
                  </>
                ) : (
                  question.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
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
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-6 py-2 rounded-lg font-medium ${
                  selectedAnswer !== null
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="p-6 text-center">
            <div className="mb-6">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold ${
                score >= 70 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {score}
              </div>
              <h3 className="text-2xl font-bold mt-4 mb-2">
                {score >= 70 ? 'Great Job!' : 'Keep Learning!'}
              </h3>
              <p className="text-gray-600">
                You scored {score} points!
              </p>
            </div>

            <button
              onClick={handleCloseQuiz}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Continue Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}