import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./Auth";

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
  const [prepData, setPrepData] = useState({});
  const [loadingPrep, setLoadingPrep] = useState({});

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
    setPrepData({});
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a resume!");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setPrepData({});
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
    } catch (err) {
      setError("Something went wrong. Make sure backend is running!");
    }
    setLoading(false);
  };

  const handleInterviewPrep = async (jobTitle, company, index) => {
    setLoadingPrep(prev => ({ ...prev, [index]: true }));
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/jobs/prep/${encodeURIComponent(jobTitle)}?company=${encodeURIComponent(company)}`
      );
      setPrepData(prev => ({ ...prev, [index]: response.data }));
    } catch (err) {
      console.error("Error fetching prep data:", err);
    }
    setLoadingPrep(prev => ({ ...prev, [index]: false }));
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
          <p className="tagline">// analyze.resume() find.dream.job()</p>
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
        <div className="upload-section" style={{ position: "relative", overflow: "hidden" }}>
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
                key={result ? "reset" : "initial"}
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

          <button onClick={handleSubmit} disabled={loading} className="submit-btn">
            {loading ? "Analyzing your resume..." : "Analyze Resume"}
          </button>
        </div>

        {result && (
          <div className="results">

            <div className="score-card">
              <h2>Your ATS Score</h2>
              <div className="score-circle" style={{ borderColor: getScoreColor(result.ats_score) }}>
                <span style={{ color: getScoreColor(result.ats_score) }}>
                  {result.ats_score}%
                </span>
              </div>
              <p className="level">{result.level}</p>
              <p className="suggestion">{result.suggestion}</p>
            </div>

            {result.fraud_detection && (
              <div style={{
                background: "rgba(17, 24, 39, 0.8)",
                padding: "24px",
                borderRadius: "20px",
                marginBottom: "24px",
                border: `1px solid ${result.fraud_detection.color}`,
                backdropFilter: "blur(10px)"
              }}>
                <h2 style={{ color: "#818cf8", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", fontFamily: "Courier New" }}>
                  Job Posting Verification
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" }}>
                  <span style={{ background: result.fraud_detection.color, color: "white", padding: "6px 18px", borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem" }}>
                    {result.fraud_detection.verdict}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                    Trust Score: {result.fraud_detection.genuine_score}%
                  </span>
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: "1.6" }}>
                  {result.fraud_detection.message}
                </p>
                {result.fraud_detection.fraud_signals.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "8px" }}>
                      Suspicious signals found:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {result.fraud_detection.fraud_signals.map((signal, i) => (
                        <span key={i} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", padding: "3px 10px", borderRadius: "6px", fontSize: "0.78rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.breakdown && (
              <div className="info-card" style={{ marginBottom: "24px" }}>
                <h3>ATS Score Breakdown</h3>
                {Object.entries(result.breakdown).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85rem", textTransform: "capitalize" }}>
                        {key.replace(/_/g, " ")}
                      </span>
                      <span style={{ color: getScoreColor(value), fontSize: "0.85rem", fontWeight: "700" }}>
                        {value}%
                      </span>
                    </div>
                    <div style={{ background: "#0d1117", borderRadius: "4px", height: "6px" }}>
                      <div style={{ width: `${value}%`, height: "100%", background: getScoreColor(value), borderRadius: "4px" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

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

            {result.improvement_tips && result.improvement_tips.length > 0 && (
              <div className="info-card" style={{ marginBottom: "24px" }}>
                <h3>Improvement Tips</h3>
                {result.improvement_tips.map((tip, i) => (
                  <p key={i} style={{ color: "#9ca3af", marginBottom: "10px", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    💡 {tip}
                  </p>
                ))}
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                onClick={() => { setResult(null); setFile(null); setJobDescription(""); setPrepData({}); window.scrollTo(0, 0); }}
                className="submit-btn"
                style={{ width: "300px" }}
              >
                Analyze Another Resume
              </button>
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
                      <span className="match-score" style={{ background: getScoreColor(job.match_score) }}>
                        {job.match_score}% Match
                      </span>
                    </div>
                    <p>Company: {job.company}</p>
                    <p>Location: {job.location}</p>
                    <p>Salary: {job.salary_min !== "Not disclosed" ? job.salary_min + " - " + job.salary_max : "Not disclosed"}</p>
                    <p className="job-desc">{job.description}</p>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                      <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="apply-btn">
                        Apply Now
                      </a>
                      <button
                        onClick={() => handleInterviewPrep(job.title, job.company, i)}
                        className="apply-btn"
                        style={{ background: "#0077b6", border: "none", cursor: "pointer" }}
                      >
                        {loadingPrep[i] ? "Loading..." : "Interview Prep"}
                      </button>
                    </div>

                    {prepData[i] && (
                      <div style={{ marginTop: "20px", borderTop: "1px solid rgba(99,102,241,0.2)", paddingTop: "20px" }}>
                        <h4 style={{ color: "#818cf8", marginBottom: "16px", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Interview Preparation
                        </h4>

                        <div style={{ marginBottom: "16px" }}>
                          <p style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "700" }}>
                            Hiring Process
                          </p>
                          {prepData[i].hiring_process.map((step, j) => (
                            <p key={j} style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "6px", lineHeight: "1.5" }}>
                              {step}
                            </p>
                          ))}
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <p style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "700" }}>
                            Interview Tips
                          </p>
                          {prepData[i].interview_tips.slice(0, 4).map((tip, j) => (
                            <p key={j} style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "6px", lineHeight: "1.5" }}>
                              ✅ {tip}
                            </p>
                          ))}
                        </div>

                        {prepData[i].interview_videos && prepData[i].interview_videos.length > 0 && (
                          <div>
                            <p style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "700" }}>
                              Preparation Videos
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                              {prepData[i].interview_videos.map((video, j) => (
                                <a key={j} href={video.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                  <div style={{ background: "#0d1117", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(99,102,241,0.2)", transition: "transform 0.2s" }}>
                                    <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                                    <div style={{ padding: "10px" }}>
                                      <p style={{ color: "#e2e8f0", fontSize: "0.78rem", marginBottom: "4px", lineHeight: "1.4", fontWeight: "600" }}>
                                        {video.title.length > 50 ? video.title.substring(0, 50) + "..." : video.title}
                                      </p>
                                      <p style={{ color: "#6b7280", fontSize: "0.72rem" }}>
                                        {video.channel}
                                      </p>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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