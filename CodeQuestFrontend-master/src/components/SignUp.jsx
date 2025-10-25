import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const SignUp = ({ onSignUpSuccess }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // --- Handle Sign Up ---
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(password)) {
      setError(
        "Password must include uppercase, lowercase, number, and special character (min 8 chars)."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/public/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      setLoading(false);
      if (res.ok) {
        setStep("verify");
        localStorage.setItem("email", email);
        localStorage.setItem("name", username);
      } else {
        const text = await res.text();
        setError(text || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Network error during sign-up.");
    }
  };

  // --- Handle Email Verification ---
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/public/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      setLoading(false);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        navigate("/login");
      } else {
        const text = await res.text();
        setError(text || "Invalid verification code.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Verification failed. Please try again.");
    }
  };

  // --- Google OAuth login ---
  const handleGoogleLogin = () => {
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
    
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300">
        {step === "signup" && (
          <>
            <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
              Create Your Account
            </h2>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <small className="text-xs text-gray-500 dark:text-gray-400 block">
                Minimum 8 characters with uppercase, lowercase, number & special character
              </small>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="h-px bg-gray-300 dark:bg-gray-600 w-1/3"></div>
              <span className="px-3 text-gray-500 text-sm dark:text-gray-400">OR</span>
              <div className="h-px bg-gray-300 dark:bg-gray-600 w-1/3"></div>
            </div>

            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>

            <div className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500"
              >
                Login
              </Link>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
              Verify Your Email
            </h2>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                className="w-full px-4 py-2 border rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <input
                type="text"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
              Didn’t receive the code?{" "}
              <button
                onClick={handleSignUp}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500 underline"
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
