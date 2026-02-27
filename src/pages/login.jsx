import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import email from "../assets/vector.png";
import password from "../assets/vector (1).png";
import signin from "../assets/signin.png";


/*
const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-9Zm1.8-.3 6.2 4.5 6.2-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 10V8a5 5 0 1 1 10 0v2m-9 0h8a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 16 20H8a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 8 10Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
); */

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A11 11 0 0 1 12 5c4.7 0 8.8 2.8 10 7-0.5 1.8-1.5 3.4-2.9 4.6M6.2 8.2A11.1 11.1 0 0 0 2 12c1.2 4.2 5.3 7 10 7 1.2 0 2.4-.2 3.4-.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 5l7 7-7 7M19 12H5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const onInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!apiBaseUrl) {
      setError("Missing VITE_API_URL in Frontend/.env.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const tokenBody = new URLSearchParams();
      tokenBody.set("username", form.email.trim());
      tokenBody.set("password", form.password);

      const tokenResponse = await fetch(`${apiBaseUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenBody.toString(),
      });

      if (!tokenResponse.ok) {
        const tokenError = await tokenResponse.json().catch(() => ({}));
        throw new Error(tokenError.detail || "Login failed. Check your credentials.");
      }

      const tokenData = await tokenResponse.json();

      const meResponse = await fetch(`${apiBaseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!meResponse.ok) {
        throw new Error("Login succeeded, but user profile could not be loaded.");
      }

      const meData = await meResponse.json();

      const storage = form.remember ? window.localStorage : window.sessionStorage;
      storage.setItem("access_token", tokenData.access_token);
      storage.setItem("token_type", tokenData.token_type || "bearer");
      storage.setItem("user", JSON.stringify(meData));

      navigate(meData.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Unable to sign in right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-screen">
      <div className="login-overlay" />

      <div className="login-content">
        <div className="login-card">
          <img src={logo} alt="ThinkTECH" className="login-logo" />

          <h1 className="login-title">QR & BARCODE GENERATOR</h1>
          <p>Let&apos;s sign in to your account and get started.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <div className="input-wrap">
              <img src={email} alt="email" />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onInputChange}
                required
                autoComplete="email"
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <img src={password} alt="email" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onInputChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>

            <div className="form-row">
              <label className="remember-wrap">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={onInputChange}
                />
                <span>Remember For 30 Days</span>
              </label>
              
            </div>

            {error ? <p className="login-error">{error}</p> : null}

            <button type="submit" className="sign-in-btn" disabled={isLoading}>
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              <img src={signin} alt="signin" />
            </button>
          </form>
        </div>

        <p className="login-copyright">Copyright 2025 &copy; Thinktech Digital</p>
      </div>
    </section>
  );
};

export default Login;
