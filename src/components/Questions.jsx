import React, { useEffect, useState } from "react";
import Choices from "./Choices";
import Error from "./Error";
import Restart from "./Restart";

export default function Questions({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem("CURRENT_QUESTION");
    return saved ? JSON.parse(saved) : 0;
  });
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("SCORE");
    return saved ? JSON.parse(saved) : 0;
  });
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem("ANSWERS");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("ANSWERS", JSON.stringify(selectedAnswers));
    localStorage.setItem("SCORE", JSON.stringify(score));
    localStorage.setItem("CURRENT_QUESTION", JSON.stringify(currentQuestion));
  }, [selectedAnswers, score, currentQuestion]);

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((item) => {
      if (selectedAnswers[item.id] === item.answer) newScore += 1;
    });

    setScore(newScore);
    return true;
  };

  if (!questions || questions.length === 0) return null;

  const question = questions[currentQuestion];

  const handleChange = (choice) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: choice,
    }));
    setError("");
  };

  const handleNext = () => {
    if (!selectedAnswers[question.id]) {
      setError("Please select an answer before proceeding!");
      return;
    }

    setError("");

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const isValid = handleSubmit();
      if (isValid) setShowScore(true);
    }
  };

  if (showScore) {
    return (
      <Restart
        score={score}
        questions={questions}
        setCurrentQuestion={setCurrentQuestion}
        setSelectedAnswers={setSelectedAnswers}
        setScore={setScore}
        setShowScore={setShowScore}
      />
    );
  }

  return (
    <div>
      <p style={{ marginBottom: "20px", fontSize: "24px" }}>
        <strong>Question {currentQuestion + 1}:</strong> {question.question}
      </p>

      <Choices
        questionId={question.id}
        choices={question.choices}
        selectedAnswer={selectedAnswers[question.id]}
        onSelect={(choice) => handleChange(choice)}
      />

      {error && <Error error={error} />}

      <button onClick={handleNext} style={{ marginTop: "10px" }}>
        {currentQuestion + 1 === questions.length ? "Submit" : "Next"}
      </button>
    </div>
  );
}
