import { useState, useEffect } from "react";

function NumberSeries() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const generateQuestion = () => {
    const types = [
      { series: [2, 4, 6, 8, 10], next: 12, rule: "+2" },
      { series: [3, 6, 12, 24, 48], next: 96, rule: "×2" },
      { series: [1, 4, 9, 16, 25], next: 36, rule: "squares" },
      { series: [5, 10, 15, 20, 25], next: 30, rule: "+5" },
      { series: [100, 90, 80, 70, 60], next: 50, rule: "-10" },
      { series: [1, 3, 6, 10, 15], next: 21, rule: "+2,+3,+4..." },
      { series: [2, 6, 18, 54, 162], next: 486, rule: "×3" },
      { series: [7, 14, 21, 28, 35], next: 42, rule: "+7" },
      { series: [1, 1, 2, 3, 5], next: 8, rule: "fibonacci" },
      { series: [4, 8, 16, 32, 64], next: 128, rule: "×2" },
    ];
    const q = types[Math.floor(Math.random() * types.length)];
    setQuestion(q);
    setAnswer("");
    setResult(null);
  };

  useEffect(() => { generateQuestion(); }, []);

  const checkAnswer = () => {
    if (!question) return;
    setTotal(t => t + 1);
    if (parseInt(answer) === question.next) {
      setResult("correct");
      setScore(s => s + 1);
    } else {
      setResult("wrong");
    }
  };

  return (
    <div className="game-container">
      <div className="game-score">Score: {score}/{total}</div>
      {question && (
        <>
          <p className="game-question">Find the next number in the series:</p>
          <div className="series-display">
            {question.series.map((n, i) => (
              <span key={i} className="series-number">{n}</span>
            ))}
            <span className="series-number question-mark">?</span>
          </div>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            className="game-input"
            onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
          />
          <button onClick={checkAnswer} className="game-btn">Submit</button>
          {result && (
            <div className={`game-result ${result}`}>
              {result === "correct"
                ? "✅ Correct! Well done!"
                : `❌ Wrong! Answer was ${question.next} (Rule: ${question.rule})`}
              <button onClick={generateQuestion} className="game-btn" style={{ marginLeft: "10px" }}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SpeedMath() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [started, setStarted] = useState(false);

  const generateQuestion = () => {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;
    if (op === "+") { a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; ans = a + b; }
    else if (op === "-") { a = Math.floor(Math.random() * 50) + 25; b = Math.floor(Math.random() * 25) + 1; ans = a - b; }
    else { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; ans = a * b; }
    setQuestion({ a, b, op, ans });
    setAnswer("");
    setResult(null);
    setTimeLeft(15);
  };

  useEffect(() => {
    if (!started) return;
    if (timeLeft === 0) {
      setTotal(t => t + 1);
      setResult("timeout");
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, started]);

  const checkAnswer = () => {
    if (!question || result) return;
    setTotal(t => t + 1);
    if (parseInt(answer) === question.ans) {
      setResult("correct");
      setScore(s => s + 1);
    } else {
      setResult("wrong");
    }
  };

  return (
    <div className="game-container">
      <div className="game-score">Score: {score}/{total}</div>
      {!started ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
            Solve math problems as fast as you can! You have 15 seconds per question.
          </p>
          <button onClick={() => { setStarted(true); generateQuestion(); }} className="game-btn">
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="timer" style={{ color: timeLeft <= 5 ? "#ef4444" : "#22c55e" }}>
            ⏱️ {timeLeft}s
          </div>
          {question && (
            <>
              <p className="game-question">
                {question.a} {question.op} {question.b} = ?
              </p>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                className="game-input"
                onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                disabled={result !== null}
              />
              <button onClick={checkAnswer} className="game-btn" disabled={result !== null}>
                Submit
              </button>
              {result && (
                <div className={`game-result ${result}`}>
                  {result === "correct" ? "✅ Correct!" :
                    result === "timeout" ? `⏰ Time's up! Answer was ${question.ans}` :
                      `❌ Wrong! Answer was ${question.ans}`}
                  <button onClick={generateQuestion} className="game-btn" style={{ marginLeft: "10px" }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function LogicalReasoning() {
  const questions = [
    {
      q: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
      options: ["Yes", "No", "Cannot determine"],
      answer: "Yes",
      explanation: "Since Bloops → Razzies → Lazzies, all Bloops are Lazzies."
    },
    {
      q: "A is older than B. B is older than C. Who is the youngest?",
      options: ["A", "B", "C"],
      answer: "C",
      explanation: "A > B > C, so C is youngest."
    },
    {
      q: "If you rearrange the letters 'CIFAIPC', you get the name of a:",
      options: ["City", "Animal", "Ocean"],
      answer: "Ocean",
      explanation: "CIFAIPC = PACIFIC (Pacific Ocean)"
    },
    {
      q: "What comes next: Monday, Wednesday, Friday, ?",
      options: ["Saturday", "Sunday", "Tuesday"],
      answer: "Sunday",
      explanation: "Every alternate day: Mon, Wed, Fri, Sun"
    },
    {
      q: "A clock shows 3:15. What is the angle between hour and minute hands?",
      options: ["0°", "7.5°", "15°"],
      answer: "7.5°",
      explanation: "At 3:15, hour hand is at 97.5° and minute at 90°. Difference = 7.5°"
    },
    {
      q: "If 2+3=10, 7+2=63, 6+5=66, then 8+4=?",
      options: ["96", "32", "12"],
      answer: "96",
      explanation: "Pattern: a×(a+b). So 8×(8+4) = 8×12 = 96"
    }
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === questions[index].answer) {
      setScore(s => s + 1);
    }
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null);
    }
  };

  if (finished) {
    return (
      <div className="game-container" style={{ textAlign: "center" }}>
        <h3 style={{ color: "#6366f1", marginBottom: "16px" }}>Quiz Complete! 🎉</h3>
        <div className="score-circle" style={{ borderColor: score >= 4 ? "#22c55e" : "#f97316", margin: "0 auto 20px" }}>
          <span style={{ color: score >= 4 ? "#22c55e" : "#f97316", fontSize: "1.8rem", fontWeight: "800" }}>
            {score}/{questions.length}
          </span>
        </div>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
          {score >= 5 ? "Excellent! You're great at logical reasoning! 🌟" :
            score >= 3 ? "Good job! Keep practicing! 💪" :
              "Keep practicing, you'll improve! 📚"}
        </p>
        <button onClick={() => { setIndex(0); setSelected(null); setScore(0); setFinished(false); }} className="game-btn">
          Play Again
        </button>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div className="game-container">
      <div className="game-score">Question {index + 1}/{questions.length} | Score: {score}</div>
      <p className="game-question">{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              border: selected
                ? option === q.answer ? "2px solid #22c55e"
                  : option === selected ? "2px solid #ef4444"
                    : "1px solid rgba(99,102,241,0.2)"
                : "1px solid rgba(99,102,241,0.2)",
              background: selected
                ? option === q.answer ? "rgba(34,197,94,0.1)"
                  : option === selected ? "rgba(239,68,68,0.1)"
                    : "#0d1117"
                : "#0d1117",
              color: "#e2e8f0",
              cursor: selected ? "default" : "pointer",
              fontSize: "0.9rem",
              textAlign: "left"
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ color: selected === q.answer ? "#22c55e" : "#ef4444", fontSize: "0.85rem", marginBottom: "8px" }}>
            {selected === q.answer ? "✅ Correct!" : "❌ Wrong!"}
          </p>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
            💡 {q.explanation}
          </p>
        </div>
      )}
      {selected && (
        <button onClick={next} className="game-btn">
          {index + 1 >= questions.length ? "See Results" : "Next →"}
        </button>
      )}
    </div>
  );
}

function Games() {
  const [activeGame, setActiveGame] = useState("number");

  const games = [
    { id: "number", label: "🔢 Number Series", desc: "Find the next number" },
    { id: "math", label: "⚡ Speed Math", desc: "Solve fast!" },
    { id: "logic", label: "🧠 Logical Reasoning", desc: "Think smart" },
  ];

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: "30px", paddingTop: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: "10px" }}>
          🎮 Aptitude <span style={{ color: "#6366f1" }}>Games</span>
        </h2>
        <p style={{ color: "#9ca3af" }}>Sharpen your skills for placement tests!</p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap", justifyContent: "center" }}>
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: activeGame === game.id ? "2px solid #6366f1" : "1px solid rgba(99,102,241,0.2)",
              background: activeGame === game.id ? "rgba(99,102,241,0.15)" : "#111827",
              color: activeGame === game.id ? "#818cf8" : "#9ca3af",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: activeGame === game.id ? "700" : "400"
            }}
          >
            {game.label}
            <br />
            <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>{game.desc}</span>
          </button>
        ))}
      </div>

      {activeGame === "number" && <NumberSeries />}
      {activeGame === "math" && <SpeedMath />}
      {activeGame === "logic" && <LogicalReasoning />}
    </div>
  );
}

export default Games;