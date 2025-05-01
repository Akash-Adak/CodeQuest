import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Replace this with the actual login endpoint URL and request body as needed
    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })
      .then(async (res) => {
        setLoading(false);
        if (res.ok) {
          const data = await res.json();
          // You can save the token or other user data here, e.g., localStorage.setItem('token', data.token);
          navigate('/room'); // Redirect to the "room" page on successful login
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
    console.log('Continue with Google clicked');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login to CodeQuest</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="username"
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
          <Link to="/dashboard" >
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          </Link>
        </form>

        <div className="auth-divider">OR</div>

        <button onClick={handleGoogleLogin} className="auth-google-button">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
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
