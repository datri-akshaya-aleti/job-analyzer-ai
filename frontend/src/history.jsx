import { useState, useEffect } from "react";
import axios from "axios";

function History({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/resume/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.history);
    } catch (err) {
      setError("Could not load history. Please try again.");
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    if (score >= 30) return "#f97316";
    return "#ef4444";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="container" style={{ paddingTop: "30px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: "10px" }}>
          📊 My <span style={{ color: "#6366f1" }}>History</span>
        </h2>
        <p style={{ color: "#9ca3af" }}>All your resume analyses in one place</p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>
          Loading your history...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", color: "#f87171", padding: "40px" }}>
          {error}
        </div>
      )}

      {!loading && history.length === 0 && (
        <div style={{
          textAlign: "center",
          background: "rgba(17, 24, 39, 0.8)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "20px",
          padding: "40px"
        }}>
          <p style={{ fontSize: "3rem", marginBottom: "16px" }}>📄</p>
          <p style={{ color: "#9ca3af", fontSize: "1rem" }}>
            No analyses yet! Upload your resume to get started.
          </p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {history.map((item, i) => (
            <div key={i} style={{
              background: "rgba(17, 24, 39, 0.8)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "20px",
              padding: "24px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ color: "#e2e8f0", marginBottom: "4px", fontSize: "1rem" }}>
                    📄 {item.filename}
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                    🕐 {formatDate(item.created_at)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: `4px solid ${getScoreColor(item.ats_score)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0d1117"
                  }}>
                    <span style={{ color: getScoreColor(item.ats_score), fontWeight: "800", fontSize: "0.9rem" }}>
                      {item.ats_score}%
                    </span>
                  </div>
                  <span style={{
                    background: getScoreColor(item.ats_score),
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "700"
                  }}>
                    {item.level}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <p style={{ color: "#6366f1", fontSize: "0.8rem", marginBottom: "8px", fontFamily: "JetBrains Mono" }}>
                  SKILLS FOUND
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {item.skills.slice(0, 8).map((skill, j) => (
                    <span key={j} style={{
                      background: "rgba(99,102,241,0.1)",
                      color: "#818cf8",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      border: "1px solid rgba(99,102,241,0.2)",
                      fontFamily: "JetBrains Mono"
                    }}>
                      {skill}
                    </span>
                  ))}
                  {item.skills.length > 8 && (
                    <span style={{ color: "#6b7280", fontSize: "0.75rem", padding: "3px 8px" }}>
                      +{item.skills.length - 8} more
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "8px", fontFamily: "JetBrains Mono" }}>
                  MISSING KEYWORDS
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {item.missing_keywords.slice(0, 5).map((kw, j) => (
                    <span key={j} style={{
                      background: "rgba(239,68,68,0.08)",
                      color: "#f87171",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      border: "1px solid rgba(239,68,68,0.2)",
                      fontFamily: "JetBrains Mono"
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: "1.5" }}>
                💡 {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;