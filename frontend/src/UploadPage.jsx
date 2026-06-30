import { useEffect, useRef } from "react";

function NeuralBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const nodes = [];
    for (let i = 0; i < 80; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
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
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />;
}

function UploadPage({ user, file, setFile, jobDescription, setJobDescription, error, loading, handleSubmit, handleLogout, onOpenSidebar }) {
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <NeuralBackground />

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
        <div style={{
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "24px",
          padding: "36px",
          width: "100%",
          maxWidth: "560px",
          backdropFilter: "blur(10px)",
          maxHeight: "calc(100vh - 110px)",
          overflowY: "auto"
        }}>
          <h2 style={{ color: "#fff", fontSize: "1.4rem", marginBottom: "6px", textAlign: "center" }}>
            Analyze Your Resume
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "24px", textAlign: "center" }}>
            Upload your resume and a job description to get started
          </p>

          <h3 style={{ color: "#818cf8", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontFamily: "Courier New" }}>
            Upload Resume
          </h3>
          <div style={{
            border: "2px dashed rgba(99, 102, 241, 0.3)",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
            background: "rgba(10, 10, 26, 0.6)",
            marginBottom: "20px"
          }}>
            <p style={{ color: "#4b5563", marginBottom: "10px", fontSize: "0.85rem" }}>Drop your resume here or</p>
            <label style={{
              display: "inline-block",
              padding: "9px 22px",
              background: "#6366f1",
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
            {file && <p style={{ color: "#34d399", marginTop: "10px", fontSize: "0.8rem", fontFamily: "Courier New" }}>Selected: {file.name}</p>}
          </div>

          <h3 style={{ color: "#818cf8", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontFamily: "Courier New" }}>
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
              background: "rgba(10, 10, 26, 0.6)",
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
            style={{
              width: "100%",
              padding: "14px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
              boxShadow: "0 0 25px rgba(99,102,241,0.3)"
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