import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Callback = ({onLoginSuccess}) => {
  const navigate = useNavigate();
  const [debug, setDebug] = useState("Component initializing...");

  useEffect(() => {

    // Check if we're on the correct path
    if (window.location.pathname !== "/oauth2/callback") {
      const errorMsg = `WRONG PATH! Expected "/oauth2/callback" but got "${window.location.pathname}"`;
      console.error("❌", errorMsg);
      setDebug(errorMsg);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    
    
    const token = params.get("token");
    const email = params.get("email");
    const provider = params.get("provider");
    const loginStatus = params.get("login");

    // console.log("🎯 Extracted values:");
    // console.log("   token:", token ? `YES (length: ${token.length})` : "NO");
    // console.log("   email:", email || "NO");
    // console.log("   provider:", provider || "NO");
    // console.log("   loginStatus:", loginStatus || "NO");

    if (token && email) {
      console.log("✅ SUCCESS: Valid authentication data received!");
      setDebug("Authentication successful! Storing data...");
      
      // Store data
      localStorage.setItem("token", token);
      localStorage.setItem("user_email", email);
      localStorage.setItem("auth_provider", provider || "google");
      localStorage.setItem("login_time", new Date().toISOString());

         if (onLoginSuccess) {
            onLoginSuccess(token);
          }
      // console.log("💾 Data stored in localStorage");
      // console.log("   token:", localStorage.getItem("token")?.substring(0, 50) + "...");
      // console.log("   email:", localStorage.getItem("user_email"));
      
      // setDebug("Login successful! Redirecting to home page...");
      
      // Redirect after a brief delay to see the success message
      setTimeout(() => {
        console.log("🔄 Redirecting to /");
        navigate("/", { replace: true });
      }, 2000);
      
    } else {
      console.log("❌ FAILED: Missing required authentication data");
      setDebug("Authentication failed - missing token or email. Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  }, [navigate]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      zIndex: 9999
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        maxWidth: '80%'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>🔐 OAuth2 Authentication</h1>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          <strong>Status:</strong> {debug}
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '14px',
          textAlign: 'left',
          marginTop: '20px',
          wordBreak: 'break-all'
        }}>
          <strong>Current URL:</strong><br />
          {window.location.href}
        </div>
      </div>
    </div>
  );
};

export default OAuth2Callback;