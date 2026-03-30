export default function Choices({
  questionId,
  choices,
  selectedAnswer,
  onSelect,
}) {
  return (
    <div className="choices">
      {choices.map((choice, index) => (
        <label
          key={index}
          className={`choice-label ${selectedAnswer === choice ? "selected" : ""}`}
        >
          <input
            type="radio"
            name={`question-${questionId}`}
            value={choice}
            checked={selectedAnswer === choice}
            onChange={() => onSelect(choice)}
          />
          {choice}
        </label>
      ))}
    </div>
  );
}
