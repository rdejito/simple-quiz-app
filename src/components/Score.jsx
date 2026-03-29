export default function Score({ score, questions }) {
  return (
    <div>
      <h2>
        Your Score: {score} / {questions.length}
      </h2>
    </div>
  );
}
