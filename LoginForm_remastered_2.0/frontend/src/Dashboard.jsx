import { useState } from "react";

function Dashboard({ user, onLogout }) {
  const username = user?.fullname || "Shreyash";
  const useremail = user?.email || "shreyash@gmail.com";

  return (
    <div className="dashboard-layout">
      {/* Scrollable Shelves Section */}
      <div className="shelves-scroll-container">
        
        {/* Sleek System Panel mounted at the top of the interior */}
        <div className="fridge-control-panel">
          <div className="panel-header">FRIDGE SYSTEM MONITOR</div>
          
          <div className="panel-row">
            <span className="panel-label">OWNER</span>
            <span className="panel-value">{username}</span>
          </div>

          <div className="panel-row">
            <span className="panel-label">EMAIL</span>
            <span className="panel-value">{useremail}</span>
          </div>

          <div className="panel-row">
            <span className="panel-label">SYSTEM ROLE</span>
            <span className="panel-value">STUDENT</span>
          </div>

          <div className="panel-row">
            <span className="panel-label">SESSION</span>
            <span className="panel-value active-status">ACTIVE & SECURED</span>
          </div>

          <div className="panel-row">
            <span className="panel-label">DATABASE</span>
            <span className="panel-value mode-status">
              {/* {localStorage.getItem("offlineMode") === "true" ? "LOCAL DEMO MODE" : "CONNECTED"} */}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "18px", borderTop: "1px solid rgba(249, 115, 22, 0.2)", paddingTop: "14px" }}>
            <button className="logout-switch-btn" onClick={onLogout}>
              SHUT DOWN SESSION
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;


