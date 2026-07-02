import AuroraBackground from "./Background";

function LandingPage({ onGetStarted }) {
  const features = ["Smart ATS Scoring", "Fraud Job Detection", "AI Job Matching", "Interview Prep Videos"];

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <AuroraBackground dense />

      <nav style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 40px"
      }}>
        <div style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "800" }}>
          Job <span style={{ color: "#6366f1" }}>Analyzer</span> AI
        </div>
        <button
          onClick={onGetStarted}
          style={{
            padding: "9px 24px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "0.85rem",
            boxShadow: "0 0 20px rgba(99,102,241,0.4)"
          }}
        >
          Login / Sign Up
        </button>
      </nav>

      <div style={{
        position: "relative",
        zIndex: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 20px"
      }}>
        <h1 className="fade-in-up fade-in-up-1" style={{ fontSize: "2.9rem", fontWeight: "800", color: "#fff", marginBottom: "12px", letterSpacing: "-0.02em" }}>
          Job <span className="gradient-text">Analyzer</span> AI
        </h1>
        <p className="fade-in-up fade-in-up-2" style={{ color: "#94a3b8", fontFamily: "JetBrains Mono", fontSize: "0.95rem", marginBottom: "16px" }}>
          // analyze.resume() find.dream.job()
        </p>
        <p className="fade-in-up fade-in-up-2" style={{ color: "#9ca3af", fontSize: "1rem", maxWidth: "560px", margin: "0 auto 24px", lineHeight: "1.6" }}>
          Upload your resume, get an AI powered ATS score, detect fraudulent job postings,
          and discover jobs that truly match your skills.
        </p>

        <button
          onClick={onGetStarted}
          className="fade-in-up fade-in-up-3 btn-glow"
          style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "white",
            border: "none",
            borderRadius: "14px",
            fontWeight: "700",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 0 30px rgba(99,102,241,0.5)",
            marginBottom: "30px"
          }}
        >
          Get Started Free →
        </button>

        <div className="fade-in-up fade-in-up-4" style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", maxWidth: "600px" }}>
          {features.map((f, i) => (
            <span key={i} style={{
              background: "rgba(99, 102, 241, 0.1)",
              color: "#818cf8",
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontFamily: "JetBrains Mono",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              transition: "transform 0.2s ease, background 0.2s ease"
            }}>
              ✓ {f}
            </span>
          ))}
        </div>
      </div>

      <p style={{
        position: "absolute",
        bottom: "20px",
        left: 0, right: 0,
        textAlign: "center",
        color: "#6b7280",
        fontSize: "0.78rem",
        zIndex: 5
      }}>
        "The secret of getting ahead is getting started." — Mark Twain
      </p>
    </div>
  );
}

export default LandingPage;