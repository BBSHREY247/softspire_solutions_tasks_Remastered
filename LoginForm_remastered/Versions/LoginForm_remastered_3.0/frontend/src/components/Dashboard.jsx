import React from "react";
import "../styles/saitama.css";

function Dashboard({ user, onLogout }) {
  const fullname = user?.fullname || "Hero";

  return (
    <div className="dashboard-minimal-container">
      {/* Cyber grid and scanlines overlay */}
      <div className="terminal-scanlines"></div>

      <div className="dashboard-minimal-card">
        {/* Hologram brackets on corners */}
        <div className="card-bracket-tl"></div>
        <div className="card-bracket-br"></div>

        <div className="success-badge">ACCESS GRANTED</div>
        <div className="success-glow-circle">
          <span className="check-mark-glow">✓</span>
        </div>
        <h1 className="success-title">LOGIN SUCCESSFUL</h1>
        <h2 className="welcome-name">WELCOME, {fullname.toUpperCase()}</h2>
        
        <button className="disengage-btn-minimal" onClick={onLogout}>
          DISENGAGE SESSION
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
