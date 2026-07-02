import AuroraBackground from "./Background";

function UploadPage({ user, file, setFile, jobDescription, setJobDescription, error, loading, handleSubmit, handleLogout, onOpenSidebar }) {
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <AuroraBackground />

      <button
        onClick={onOpenSidebar}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 20,
          background: "rgba(17, 24, 39, 0.9)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: "8px",
          padding: "10px 12px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "5px"
        }}
      >
        <span style={{ display: "block", width: "20px", height: "2px", background: "#818cf8" }}></span>
        <span style={{ display: "block", width: "20px", height: "2px", background: "#818cf8" }}></span>
        <span style={{ display: "block", width: "20px", height: "2px", background: "#818cf8" }}></span>
      </button>

      <nav style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "20px 40px",
        gap: "16px"
      }}>
        <p style={{ color: "#9ca3af", fontSize: "0.88rem" }}>Hello, {user?.name}!</p>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 18px",
            background: "transparent",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            borderRadius: "8px",
            color: "#818cf8",
            cursor: "pointer",
            fontSize: "0.85rem"
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{
        position: "relative",
        zIndex: 5,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 20px"
      }}>
        <div className="fade-in-up" style={{
          background: "rgba(18, 20, 27, 0.78)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "36px",
          width: "100%",
          maxWidth: "560px",
          backdropFilter: "blur(18px)",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.45), 0 0 40px rgba(99, 102, 241, 0.08)",
          maxHeight: "calc(100vh - 110px)",
          overflowY: "auto"
        }}>
          <h2 style={{ color: "#fff", fontSize: "1.4rem", marginBottom: "6px", textAlign: "center" }}>
            Analyze Your Resume
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "24px", textAlign: "center" }}>
            Upload your resume and a job description to get started
          </p>

          <h3 style={{ color: "#818cf8", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontFamily: "JetBrains Mono" }}>
            Upload Resume
          </h3>
          <div style={{
            border: "2px dashed rgba(99, 102, 241, 0.3)",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
            background: "rgba(10, 11, 16, 0.6)",
            marginBottom: "20px"
          }}>
            <p style={{ color: "#4b5563", marginBottom: "10px", fontSize: "0.85rem" }}>Drop your resume here or</p>
            <label style={{
              display: "inline-block",
              padding: "9px 22px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem"
            }}>
              Browse File
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            {file && <p style={{ color: "#34d399", marginTop: "10px", fontSize: "0.8rem", fontFamily: "JetBrains Mono" }}>Selected: {file.name}</p>}
          </div>

          <h3 style={{ color: "#818cf8", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontFamily: "JetBrains Mono" }}>
            Job Description
          </h3>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              padding: "14px",
              background: "rgba(10, 11, 16, 0.6)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "12px",
              color: "#e2e8f0",
              fontSize: "0.88rem",
              resize: "vertical",
              marginBottom: "16px",
              boxSizing: "border-box",
              fontFamily: "inherit"
            }}
          />

          {error && (
            <p style={{ color: "#f87171", marginBottom: "12px", padding: "10px 14px", background: "rgba(248, 113, 113, 0.08)", borderRadius: "8px", borderLeft: "3px solid #f87171", fontSize: "0.85rem" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-glow"
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              boxShadow: "0 0 25px rgba(99,102,241,0.3)",
              transition: "box-shadow 0.3s ease, transform 0.15s ease"
            }}
          >
            {loading ? "Analyzing your resume..." : "Analyze Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;