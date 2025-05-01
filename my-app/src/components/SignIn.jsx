import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const googleLogin = () => {
//    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    window.location.href = 'http://localhost:3000/oauth2-success?token=' + token;

  };

  const githubLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Welcome to CodeQuest</h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2rem' }}>
        CodeQuest is a collaborative coding platform where you can join rooms, solve coding challenges, and learn with others in real-time.
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          onClick={googleLogin}
          style={{
            backgroundColor: '#db4437',
            border: 'none',
            borderRadius: '5px',
            padding: '12px 24px',
            fontSize: '16px',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c33d2e'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#db4437'}
        >
          Sign in with Google
        </button>
        <button
          onClick={githubLogin}
          style={{
            backgroundColor: '#333',
            border: 'none',
            borderRadius: '5px',
            padding: '12px 24px',
            fontSize: '16px',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#222'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#333'}
        >
          Sign in with GitHub
        </button>
      </div>
      <div style={{ marginTop: '2rem', fontSize: '1rem' }}>
        <span>Don't have an account? </span>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: 0,
          }}
          onClick={() => navigate('/auth')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
