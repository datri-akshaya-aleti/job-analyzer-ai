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

function LandingPage({ onGetStarted }) {
  const features = ["Smart ATS Scoring", "Fraud Job Detection", "AI Job Matching", "Interview Prep Videos"];

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <NeuralBackground />

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
        <h1 style={{ fontSize: "2.8rem", fontWeight: "800", color: "#fff", marginBottom: "12px" }}>
          Job <span style={{ color: "#6366f1" }}>Analyzer</span> AI
        </h1>
        <p style={{ color: "#94a3b8", fontFamily: "Courier New", fontSize: "0.95rem", marginBottom: "16px" }}>
          // analyze.resume() find.dream.job()
        </p>
        <p style={{ color: "#9ca3af", fontSize: "1rem", maxWidth: "560px", margin: "0 auto 24px", lineHeight: "1.6" }}>
          Upload your resume, get an AI powered ATS score, detect fraudulent job postings,
          and discover jobs that truly match your skills.
        </p>

        <button
          onClick={onGetStarted}
          style={{
            padding: "14px 36px",
            background: "#6366f1",
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

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", maxWidth: "600px" }}>
          {features.map((f, i) => (
            <span key={i} style={{
              background: "rgba(99, 102, 241, 0.1)",
              color: "#818cf8",
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontFamily: "Courier New",
              border: "1px solid rgba(99, 102, 241, 0.2)"
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