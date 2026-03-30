import React, { useEffect, useState, useCallback } from "react";
import Choices from "./Choices";
import Error from "./Error";
import Restart from "./Restart";
import Timer from "./TImer";

const QUIZ_SIZE = 15;

function shuffleAndSlice(arr, size) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, size);
}

function saveAttemptToHistory({
  score,
  total,
  selectedAnswers,
  activeQuestions,
}) {
  const attempt = {
    date: new Date().toISOString(),
    score,
    total,
    selectedAnswers,
    questionIds: activeQuestions.map((q) => q.id),
  };
  const existing = JSON.parse(localStorage.getItem("HISTORY") || "[]");
  const updated = [attempt, ...existing].slice(0, 5);
  localStorage.setItem("HISTORY", JSON.stringify(updated));
}

export default function Questions({ questions }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem("CURRENT_QUESTION");
    return saved ? JSON.parse(saved) : 0;
  });
  const [showScore, setShowScore] = useState(() => {
    const saved = localStorage.getItem("SHOW_SCORE");
    return saved ? JSON.parse(saved) : false;
  });
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("SCORE");
    return saved ? JSON.parse(saved) : 0;
  });
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem("ANSWERS");
    return saved ? JSON.parse(saved) : {};
  });

  if (activeQuestions.length === 0 && questions.length > 0) {
    const savedIds = localStorage.getItem("ACTIVE_QUESTION_IDS");
    if (savedIds) {
      const ids = JSON.parse(savedIds);
      const restored = ids
        .map((id) => questions.find((q) => q.id === id))
        .filter(Boolean);
      if (restored.length > 0) {
        setActiveQuestions(restored);
      } else {
        setActiveQuestions(shuffleAndSlice(questions, QUIZ_SIZE));
      }
    } else {
      setActiveQuestions(shuffleAndSlice(questions, QUIZ_SIZE));
    }
  }

  useEffect(() => {
    if (activeQuestions.length === 0) return;
    localStorage.setItem(
      "ACTIVE_QUESTION_IDS",
      JSON.stringify(activeQuestions.map((q) => q.id)),
    );
  }, [activeQuestions]);

  useEffect(() => {
    localStorage.setItem("ANSWERS", JSON.stringify(selectedAnswers));
    localStorage.setItem("SCORE", JSON.stringify(score));
    localStorage.setItem("CURRENT_QUESTION", JSON.stringify(currentQuestion));
    localStorage.setItem("SHOW_SCORE", JSON.stringify(showScore));
  }, [selectedAnswers, score, currentQuestion, showScore]);

  const handleRestart = useCallback(() => {
    const newSet = shuffleAndSlice(questions, QUIZ_SIZE);
    setActiveQuestions(newSet);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setShowScore(false);
    setQuizStarted(false);
    localStorage.removeItem("ANSWERS");
    localStorage.removeItem("SCORE");
    localStorage.removeItem("CURRENT_QUESTION");
    localStorage.removeItem("ACTIVE_QUESTION_IDS");
    localStorage.removeItem("SHOW_SCORE");
  }, [questions]);

  const handleSubmit = useCallback(() => {
    let newScore = 0;
    activeQuestions.forEach((item) => {
      if (selectedAnswers[item.id] === item.answer) newScore += 1;
    });
    saveAttemptToHistory({
      score: newScore,
      total: activeQuestions.length,
      selectedAnswers,
      activeQuestions,
    });
    setScore(newScore);
    setShowScore(true);
  }, [activeQuestions, selectedAnswers]);

  if (!activeQuestions || activeQuestions.length === 0) return null;

  const question = activeQuestions[currentQuestion];
  const isLastQuestion = currentQuestion + 1 === activeQuestions.length;

  const handleChange = (choice) => {
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: choice }));
    setError("");
  };

  const handleNext = () => {
    if (!selectedAnswers[question.id]) {
      setError("Please select an answer before proceeding!");
      return;
    }
    setError("");
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => prev - 1);
    setError("");
  };

  if (showScore) {
    return (
      <Restart
        score={score}
        questions={activeQuestions}
        onRestart={handleRestart}
      />
    );
  }

  // Start screen — shown before quiz begins
  if (!quizStarted) {
    return (
      <div className="score-screen">
        <p className="score-label">Ready?</p>
        <p className="score-total">
          {activeQuestions.length} questions · 30 seconds each
        </p>
        <br />
        <button className="primary" onClick={() => setQuizStarted(true)}>
          Start Quiz
        </button>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / activeQuestions.length) * 100;

  return (
    <div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div style={{ padding: "32px 0 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <p className="question-label">
            Question {currentQuestion + 1} of {activeQuestions.length}
          </p>
          <Timer
            quizStarted={quizStarted}
            setCurrentQuestion={setCurrentQuestion}
            currentQuestion={currentQuestion}
            isLastQuestion={isLastQuestion}
            onAutoSubmit={handleSubmit}
          />
        </div>

        <p className="question-text">{question.question}</p>

        <Choices
          questionId={question.id}
          choices={question.choices}
          selectedAnswer={selectedAnswers[question.id]}
          onSelect={(choice) => handleChange(choice)}
        />

        {error && <Error error={error} />}

        <div className="button-row">
          {currentQuestion > 0 && (
            <button onClick={handlePrevious}>← Prev</button>
          )}
          <button className="primary" onClick={handleNext}>
            {isLastQuestion ? "Submit" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
