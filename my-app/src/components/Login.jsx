import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../styles/Login.css";
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get the original page the user intended to access
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    fetch('http://localhost:8080/public/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })
      .then(async (res) => {
        setLoading(false);
        if (res.ok) {
          const data = await res.json();

          localStorage.setItem('token', data.token);
          localStorage.setItem('name', email);

          if (onLoginSuccess) {
            onLoginSuccess(data.token);
          }

          // ✅ Proper redirection after login
          navigate(from, { replace: true });

        } else {
          const text = await res.text();
          setError(text || 'Log in failed');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Log in failed');
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login to CodeQuest</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <button onClick={handleGoogleLogin} className="auth-google-button">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google Logo"
            className="auth-google-logo"
          />
          Continue with Google
        </button>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
