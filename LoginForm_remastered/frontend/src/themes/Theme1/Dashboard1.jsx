import React from "react";

function Dashboard1({ user, onLogout }) {
    const fullname = user?.fullname || "Student";
    const email = user?.email || "student@softspire.com";

    return (
        <div className="auth-card" style={{ textAlign: "center" }}>
            <h1>Board Room</h1>
            
            <div style={{ margin: "25px 0", border: "2px dashed rgba(255, 255, 255, 0.4)", padding: "20px", borderRadius: "8px" }}>
                <label style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase" }}>
                    Student Name
                </label>
                <p style={{ fontSize: "28px", color: "#ffffff", margin: "5px 0 20px 0", fontFamily: "Schoolbell", fontWeight: "normal" }}>
                    {fullname}
                </p>

                <label style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase" }}>
                    Email Address
                </label>
                <p style={{ fontSize: "24px", color: "#ffffff", margin: "5px 0 20px 0", fontFamily: "Schoolbell", fontWeight: "normal" }}>
                    {email}
                </p>

                <label style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase" }}>
                    Status
                </label>
                <p style={{ fontSize: "22px", color: "#86efac", margin: "5px 0 0 0", fontFamily: "Schoolbell", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                    ✏️ Session Enrolled
                </p>
            </div>

            <button type="button" onClick={onLogout}>
                Erase Session
            </button>
        </div>
    );
}

export default Dashboard1;
