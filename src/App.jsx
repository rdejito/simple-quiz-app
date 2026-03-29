import "./global.css";
import { useState, useEffect } from "react";
import Questions from "./components/Questions";
import History from "./components/History";

function App() {
  const [questions, setQuestions] = useState([]);
  // ✅ Read from localStorage on mount
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("ACTIVE_TAB") || "quiz";
  });

  // ✅ Persist on change
  useEffect(() => {
    localStorage.setItem("ACTIVE_TAB", activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="centered-box">
      <div className="card-header">
        <h1>React Quiz</h1>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "quiz" ? "active" : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          Quiz
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      <div className="card-body">
        {activeTab === "quiz" ? (
          <Questions questions={questions} />
        ) : (
          <History questions={questions} />
        )}
      </div>
    </div>
  );
}

export default App;
