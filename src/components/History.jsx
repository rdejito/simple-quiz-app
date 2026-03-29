import { useState } from "react";

export default function History({ questions }) {
  const [openIndex, setOpenIndex] = useState(null);
  const history = JSON.parse(localStorage.getItem("HISTORY") || "[]");

  if (history.length === 0) {
    return (
      <p className="history-empty">
        // No attempts yet. Complete a quiz to see history.
      </p>
    );
  }

  return (
    <div className="history-list">
      {history.map((attempt, i) => {
        const date = new Date(attempt.date).toLocaleString();
        const isOpen = openIndex === i;
        const attemptQuestions = attempt.questionIds
          .map((id) => questions.find((q) => q.id === id))
          .filter(Boolean);

        return (
          <div key={i} className="history-card">
            <div
              className="history-card-header"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div>
                <p className="history-card-score">
                  {attempt.score} / {attempt.total}
                </p>
                <p className="history-card-meta">{date}</p>
              </div>
              <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>
                {isOpen ? "▲ collapse" : "▼ expand"}
              </span>
            </div>

            {isOpen && (
              <div className="history-card-body">
                {attemptQuestions.map((q) => {
                  const chosen = attempt.selectedAnswers[q.id];
                  const isCorrect = chosen === q.answer;
                  return (
                    <div
                      key={q.id}
                      className={`history-answer ${isCorrect ? "correct" : "incorrect"}`}
                    >
                      <p className="history-answer-question">{q.question}</p>
                      <p
                        className={`history-answer-chosen ${!isCorrect ? "wrong" : ""}`}
                      >
                        → {chosen || "Not answered"}
                      </p>
                      {!isCorrect && (
                        <p className="history-answer-correct">✓ {q.answer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
