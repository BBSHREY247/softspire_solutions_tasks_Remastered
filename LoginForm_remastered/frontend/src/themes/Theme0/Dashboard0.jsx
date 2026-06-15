import React from "react";
import "./Theme0.css";

function Dashboard0({ user, onLogout }) {
  const username = user?.fullname || "User";
  const useremail = user?.email || "user@softspire.com";

  return (
    <div className="auth-card" style={{ textAlign: "center" }}>
      <h1 style={{ marginBottom: "20px", fontSize: "24px", color: "#1f2937" }}>
        User Session
      </h1>
      
      <div style={{ margin: "20px 0", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>
        <p style={{ margin: "8px 0", fontSize: "14px", color: "#4b5563" }}>
          <strong>Name:</strong> {username}
        </p>
        <p style={{ margin: "8px 0", fontSize: "14px", color: "#4b5563" }}>
          <strong>Email:</strong> {useremail}
        </p>
        <p style={{ margin: "8px 0", fontSize: "14px", color: "#059669", fontWeight: "600" }}>
          ✓ Session Active
        </p>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        End Session
      </button>
    </div>
  );
}

export default Dashboard0;
