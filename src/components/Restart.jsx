export default function Restart({ score, questions, onRestart }) {
  return (
    <div className="score-screen">
      <p className="score-label">Your score</p>
      <p className="score-value">{score}</p>
      <p className="score-total">out of {questions.length}</p>
      <button className="primary" onClick={onRestart}>
        Restart Quiz
      </button>
    </div>
  );
}
