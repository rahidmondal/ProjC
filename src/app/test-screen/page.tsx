"use client";
import React, { useState, useEffect, useCallback } from "react"; 
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from 'next/navigation';
import questionsData from "../data/questions.json";
import { getCurrentUser } from "../services/auth";
import { saveTestResult } from "../services/skillTest";
import { updateUserSkillScore } from "../services/users";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string | number; 
}

const TestScreen = () => {
  const searchParams = useSearchParams();
  const skill = searchParams.get("skill");
  const level = searchParams.get("level");
  const type = searchParams.get("type");
  const router = useRouter();

  // State variables using the specific Question interface
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [timer, setTimer] = useState(600); // 10 minutes
  const [showReview, setShowReview] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Effect to fetch the current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUserId(user?.$id || null);
    };
    fetchUser();
  }, []); // Empty dependency array: runs once on mount

  // Effect to load questions based on skill, level, and type
  useEffect(() => {
    if (skill && level && type !== "GenAI(Experimental)") {
      const filteredData = questionsData.find(
        (item) => item.skill === skill && item.level === level
      );

      if (filteredData?.questionsJson) {
        setQuestions(filteredData.questionsJson as Question[]);
        setTimer(300); 
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setTestFinished(false);
        setShowReview(false); 
      } else {
        console.log(`No questions found for skill: ${skill} and level: ${level}`);
        setQuestions([]); 
      }
    }
  }, [skill, level, type]); 

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

    if (userId && skill && level) {
      try {
        await saveTestResult(
          userId,
          skill,
          level,
          finalScore,
          questions.length,
          finalScore 
        );
        console.log("Test result history saved successfully.");

        await updateUserSkillScore(userId, skill, level, finalScore);
        console.log("User profile skill score updated.");

      } catch (error) {
        console.error("Error saving test result or updating profile:", error);
      }
    } else {
      console.warn("User ID, skill, or level is not available. Cannot save test result or update profile.");
    }

    console.log("Test finished. Score:", finalScore);
  }, [
    testFinished,
    calculateScore,
    userId,
    skill,
    level,
    questions
  ]);

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
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, questions.length - 1)
    );
  };

  const toggleReview = () => {
     if(!testFinished) {
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
    return <div>Redirecting...</div>;
  }


   if (questions.length === 0 && skill && level) {
     return <div>Checking for questions for {skill} - {level}... If this persists, none may be available.</div>;
   }

   if (questions.length === 0) {
     return <div>Loading...</div>;
   }


  const currentQuestion = questions[currentQuestionIndex];

  const minutes = Math.floor(timer / 60);
  const seconds = String(timer % 60).padStart(2, "0");

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Timer Display */}
        <div className="flex justify-end p-4">
          <div
            className={`rounded-full shadow-md px-4 py-2 text-lg font-semibold ${
              timer > 120
                ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                : timer > 60
                ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
                : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
            }`}
          >
            Time: {minutes}:{seconds}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center flex-grow px-4">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 text-center">
            {skill} - {level} Test
          </h1>

          {/* Test Finished View */}
          {testFinished ? (
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl text-center">
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-4">Test Completed!</h2>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-2">
                Your Score: {score} / {questions.length}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-2">
                Correct Answers: {score}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-xl mb-6">
                Incorrect Answers: {questions.length - score}
              </p>
              <button
                onClick={handleReturnToProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
              >
                Return to Profile
              </button>
            </div>
          ) : (
            <>
              {/* Progress Indicator */}
              <div className="w-full max-w-2xl mb-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-500 dark:bg-green-600 h-2.5 rounded-full transition-width duration-300 ease-in-out"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question/Review Area */}
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl min-h-[300px]">
                {!showReview ? (
                  // Question View
                 <>
                   <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                     Question {currentQuestionIndex + 1} of {questions.length}
                   </p>
                  <p className="text-gray-800 dark:text-gray-100 text-xl mb-6 font-medium">{currentQuestion?.question}</p>
                  {/* Map through options */}
                  {currentQuestion?.options.map((option: string, index: number) => (
                    <div key={index} className="mb-4">
                      <label
                        className={`flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-3 cursor-pointer border border-transparent ${
                            userAnswers[currentQuestionIndex] === option ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500 dark:text-indigo-400 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 mr-3"
                          name={`question-${currentQuestionIndex}`}
                          value={option}
                          checked={userAnswers[currentQuestionIndex] === option}
                          onChange={() => handleAnswerChange(currentQuestionIndex, option)} 
                        />
                        <span className="text-lg">{option}</span>
                      </label>
                    </div>
                  ))}
                 </>
                    ) : (
                      <>
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Review My Answers</h2>
                      {/* Map through all questions for review */}
                      {questions.map((question, index) => (
                        <div key={`review-${index}`} className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <p className="text-gray-700 dark:text-gray-200 text-lg mb-2 font-medium">
                            {index + 1}. {question.question}
                          </p>
                          <p className="text-base text-gray-800 dark:text-gray-300">
                            Your Answer: {userAnswers[index] || <span className="italic text-gray-500 dark:text-gray-400">Not Answered</span>}
                          </p>
                        </div>
                      ))}
                      </>
                    )}
              </div>

              {/* Navigation and Action Buttons */}
             <div className="flex flex-col sm:flex-row justify-between w-full max-w-2xl mb-8 gap-4">
                 {/* Question Navigation (Hidden during review) */}
                 {!showReview && (
                     <div className="flex justify-between flex-grow gap-4">
                       <button
                         onClick={goToPreviousQuestion}
                         className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                         disabled={currentQuestionIndex === 0}
                       >
                         Previous
                       </button>
                       <button
                         onClick={goToNextQuestion}
                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                         disabled={currentQuestionIndex === questions.length - 1}
                       >
                         Next
                       </button>
                     </div>
                   )}

                {/* Review and Submit Buttons */}
                <div className={`flex ${showReview ? 'justify-center w-full' : 'sm:justify-end'} gap-4`}> 
                  <button
                    onClick={toggleReview}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                  >
                    {showReview ? "Back to Test" : "Review"}
                  </button>
                  {/* Submit Button (Hidden during review) */}
                  {!showReview && (
                    <button
                      onClick={handleSubmit} 
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                      disabled={testFinished}
                    >
                      Submit
                    </button>
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

export default TestScreen;