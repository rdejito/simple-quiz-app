export default function Restart({
  score,
  questions,
  setCurrentQuestion,
  setSelectedAnswers,
  setScore,
  setShowScore,
}) {
  return (
    <div>
      <h2>
        Your Score: {score} / {questions.length}
      </h2>
      <button
        onClick={() => {
          setCurrentQuestion(0);
          setSelectedAnswers({});
          setScore(0);
          setShowScore(false);
          localStorage.removeItem("ANSWERS");
          localStorage.removeItem("SCORE");
          localStorage.removeItem("CURRENT_QUESTION");
        }}
      >
        Restart Quiz
      </button>
    </div>
  );
}
