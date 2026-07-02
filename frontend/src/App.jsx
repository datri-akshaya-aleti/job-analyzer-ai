import { useState } from "react";
import axios from "axios";
import "./App.css";
import Auth from "./Auth";
import LandingPage from "./LandingPage";
import UploadPage from "./UploadPage";
import Sidebar from "./Sidebar";
import Games from "./Games";
import History from "./History";
import AuroraBackground from "./Background";
import { ATSGauge, BreakdownChart, SkillsChart } from "./Charts";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [showAuth, setShowAuth] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prepData, setPrepData] = useState({});
  const [loadingPrep, setLoadingPrep] = useState({});
  const [activePage, setActivePage] = useState("analyzer");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
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
    setShowAuth(false);
    setActivePage("analyzer");
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
            Authorization: "Bearer " + token
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
    setLoadingPrep(function (prev) {
      var copy = Object.assign({}, prev);
      copy[index] = true;
      return copy;
    });
    try {
      const url = "http://127.0.0.1:8000/jobs/prep/" + encodeURIComponent(jobTitle) + "?company=" + encodeURIComponent(company);
      const response = await axios.get(url);
      setPrepData(function (prev) {
        var copy = Object.assign({}, prev);
        copy[index] = response.data;
        return copy;
      });
    } catch (err) {
      console.error("Error fetching prep data:", err);
    }
    setLoadingPrep(function (prev) {
      var copy = Object.assign({}, prev);
      copy[index] = false;
      return copy;
    });
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    if (score >= 30) return "#f97316";
    return "#ef4444";
  };

  if (!token && !showAuth) {
    return <LandingPage onGetStarted={function () { setShowAuth(true); }} />;
  }

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  if (activePage === "analyzer" && !result) {
    return (
      <div>
        <Sidebar activePage={activePage} setActivePage={setActivePage} externalOpen={sidebarOpen} setExternalOpen={setSidebarOpen} />
        <UploadPage
          user={user}
          file={file}
          setFile={setFile}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          error={error}
          loading={loading}
          handleSubmit={handleSubmit}
          handleLogout={handleLogout}
          onOpenSidebar={function () { setSidebarOpen(true); }}
        />
      </div>
    );
  }

  if (activePage === "games") {
    return (
      <div className="app" style={{ position: "relative" }}>
        <AuroraBackground />
        <Sidebar activePage={activePage} setActivePage={setActivePage} externalOpen={sidebarOpen} setExternalOpen={setSidebarOpen} />
        <nav className="navbar" style={{ position: "relative", zIndex: 5 }}>
          <div className="navbar-brand" style={{ marginLeft: "60px" }}>Job <span>Analyzer</span> AI</div>
          <div className="navbar-user">
            <p>Hello, {user ? user.name : ""}!</p>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>
        <div style={{ position: "relative", zIndex: 5 }}>
          <Games />
        </div>
      </div>
    );
  }

  if (activePage === "history") {
    return (
      <div className="app" style={{ position: "relative" }}>
        <AuroraBackground />
        <Sidebar activePage={activePage} setActivePage={setActivePage} externalOpen={sidebarOpen} setExternalOpen={setSidebarOpen} />
        <nav className="navbar" style={{ position: "relative", zIndex: 5 }}>
          <div className="navbar-brand" style={{ marginLeft: "60px" }}>Job <span>Analyzer</span> AI</div>
          <div className="navbar-user">
            <p>Hello, {user ? user.name : ""}!</p>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>
        <div style={{ position: "relative", zIndex: 5 }}>
          <History token={token} />
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={{ position: "relative" }}>
      <AuroraBackground />
      <Sidebar activePage={activePage} setActivePage={setActivePage} externalOpen={sidebarOpen} setExternalOpen={setSidebarOpen} />

      <nav className="navbar" style={{ position: "relative", zIndex: 5 }}>
        <div className="navbar-brand" style={{ marginLeft: "60px" }}>Job <span>Analyzer</span> AI</div>
        <div className="navbar-user">
          <p>Hello, {user ? user.name : ""}!</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: "30px", position: "relative", zIndex: 5 }}>
        <div className="results">
          <div className="score-card fade-in-up">
            <h2>Your ATS Score</h2>
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <ATSGauge score={result.ats_score} />
            </div>
            <p className="level">{result.level}</p>
            <p className="suggestion">{result.suggestion}</p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(99,102,241,0.2)"
            }}>
              {result.breakdown && (
                <div style={{ background: "#0d1117", borderRadius: "16px", padding: "20px" }}>
                  <BreakdownChart breakdown={result.breakdown} />
                </div>
              )}
              {result.skills_found && result.skills_missing && (
                <div style={{ background: "#0d1117", borderRadius: "16px", padding: "20px" }}>
                  <SkillsChart skillsFound={result.skills_found} skillsMissing={result.skills_missing} />
                </div>
              )}
            </div>
          </div>

          {result.fraud_detection && (
            <div style={{
              background: "rgba(17, 24, 39, 0.8)",
              padding: "24px",
              borderRadius: "20px",
              marginBottom: "24px",
              border: "1px solid " + result.fraud_detection.color,
              backdropFilter: "blur(10px)"
            }}>
              <h2 style={{ color: "#818cf8", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", fontFamily: "JetBrains Mono" }}>
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
                  <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "8px" }}>Suspicious signals found:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {result.fraud_detection.fraud_signals.map(function (signal, i) {
                      return (
                        <span key={i} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", padding: "3px 10px", borderRadius: "6px", fontSize: "0.78rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                          {signal}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="info-grid">
            <div className="info-card fade-in-up fade-in-up-1">
              <h3>Contact Info</h3>
              <p>Email: {result.email || "Not found"}</p>
              <p>Phone: {result.phone || "Not found"}</p>
              <p>Experience: {result.experience_years} years</p>
            </div>
            <div className="info-card fade-in-up fade-in-up-2">
              <h3>Skills Found ({result.skills.length})</h3>
              <div className="skills-list">
                {result.skills.map(function (skill, i) {
                  return <span key={i} className="skill-tag">{skill}</span>;
                })}
              </div>
            </div>
            <div className="info-card fade-in-up fade-in-up-3">
              <h3>Missing Keywords</h3>
              <div className="skills-list">
                {result.missing_keywords.map(function (kw, i) {
                  return <span key={i} className="missing-tag">{kw}</span>;
                })}
              </div>
            </div>
          </div>

          {result.improvement_tips && result.improvement_tips.length > 0 && (
            <div className="info-card" style={{ marginBottom: "24px" }}>
              <h3>Improvement Tips</h3>
              {result.improvement_tips.map(function (tip, i) {
                return (
                  <p key={i} style={{ color: "#9ca3af", marginBottom: "10px", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    {tip}
                  </p>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              onClick={function () { setResult(null); setFile(null); setJobDescription(""); setPrepData({}); }}
              className="submit-btn btn-glow"
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
              result.matched_jobs.map(function (job, i) {
                return (
                  <div key={i} className="job-card fade-in-up" style={{ animationDelay: (0.05 * Math.min(i, 6)) + "s" }}>
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
                        Apply (Adzuna)
                      </a>
                      <a
                        href={"https://www.linkedin.com/jobs/search/?keywords=" + encodeURIComponent(job.title) + "&location=" + encodeURIComponent(job.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-btn"
                        style={{ background: "#0a66c2" }}
                      >
                        LinkedIn
                      </a>
                      <a
                        href={"https://www.naukri.com/" + encodeURIComponent(job.title.toLowerCase().replace(/\s+/g, "-")) + "-jobs"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-btn"
                        style={{ background: "#4a90e2" }}
                      >
                        Naukri
                      </a>
                      <button onClick={function () { handleInterviewPrep(job.title, job.company, i); }} className="apply-btn" style={{ background: "#0077b6", border: "none", cursor: "pointer" }}>
                        {loadingPrep[i] ? "Loading..." : "Interview Prep"}
                      </button>
                    </div>

                    {prepData[i] && (
                      <div style={{ marginTop: "20px", borderTop: "1px solid rgba(99,102,241,0.2)", paddingTop: "20px" }}>
                        <h4 style={{ color: "#818cf8", marginBottom: "16px", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Interview Preparation</h4>
                        <div style={{ marginBottom: "16px" }}>
                          <p style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "700" }}>Hiring Process</p>
                          {prepData[i].hiring_process.map(function (step, j) {
                            return <p key={j} style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "6px", lineHeight: "1.5" }}>{step}</p>;
                          })}
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                          <p style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "700" }}>Interview Tips</p>
                          {prepData[i].interview_tips.slice(0, 4).map(function (tip, j) {
                            return <p key={j} style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "6px", lineHeight: "1.5" }}>{tip}</p>;
                          })}
                        </div>
                        {prepData[i].interview_videos && prepData[i].interview_videos.length > 0 && (
                          <div>
                            <p style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "10px", fontWeight: "700" }}>Preparation Videos</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                              {prepData[i].interview_videos.map(function (video, j) {
                                return (
                                  <a key={j} href={video.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                    <div style={{ background: "#0d1117", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(99,102,241,0.2)" }}>
                                      <img src={video.thumbnail} alt={video.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                                      <div style={{ padding: "10px" }}>
                                        <p style={{ color: "#e2e8f0", fontSize: "0.78rem", marginBottom: "4px", lineHeight: "1.4", fontWeight: "600" }}>
                                          {video.title.length > 50 ? video.title.substring(0, 50) + "..." : video.title}
                                        </p>
                                        <p style={{ color: "#6b7280", fontSize: "0.72rem" }}>{video.channel}</p>
                                      </div>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;