// "use client";
// import { useState, useEffect } from "react";
// import { useTour } from "../_context/TourContext";
// import { Trophy, ArrowRight, X, LoaderCircle } from "lucide-react";

// export default function QuizModal({ isOpen, onClose, posId }) {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [showResult, setShowResult] = useState(false);
//   const [score, setScore] = useState(0);
//   const { completeQuiz } = useTour();

//   useEffect(() => {
//     if (!isOpen) return;

//     // Reset state when modal is reopened for a new quiz
//     setCurrentQuestion(0);
//     setSelectedAnswer(null);
//     setUserAnswers([]);
//     setShowResult(false);
//     setScore(0);
//     setQuestions([]);

//     const loadQuestions = async () => {
//       try {
//         const res = await fetch("/quiz.json", { cache: "no-store" });
//         if (!res.ok) throw new Error("Failed to fetch quiz data");
        
//         const data = await res.json();
//         const allQuestions = Array.isArray(data?.questions) ? data.questions : [];
//         const pid = Number(posId) || 1;
//         const start = (pid - 1) * 3;
//         const end = pid * 3;
        
//         let posQuestions = allQuestions.slice(start, end);

//         // Fallback to the first 3 questions if the calculated slice is empty
//         if (posQuestions.length === 0 && allQuestions.length > 0) {
//           posQuestions = allQuestions.slice(0, Math.min(3, allQuestions.length));
//         }

//         setQuestions(posQuestions);
//       } catch (err) {
//         console.error("Error loading quiz:", err);
//         setQuestions([]); // Ensure questions are empty on error
//       }
//     };

//     loadQuestions();
//   }, [isOpen, posId]);

//   const handleAnswerSelect = (answerIndex) => {
//     setSelectedAnswer(answerIndex);
//   };

//   const handleNextQuestion = () => {
//     const newAnswers = [...userAnswers, selectedAnswer];
//     setUserAnswers(newAnswers);

//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion((prev) => prev + 1);
//       setSelectedAnswer(null);
//     } else {
//       // Calculate final score
//       let correctAnswers = 0;
//       newAnswers.forEach((answer, index) => {
//         const question = questions[index];
//         if (question.type === "multiple_choice") {
//           if (answer === question.correct_answer) {
//             correctAnswers++;
//           }
//         } else if (question.type === "true_false") {
//           const correctIndex = question.correct_answer ? 0 : 1;
//           if (answer === correctIndex) {
//             correctAnswers++;
//           }
//         }
//       });

//       const finalScore = questions.length > 0
//         ? Math.round((correctAnswers / questions.length) * 100)
//         : 0;
//       setScore(finalScore);
//       setShowResult(true);
//     }
//   };

//   const handleCloseQuiz = () => {
//     completeQuiz(posId, score);
//     onClose?.();
//   };
  
//   if (!isOpen) return null;

//   // --- Loading State ---
//   if (questions.length === 0) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 text-center">
//           <LoaderCircle className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
//           <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Quiz</h3>
//           <p className="text-gray-500">Preparing the questions for you...</p>
//         </div>
//       </div>
//     );
//   }

//   const question = questions[currentQuestion];
//   const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//         {/* --- Quiz View --- */}
//         {!showResult ? (
//           <>
//             {/* Header Section */}
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-gray-800">Quiz Pos {posId}</h2>
//                 <button
//                   onClick={onClose}
//                   className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 p-2 rounded-full transition-colors"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="flex justify-between items-baseline text-sm text-gray-600 mb-2">
//                 <span>Question {currentQuestion + 1} of {questions.length}</span>
//                 <span>{Math.round(progressPercentage)}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div
//                   className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
//                   style={{ width: `${progressPercentage}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Content Section (Scrollable) */}
//             <div className="flex-1 p-6 overflow-y-auto">
//               <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
//                 {question.question}
//               </h3>
//               <div className="space-y-4">
//                 {question.type === "true_false" ? (
//                   <>
//                     {/* True Button */}
//                     <button
//                       onClick={() => handleAnswerSelect(0)}
//                       className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 flex items-center space-x-4 ${
//                         selectedAnswer === 0
//                           ? "border-green-500 bg-green-50 shadow-md"
//                           : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${ selectedAnswer === 0 ? "border-green-500 bg-green-500" : "border-gray-400"}`}>
//                          {selectedAnswer === 0 && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
//                       </div>
//                       <span className="font-semibold text-gray-800">True</span>
//                     </button>
//                     {/* False Button */}
//                     <button
//                       onClick={() => handleAnswerSelect(1)}
//                       className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 flex items-center space-x-4 ${
//                         selectedAnswer === 1
//                           ? "border-red-500 bg-red-50 shadow-md"
//                           : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//                       }`}
//                     >
//                        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${ selectedAnswer === 1 ? "border-red-500 bg-red-500" : "border-gray-400"}`}>
//                          {selectedAnswer === 1 && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
//                       </div>
//                       <span className="font-semibold text-gray-800">False</span>
//                     </button>
//                   </>
//                 ) : (
//                   (question.options || []).map((option, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleAnswerSelect(index)}
//                       className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 flex items-center space-x-4 ${
//                         selectedAnswer === index
//                           ? "border-blue-500 bg-blue-50 shadow-md"
//                           : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
//                         selectedAnswer === index
//                           ? "border-blue-600 bg-blue-600 text-white"
//                           : "border-gray-400 text-gray-500"
//                       }`}>
//                         {String.fromCharCode(65 + index)}
//                       </div>
//                       <span className="font-medium text-gray-800">{option}</span>
//                     </button>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Footer Section */}
//             <div className="p-6 bg-gray-50 border-t border-gray-200">
//               <div className="flex justify-end">
//                 <button
//                   onClick={handleNextQuestion}
//                   disabled={selectedAnswer === null}
//                   className="px-8 py-3 rounded-lg font-semibold text-white flex items-center space-x-2 transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-300"
//                 >
//                   <span>
//                     {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
//                   </span>
//                   <ArrowRight size={18} />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           /* --- Results View --- */
//           <div className="p-8 text-center flex flex-col items-center justify-center h-full">
//             <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
//                 score >= 70 ? "bg-green-100" : "bg-orange-100"
//               }`}
//             >
//               <Trophy className={`w-12 h-12 ${
//                   score >= 70 ? "text-green-600" : "text-orange-600"
//                 }`}
//               />
//             </div>
//             <h3 className={`text-5xl font-bold mb-2 ${
//                 score >= 70 ? "text-green-600" : "text-orange-600"
//               }`}
//             >
//               {score}%
//             </h3>
//             <h4 className="text-2xl font-bold text-gray-800 mb-2">
//               {score >= 70 ? "Excellent Work!" : "Good Effort!"}
//             </h4>
//             <p className="text-gray-600 mb-10 max-w-xs">
//               You answered {Math.round((score / 100) * questions.length)} out of {questions.length} questions correctly.
//             </p>
//             <button
//               onClick={handleCloseQuiz}
//               className="w-full max-w-xs px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-blue-300"
//             >
//               <span>Continue Tour</span>
//               <ArrowRight size={18} />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }