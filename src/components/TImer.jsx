import { useState, useEffect } from "react";

export default function Timer({
  setCurrentQuestion,
  currentQuestion,
  quizStarted,
  isLastQuestion,
  onAutoSubmit,
}) {
  const [time, setTime] = useState(45);

  useEffect(() => {
    setTime(30);
  }, [currentQuestion]);

  useEffect(() => {
    if (!quizStarted) return;
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          if (isLastQuestion) {
            onAutoSubmit();
          } else {
            setCurrentQuestion((q) => q + 1);
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentQuestion,
    quizStarted,
    isLastQuestion,
    onAutoSubmit,
    setCurrentQuestion,
  ]);

  return (
    <div className="timer">
      <span className="timer-value">{time}</span>
      <span className="timer-label">sec</span>
    </div>
  );
}
