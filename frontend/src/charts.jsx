import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer
} from "recharts";

export function ATSGauge({ score }) {
  function getColor(s) {
    if (s >= 70) return "#22c55e";
    if (s >= 50) return "#f59e0b";
    if (s >= 30) return "#f97316";
    return "#ef4444";
  }

  const color = getColor(score);
  const circumference = 2 * Math.PI * 80;
  const strokeDash = (score / 100) * circumference;

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <p style={{
        color: "#818cf8",
        fontSize: "0.85rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
        marginBottom: "20px",
        fontFamily: "Courier New"
      }}>
        ATS Score Gauge
      </p>

      <div style={{ position: "relative", width: "220px", height: "220px", margin: "0 auto 16px" }}>
        <svg width="220" height="220">
          <circle cx="110" cy="110" r="80" fill="none" stroke="#1f2937" strokeWidth="18" />
          <circle
            cx="110"
            cy="110"
            r="80"
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            strokeDashoffset={circumference * 0.25}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center"
        }}>
          <p style={{ color: color, fontSize: "2.8rem", fontWeight: "900", lineHeight: "1", margin: 0 }}>
            {score}%
          </p>
        </div>
      </div>

      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
        {score >= 70 ? "Excellent Match! 🌟" :
          score >= 50 ? "Good Match! 💪" :
            score >= 30 ? "Average Match 📈" :
              "Needs Improvement 📚"}
      </p>
    </div>
  );
}

export function BreakdownChart({ breakdown }) {
  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#f97316", "#ec4899"];

  const data = Object.entries(breakdown).map(([key, value], i) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    score: Math.round(value),
    color: colors[i % colors.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#0d1117", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", padding: "10px" }}>
          <p style={{ color: "#e2e8f0", fontSize: "0.85rem" }}>{payload[0].payload.name}</p>
          <p style={{ color: payload[0].payload.color, fontWeight: "700" }}>{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <p style={{ color: "#818cf8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", fontFamily: "Courier New" }}>
        Score Breakdown
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 9 }} angle={-35} textAnchor="end" />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillsChart({ skillsFound, skillsMissing }) {
  const data = [
    { name: "Skills Found", value: skillsFound.length, fill: "#22c55e" },
    { name: "Skills Missing", value: skillsMissing.length || 1, fill: "#ef4444" },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#0d1117", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", padding: "10px" }}>
          <p style={{ color: "#e2e8f0", fontSize: "0.85rem" }}>{payload[0].name}</p>
          <p style={{ color: payload[0].payload.fill, fontWeight: "700" }}>{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <p style={{ color: "#818cf8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", fontFamily: "Courier New" }}>
        Skills Analysis
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}