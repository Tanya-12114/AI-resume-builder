import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Inter', sans-serif; }

  .auth-root {
    min-height: 100vh;
    background: #F4F2ED;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 2rem 1rem;
  }

  .auth-wrapper {
    display: flex;
    gap: 0;
    width: 100%;
    max-width: 900px;
    min-height: 560px;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 8px 48px rgba(0,0,0,0.13);
  }

  /* Left panel */
  .auth-brand {
    width: 340px;
    min-width: 340px;
    background: #111;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .auth-brand::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -80px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(83,5,107,0.5) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-brand::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -60px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(200,98,42,0.3) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-brand-logo {
    font-size: 1.7rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    line-height: 1.2;
    position: relative;
    z-index: 1;
  }

  .auth-brand-logo span { color: #C8622A; }

  .auth-brand-tagline {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #8f8c8c;
    margin-top: 0.4rem;
    position: relative;
    z-index: 1;
  }

  .auth-brand-features {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    position: relative;
    z-index: 1;
  }

  .auth-feature {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
  }

  .auth-feature-dot {
    width: 28px;
    height: 28px;
    min-width: 28px;
    background: rgba(83,5,107,0.5);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.1rem;
  }

  .auth-feature-dot svg { width: 14px; height: 14px; color: #c47de0; }

  .auth-feature-text strong {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: #eee;
    line-height: 1.3;
  }

  .auth-feature-text span {
    font-size: 0.72rem;
    color: #666;
    line-height: 1.4;
  }

  .auth-brand-footer {
    font-size: 0.65rem;
    color: #333;
    font-weight: 500;
    letter-spacing: 0.06em;
    position: relative;
    z-index: 1;
  }

  /* Right panel */
  .auth-form-panel {
    flex: 1;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem;
  }

  .auth-form-inner {
    width: 100%;
    max-width: 360px;
  }

  .auth-form-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #111;
    letter-spacing: -0.03em;
    margin-bottom: 0.35rem;
  }

  .auth-form-subtitle {
    font-size: 0.85rem;
    color: #777;
    margin-bottom: 2rem;
  }

  .auth-tab-row {
    display: flex;
    background: #F4F2ED;
    border-radius: 10px;
    padding: 4px;
    gap: 4px;
    margin-bottom: 1.75rem;
  }

  .auth-tab {
    flex: 1;
    padding: 0.6rem;
    font-size: 0.83rem;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.15s;
    background: transparent;
    color: #777;
  }

  .auth-tab.active {
    background: #fff;
    color: #111;
    box-shadow: 0 1px 6px rgba(0,0,0,0.10);
  }

  .auth-field {
    margin-bottom: 1.1rem;
  }

  .auth-field label {
    display: block;
    font-size: 0.77rem;
    font-weight: 600;
    color: #444;
    margin-bottom: 0.4rem;
    letter-spacing: 0.02em;
  }

  .auth-input {
    width: 100%;
    padding: 0.72rem 0.95rem;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.9rem;
    font-family: 'Inter', sans-serif;
    color: #111;
    background: #fafafa;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
  }

  .auth-input:focus {
    border-color: #53056b;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(83,5,107,0.08);
  }

  .auth-input.error {
    border-color: #e53e3e;
    box-shadow: 0 0 0 3px rgba(229,62,62,0.08);
  }

  .auth-error-msg {
    font-size: 0.75rem;
    color: #e53e3e;
    margin-top: 0.35rem;
    font-weight: 500;
  }

  .auth-global-error {
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    padding: 0.7rem 0.9rem;
    font-size: 0.82rem;
    color: #c53030;
    font-weight: 500;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .auth-submit-btn {
    width: 100%;
    padding: 0.82rem;
    background: #53056b;
    color: #fff;
    border: none;
    border-radius: 9px;
    font-size: 0.92rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    margin-top: 0.5rem;
    letter-spacing: 0.01em;
  }

  .auth-submit-btn:hover:not(:disabled) { background: #6b077a; }
  .auth-submit-btn:active:not(:disabled) { transform: scale(0.99); }
  .auth-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .auth-switch-text {
    text-align: center;
    font-size: 0.8rem;
    color: #888;
    margin-top: 1.25rem;
  }

  .auth-switch-text button {
    background: none;
    border: none;
    color: #53056b;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    padding: 0 0.1rem;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0;
    color: #ccc;
    font-size: 0.75rem;
  }

  .auth-divider::before,
  .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #eee;
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 6px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 680px) {
    .auth-wrapper { flex-direction: column; min-height: unset; border-radius: 14px; }
    .auth-brand { width: 100%; min-width: unset; padding: 2rem 1.75rem; }
    .auth-brand-features { display: none; }
    .auth-form-panel { padding: 2rem 1.5rem; }
  }
`;

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="7" y1="8" x2="17" y2="8"/>
        <line x1="7" y1="12" x2="13" y2="12"/>
        <line x1="7" y1="16" x2="15" y2="16"/>
      </svg>
    ),
    title: "Smart Resume Builder",
    desc: "Create professional resumes with live preview and PDF export"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "AI-Powered Analysis",
    desc: "Get instant ATS scores and actionable improvement tips"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: "Your Resumes, Saved",
    desc: "Access and manage all your resumes in one secure place"
  }
];

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const change = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: "" }));
    setGlobalError("");
  };

  const validate = () => {
    const errs = {};
    if (mode === "signup" && !form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Must be at least 6 characters.";
    if (mode === "signup" && form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setGlobalError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload = mode === "login"
        ? { email: form.email.trim(), password: form.password }
        : { name: form.name.trim(), email: form.email.trim(), password: form.password };

      const { data } = await axios.post(`${API}${endpoint}`, payload);
      localStorage.setItem("sr_token", data.token);
      localStorage.setItem("sr_user", JSON.stringify(data.user));
      onAuth(data.user, data.token);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setGlobalError("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-wrapper">
          {/* Brand Panel */}
          <div className="auth-brand">
            <div>
              <div className="auth-brand-logo">Smart<span></span><br/>Resume</div>
              <div className="auth-brand-tagline">Builder &amp; Analyzer</div>
            </div>

            <div className="auth-brand-features">
              {features.map((f, i) => (
                <div className="auth-feature" key={i}>
                  <div className="auth-feature-dot">{f.icon}</div>
                  <div className="auth-feature-text">
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-brand-footer"></div>
          </div>

          {/* Form Panel */}
          <div className="auth-form-panel">
            <div className="auth-form-inner">
              <div className="auth-form-title">
                {mode === "login" ? "Welcome back" : "Create account"}
              </div>
              <div className="auth-form-subtitle">
                {mode === "login"
                  ? "Sign in to access your resumes and AI tools"
                  : "Get started with Smart Resume — it's free"}
              </div>

              {/* Tabs */}
              <div className="auth-tab-row">
                <button className={`auth-tab${mode === "login" ? " active" : ""}`} onClick={() => switchMode("login")}>Sign In</button>
                <button className={`auth-tab${mode === "signup" ? " active" : ""}`} onClick={() => switchMode("signup")}>Sign Up</button>
              </div>

              {globalError && (
                <div className="auth-global-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {globalError}
                </div>
              )}

              {/* Name (signup only) */}
              {mode === "signup" && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <input
                    className={`auth-input${errors.name ? " error" : ""}`}
                    type="text"
                    name="name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={change}
                    autoFocus
                  />
                  {errors.name && <div className="auth-error-msg">{errors.name}</div>}
                </div>
              )}

              {/* Email */}
              <div className="auth-field">
                <label>Email Address</label>
                <input
                  className={`auth-input${errors.email ? " error" : ""}`}
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={change}
                  autoFocus={mode === "login"}
                />
                {errors.email && <div className="auth-error-msg">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label>Password</label>
                <input
                  className={`auth-input${errors.password ? " error" : ""}`}
                  type="password"
                  name="password"
                  placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                  value={form.password}
                  onChange={change}
                  onKeyDown={e => e.key === "Enter" && submit()}
                />
                {errors.password && <div className="auth-error-msg">{errors.password}</div>}
              </div>

              {/* Confirm Password (signup only) */}
              {mode === "signup" && (
                <div className="auth-field">
                  <label>Confirm Password</label>
                  <input
                    className={`auth-input${errors.confirmPassword ? " error" : ""}`}
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={change}
                    onKeyDown={e => e.key === "Enter" && submit()}
                  />
                  {errors.confirmPassword && <div className="auth-error-msg">{errors.confirmPassword}</div>}
                </div>
              )}

              <button className="auth-submit-btn" onClick={submit} disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              </button>

              <div className="auth-switch-text">
                {mode === "login" ? (
                  <>Don't have an account?{" "}<button onClick={() => switchMode("signup")}>Sign up free</button></>
                ) : (
                  <>Already have an account?{" "}<button onClick={() => switchMode("login")}>Sign in</button></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}