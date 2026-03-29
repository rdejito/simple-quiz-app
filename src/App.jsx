import "./global.css";
import { useState, useEffect } from "react";
import Questions from "./components/Questions";

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("/questions.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        return response.json();
      })
      .then((data) => setQuestions(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="centered-box">
      <Questions questions={questions} />
    </div>
  );
}

export default App;
