"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from 'next/navigation';

const TestScreen = () => {
  const searchParams = useSearchParams();
  const skill = searchParams.get("skill");
  const level = searchParams.get("level");
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timer, setTimer] = useState(600);
  const [showReview, setShowReview] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [score, setScore] = useState(0);
  const testScreenRef = useRef(null);

  useEffect(() => {
    if (skill && level) {

      // Currently it has Placeholder questions
      const loadedQuestions = [
        {
          question: "What is the purpose of the 'git clone' command?",
          options: ["To create a new repository", "To copy a repository from a remote source", "To merge two branches", "To delete a repository"],
          correctAnswer: "To copy a repository from a remote source",
        },
        {
          question: "Which data structure follows the LIFO (Last In, First Out) principle?",
          options: ["Queue", "Stack", "Linked List", "Tree"],
          correctAnswer: "Stack",
        },
        {
          question: "What is the time complexity of searching for an element in a balanced binary search tree?",
          options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
          correctAnswer: "O(log n)",
        },
        {
          question: "What is the role of a compiler?",
          options: ["To interpret code line by line", "To translate high-level code to machine code", "To debug code", "To execute code directly"],
          correctAnswer: "To translate high-level code to machine code",
        },
        {
          question: "Which of the following is NOT a database management system?",
          options: ["MySQL", "PostgreSQL", "MongoDB", "HTML"],
          correctAnswer: "HTML",
        },
        {
          question: "What is the purpose of a firewall?",
          options: ["To speed up internet connection", "To protect a network from unauthorized access", "To cool down a computer", "To improve Wi-Fi signal"],
          correctAnswer: "To protect a network from unauthorized access",
        },
        {
          question: "What is cloud computing?",
          options: ["Storing data on a local hard drive", "Delivering computing services over the internet", "Using a specific operating system", "Developing mobile applications"],
          correctAnswer: "Delivering computing services over the internet",
        },
        {
          question: "What is the primary function of an operating system?",
          options: ["To run web browsers", "To manage hardware and software resources", "To create documents", "To play video games"],
          correctAnswer: "To manage hardware and software resources",
        },
        {
          question: "Which of the following is an example of an interpreted language?",
          options: ["C", "C++", "Java", "Python"],
          correctAnswer: "Python",
        },
        {
          question: "What is the purpose of a version control system like Git?",
          options: ["To write code faster", "To track changes to code over time", "To design user interfaces", "To manage databases"],
          correctAnswer: "To track changes to code over time",
        },
      ];
      setQuestions(loadedQuestions);
    }
  }, [skill, level]);

  useEffect(() => {
    let intervalId;

    if (timer > 0 && !testFinished) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer <= 0 && !testFinished) {
      handleSubmit();
    }

    return () => clearInterval(intervalId);
  }, [timer, testFinished]);

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    return correctAnswers;
  };

  const handleSubmit = async () => {
    // Calculate score
    const correctAnswers = calculateScore();
    setTestFinished(true);
    setTimer(0); // Stop the timer
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
    setShowReview((prevShowReview) => !prevShowReview);
  };

  const handleReturnToProfile = () => {
    router.push('/user-profile'); //  route to your profile page
  };

  if (!skill || !level) {
    return <div>Error: Skill and level must be selected.</div>;
  }

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];


  return (
    <ProtectedRoute>
      <div ref={testScreenRef} className="flex flex-col min-h-screen bg-gray-100">
        {/* Timer */}
        <div className="flex justify-end p-4">
          <div
            className={`rounded-full shadow-md px-4 py-2 text-lg font-semibold ${timer > 300
              ? "bg-green-200 text-green-700"
              : timer > 100
                ? "bg-yellow-200 text-yellow-700"
                : "bg-red-200 text-red-700"
              }`}
          >
            Time: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-grow px-4">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
            {skill} - {level} Test
          </h1>

          {testFinished ? (
            <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Test Completed!</h2>
              <p className="text-gray-700 text-xl mb-2">
                Your Score: {score} / {questions.length}
              </p>
              <p className="text-gray-700 text-xl mb-2">
                Correct Answers: {score}
              </p>
              <p className="text-gray-700 text-xl mb-4">
                Incorrect Answers: {questions.length - score}
              </p>
              <button
                onClick={handleReturnToProfile}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Return to Profile
              </button>
            </div>
          ) : (
            <>
              {/* Progress Indicator */}
              <div className="w-full max-w-2xl mb-4 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              {!showReview ? (
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl">
                  <p className="text-gray-700 text-xl mb-6">{currentQuestion.question}</p>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="mb-4">
                      <label
                        className="flex items-center text-gray-700 hover:bg-gray-100 rounded-md p-2"
                      >
                        <input
                          type="radio"
                          className="form-radio h-6 w-6 text-indigo-600 focus:ring-indigo-500 mr-3"
                          name={`question-${currentQuestionIndex}`}
                          value={option}
                          checked={userAnswers[currentQuestionIndex] === option}
                          onChange={() => handleAnswerChange(currentQuestionIndex, option)}
                        />
                        <span className="text-lg">{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Review</h2>
                  {questions.map((question, index) => (
                    <div key={index} className="mb-6">
                      <p className="text-gray-700 text-xl">{question.question}</p>
                      <p className="text-gray-600">
                        Your Answer: {userAnswers[index] || "Not Answered"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Question Navigation */}
              {!showReview && (
                <div className="flex justify-between w-full max-w-2xl mb-8">
                  <button
                    onClick={goToPreviousQuestion}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextQuestion}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Review and Submit Buttons */}
              <div className="flex justify-center w-full max-w-2xl mb-8">
                <button
                  onClick={toggleReview}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                  {showReview ? "Hide Review" : "Review"}
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TestScreen;