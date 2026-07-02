import { useState } from "react";
import axios from "axios";
import AuroraBackground from "./Background";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/login",
          { email, password }
        );
        onLogin(response.data.token, response.data.user);
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/auth/register",
          { name, email, password }
        );
        onLogin(response.data.token, response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <AuroraBackground />
      <div className="auth-box fade-in-up">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
          <p>{isLogin ? "Login to analyze your resume" : "Join to get AI powered job insights"}</p>
        </div>

        <div className="auth-tabs">
          <button
            className={isLogin ? "tab active" : "tab"}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "tab active" : "tab"}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {!isLogin && (
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="auth-btn btn-glow"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;