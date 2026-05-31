import React, { useState, useEffect } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import AuthPage from "./components/AuthPage";

const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #F4F2ED;
    font-family: 'Inter', sans-serif;
    color: #1a1a1a;
  }

  .app-shell {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 240px;
    min-width: 240px;
    background: #111;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    border-right: 1px solid #1e1e1e;
  }

  .sidebar-logo {
    padding: 2rem 1.5rem 1.5rem;
    border-bottom: 1px solid #1e1e1e;
  }

  .sidebar-logo-title {
    font-family: 'Inter', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -0.03em;
  }

  .sidebar-logo-title span { color: #C8622A; }

  .sidebar-logo-sub {
    font-size: 0.67rem;
    color: #8f8c8c;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 0.4rem;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .sidebar-section-label {
    font-size: 0.63rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #8f8c8c;
    padding: 1rem 0.5rem 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.875rem;
    font-weight: 500;
    color: #666;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: 'Inter', sans-serif;
  }

  .nav-item:hover { background: #1a1a1a; color: #ddd; }

  .nav-item.active {
    background: #53056b;
    color: #fff;
    font-weight: 600;
  }

  .nav-item.active .nav-icon { color: #fff; }

  .nav-icon {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    color: #555;
    transition: color 0.15s;
  }

  .nav-item:hover .nav-icon { color: #ccc; }

  .nav-badge {
    margin-left: auto;
    background: #53056b;
    color: #fff;
    font-size: 0.58rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    letter-spacing: 0.06em;
  }

  .nav-item.active .nav-badge { background: rgba(255,255,255,0.25); }

  /* User section at bottom of sidebar */
  .sidebar-user {
    padding: 1rem 1.25rem;
    border-top: 1px solid #1e1e1e;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .sidebar-avatar {
    width: 32px;
    height: 32px;
    min-width: 32px;
    background: #53056b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.02em;
  }

  .sidebar-user-info { flex: 1; min-width: 0; }

  .sidebar-user-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-user-email {
    font-size: 0.65rem;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logout-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.3rem;
    color: #444;
    border-radius: 5px;
    transition: color 0.15s, background 0.15s;
    display: flex;
    align-items: center;
  }

  .logout-btn:hover { color: #e05555; background: #1a1a1a; }

  .logout-btn svg { width: 15px; height: 15px; }

  .sidebar-footer {
    padding: 0.75rem 1.5rem;
    border-top: 1px solid #1e1e1e;
    font-size: 0.68rem;
    color: #333;
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  .main-content {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }

  @media (max-width: 680px) {
    .sidebar { width: 60px; min-width: 60px; }
    .sidebar-logo-title, .sidebar-logo-sub, .nav-item span,
    .sidebar-section-label, .sidebar-footer, .nav-badge,
    .sidebar-user-info, .sidebar-user .logout-btn { display: none; }
    .nav-item { justify-content: center; padding: 0.8rem; }
    .nav-icon { width: 20px; height: 20px; }
    .sidebar-user { justify-content: center; padding: 0.75rem; }
  }
`;

const navItems = [
  {
    id: "builder",
    label: "Resume Builder",
    group: "Create",
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="13" y2="12" />
        <line x1="7" y1="16" x2="15" y2="16" />
      </svg>
    ),
  },
  {
    id: "analyzer",
    label: "AI Analysis",
    group: "Analyze",
    badge: "AI",
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function App() {
  const [activePage, setActivePage] = useState("builder");
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("sr_token");
    const savedUser = localStorage.getItem("sr_user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
    setAuthChecked(true);
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("sr_token");
    localStorage.removeItem("sr_user");
    setUser(null);
    setActivePage("builder");
  };

  // Wait until we've checked localStorage before rendering
  if (!authChecked) return null;

  // Show auth page if not logged in
  if (!user) return <AuthPage onAuth={handleAuth} />;

  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-title">Smart<span></span><br/>Resume</div>
            <div className="sidebar-logo-sub">Builder & Analyzer</div>
          </div>

          <nav className="sidebar-nav">
            {["Create", "Analyze"].map((group) => (
              <div key={group}>
                <div className="sidebar-section-label">{group}</div>
                {navItems.filter((n) => n.group === group).map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item${activePage === item.id ? " active" : ""}`}
                    onClick={() => setActivePage(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user.name)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Sign out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>

          <div className="sidebar-footer">v2.0 — Smart Resume</div>
        </aside>

        <main className="main-content">
          {activePage === "builder" && <ResumeForm />}
          {activePage === "analyzer" && <ResumeAnalyzer />}
        </main>
      </div>
    </>
  );
}

export default App;