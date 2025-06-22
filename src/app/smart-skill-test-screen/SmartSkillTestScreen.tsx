"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { getCurrentUser } from "../services/auth";
import { saveTestResult } from "../services/skillTest";
import { updateUserSkillScore } from "../services/users";
import questionsData from "../data/questions.json";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string | number;
}

const SmartSkillTestScreen = () => {
  const searchParams = useSearchParams();
  const skill = searchParams.get("skill");
  const level = searchParams.get("level");
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [timer, setTimer] = useState(600);
  const [showReview, setShowReview] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUserId(user?.$id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (skill && level) {
      const fetchQuestions = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/genAI/generate-questions?skill=${skill}&level=${level}`);
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const data = await response.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setQuestions(data);
          } else {
            throw new Error('Received empty questions from AI');
          }
        } catch {
          const fallbackData = questionsData.find(
            (item) => item.skill === skill && item.level === level
          );
          if (fallbackData?.questionsJson && Array.isArray(fallbackData.questionsJson) && fallbackData.questionsJson.length > 0) {
            setQuestions(fallbackData.questionsJson);
          } else {
            setQuestions([]);
          }
        } finally {
          setTimer(300);
          setUserAnswers({});
          setCurrentQuestionIndex(0);
          setTestFinished(false);
          setShowReview(false);
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [skill, level]);

  const calculateScore = useCallback(() => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (String(userAnswers[index]) === String(question.correctAnswer)) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    return correctAnswers;
  }, [questions, userAnswers]);

  const handleSubmit = useCallback(async () => {
    if (testFinished) return;
    const finalScore = calculateScore();
    setTestFinished(true);
    setTimer(0);
    const modifiedSkill = `${skill} {SmartTest}`;
    if (userId && skill && level) {
      try {
        await saveTestResult(userId, modifiedSkill, level, finalScore, questions.length, finalScore);
        await updateUserSkillScore(userId, modifiedSkill, level, finalScore);
      } catch {
        // error intentionally ignored
      }
    }
  }, [testFinished, calculateScore, userId, skill, level, questions]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timer > 0 && !testFinished && questions.length > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer <= 0 && !testFinished && questions.length > 0) {
      handleSubmit();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer, testFinished, questions.length, handleSubmit]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers((prevAnswers) => ({ ...prevAnswers, [questionIndex]: answer }));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const toggleReview = () => {
    if (!testFinished) {
      calculateScore();
    }
    setShowReview((prevShowReview) => !prevShowReview);
  };

  const handleReturnToProfile = () => {
    router.push('/user-profile');
  };

  useEffect(() => {
    if (!skill || !level) {
      alert("Please select a skill and level.");
      router.push('/skill-test');
    }
  }, [router, skill, level]);

  if (!skill || !level) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl text-center">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Please select a skill and level.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl text-center">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading questions...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (questions.length === 0) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl text-center">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">No questions available.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timer / 60);
  const seconds = String(timer % 60).padStart(2, "0");

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex justify-end p-4">
          <div className={`rounded-full shadow-md px-4 py-2 text-lg font-semibold ${timer > 120 ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100" : timer > 60 ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100" : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"}`}>
            Time: {minutes}:{seconds}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow px-4">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 text-center">
            {skill}{'{SmartTest}'} - {level} Test
          </h1>
          {testFinished ? (
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl text-center">
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-4">Test Completed!</h2>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-2">Your Score: {score} / {questions.length}</p>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-2">Correct Answers: {score}</p>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-6">Incorrect Answers: {questions.length - score}</p>
              <button onClick={handleReturnToProfile} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200">Return to Profile</button>
            </div>
          ) : (
            <>
              <div className="w-full max-w-2xl mb-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 dark:bg-green-600 h-2.5 rounded-full transition-width duration-300 ease-in-out" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl min-h-[300px]">
                {!showReview ? (
                  <>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <p className="text-gray-800 dark:text-gray-100 text-xl mb-6 font-medium">{currentQuestion?.question}</p>
                    {currentQuestion?.options.map((option: string, index: number) => (
                      <div key={index} className="mb-4">
                        <label className={`flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-3 cursor-pointer border border-transparent ${userAnswers[currentQuestionIndex] === option ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' : ''}`}>
                          <input type="radio" className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500 dark:text-indigo-400 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 mr-3" name={`question-${currentQuestionIndex}`} value={option} checked={userAnswers[currentQuestionIndex] === option} onChange={() => handleAnswerChange(currentQuestionIndex, option)} />
                          <span className="text-lg">{option}</span>
                        </label>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Review My Answers</h2>
                    {questions.map((question, index) => (
                      <div key={`review-${index}`} className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <p className="text-gray-700 dark:text-gray-200 text-lg mb-2 font-medium">{index + 1}. {question.question}</p>
                        <p className="text-base text-gray-800 dark:text-gray-300">Your Answer: {userAnswers[index] || <span className="italic text-gray-500 dark:text-gray-400">Not Answered</span>}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-between w-full max-w-2xl mb-8 gap-4">
                {!showReview && (
                  <div className="flex justify-between flex-grow gap-4">
                    <button onClick={goToPreviousQuestion} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200" disabled={currentQuestionIndex === 0}>Previous</button>
                    <button onClick={goToNextQuestion} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200" disabled={currentQuestionIndex === questions.length - 1}>Next</button>
                  </div>
                )}
                <div className={`flex ${showReview ? 'justify-center w-full' : 'sm:justify-end'} gap-4`}>
                  <button onClick={toggleReview} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200">{showReview ? "Back to Test" : "Review"}</button>
                  {!showReview && (
                    <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200" disabled={testFinished}>Submit</button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SmartSkillTestScreen;