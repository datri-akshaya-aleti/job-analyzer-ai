import { useState } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./Auth";
import { useEffect, useRef } from "react";

function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = [];
    for (let i = 0; i < 100; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 3 + 1,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (let node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = "#6366f1";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#6366f1";
        ctx.fill();
        ctx.shadowBlur = 0;
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="neural-canvas" />;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setResult(null);
    setFile(null);
    setJobDescription("");
 };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a resume!");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/resume/full-analysis",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      setResult(response.data);
      setFile(null);
      setJobDescription("");
    } catch (err) {
      setError("Something went wrong. Make sure backend is running!");
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    if (score >= 30) return "#f97316";
    return "#ef4444";
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">Job <span>Analyzer</span> AI</div>
        <div className="navbar-user">
          <p>Hello, {user?.name}!</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <header className="header">
        <NeuralBackground />
        <div className="header-content">
          <h1>Job <span>Analyzer</span> AI</h1>
          <p className="tagline">// analyze.resume() → find.dream.job()</p>
          <div className="quote">
            "The secret of getting ahead is getting started."
            <span className="quote-author">— Mark Twain</span>
          </div>
          <div className="tech-bar">
            <span className="tech-pill">Python</span>
            <span className="tech-pill">FastAPI</span>
            <span className="tech-pill">NLP</span>
            <span className="tech-pill">ML</span>
            <span className="tech-pill">React</span>
            <span className="tech-pill">Sentence-BERT</span>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="upload-section" style={{position: "relative", overflow: "hidden"}}>
          <div className="robot-bg">
            <div className="robot big-robot">
              <div className="robot-head">
                <div className="robot-eye"></div>
                <div className="robot-eye"></div>
                <div className="robot-mouth"></div>
              </div>
              <div className="robot-body">
                <div className="robot-chest"></div>
                <div className="robot-arm left"></div>
                <div className="robot-arm right"></div>
                <div className="robot-legs">
                  <div className="robot-leg"></div>
                  <div className="robot-leg"></div>
                </div>
              </div>
            </div>
            <div className="robot small-robot">
              <div className="robot-head">
                <div className="robot-eye"></div>
                <div className="robot-eye"></div>
                <div className="robot-mouth"></div>
              </div>
              <div className="robot-body">
                <div className="robot-chest"></div>
                <div className="robot-arm left"></div>
                <div className="robot-arm right"></div>
                <div className="robot-legs">
                  <div className="robot-leg"></div>
                  <div className="robot-leg"></div>
                </div>
              </div>
            </div>
          </div>

          <h2>Upload Resume</h2>
          <div className="file-input-wrapper">
            <p>Drop your resume here or</p>
            <label className="file-label">
              Browse File
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
              />
            </label>
            {file && <p className="file-name">Selected: {file.name}</p>}
          </div>

          <h2>Job Description</h2>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="textarea"
            rows={6}
          />

          {error && <p className="error">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="submit-btn"
          >
            {loading ? "Analyzing your resume..." : "Analyze Resume"}
          </button>
        </div>

        {result && (
          <div className="results">
            <div className="score-card">
              <h2>Your ATS Score</h2>
              <div
                className="score-circle"
                style={{ borderColor: getScoreColor(result.ats_score) }}
              >
                <span style={{ color: getScoreColor(result.ats_score) }}>
                  {result.ats_score}%
                </span>
              </div>
              <p className="level">{result.level}</p>
              <p className="suggestion">{result.suggestion}</p>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <h3>Contact Info</h3>
                <p>Email: {result.email || "Not found"}</p>
                <p>Phone: {result.phone || "Not found"}</p>
                <p>Experience: {result.experience_years} years</p>
              </div>

              <div className="info-card">
                <h3>Skills Found ({result.skills.length})</h3>
                <div className="skills-list">
                  {result.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="info-card">
                <h3>Missing Keywords</h3>
                <div className="skills-list">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="missing-tag">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="jobs-section">
              <h2>Recommended Jobs</h2>
              {result.matched_jobs.length === 0 ? (
                <p className="no-jobs">No jobs found at the moment.</p>
              ) : (
                result.matched_jobs.map((job, i) => (
                  <div key={i} className="job-card">
                    <div className="job-header">
                      <h3>{job.title}</h3>
                      <span
                        className="match-score"
                        style={{ background: getScoreColor(job.match_score) }}
                      >
                        {job.match_score}% Match
                      </span>
                    </div>
                    <p>Company: {job.company}</p>
                    <p>Location: {job.location}</p>
                    <p>Salary: {job.salary_min !== "Not disclosed" ? job.salary_min + " - " + job.salary_max : "Not disclosed"}</p>
                    <p className="job-desc">{job.description}</p>
                     <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-btn"
                    >
                      Apply Now
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;