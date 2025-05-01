import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = ({ onSignUpSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    fetch('http://localhost:8080/public/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        setLoading(false);
        if (res.ok) {
          const data = await res.json();
//           onSignUpSuccess(data.token);
          navigate('/login');
        } else {
          const text = await res.text();
          setError(text || 'Sign up failed');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Sign up failed');
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSignUp} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <button onClick={handleGoogleLogin} className="auth-google-button">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            className="auth-google-logo"
          />
          Continue with Google
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
