import React, { useState } from "react";

export default function Questions({ questions }) {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);

    const handleChange = (questionId, choice) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: choice,
        }));
    };

    const handleSubmit = () => {
        let newScore = 0;
        questions.forEach((q) => {
            if (selectedAnswers[q.id] === q.answer) {
                newScore += 1;
            }
        });
        setScore(newScore);
    };

    return (
        <div>
            {questions.map((item) => (
                <div key={item.id} style={{ marginBottom: "20px" }}>
                    <p>
                        <strong>{item.question}</strong>
                    </p>
                    {item.choices.map((choice, index) => (
                        <label
                            key={index}
                            style={{ display: "block", cursor: "pointer" }}
                        >
                            <input
                                type="radio"
                                name={`question-${item.id}`}
                                value={choice}
                                checked={selectedAnswers[item.id] === choice}
                                onChange={() => handleChange(item.id, choice)}
                            />{" "}
                            {choice}
                        </label>
                    ))}
                </div>
            ))}

            <button onClick={handleSubmit}>Submit Quiz</button>

            {score !== null && (
                <div style={{ marginTop: "20px" }}>
                    <h2>
                        Your Score: {score} / {questions.length}
                    </h2>
                </div>
            )}
        </div>
    );
}
