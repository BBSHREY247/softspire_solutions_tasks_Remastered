import { useState, useEffect } from "react";
import axios from "axios";

function Login2({ switchPage, onLoginSuccess, email, setEmail, password, setPassword }) {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isOfflineMode, setIsOfflineMode] = useState(() => {
    return localStorage.getItem("offlineMode") === "true";
  });

  // Keep offlineMode synced with localStorage
  useEffect(() => {
    localStorage.setItem("offlineMode", isOfflineMode.toString());
  }, [isOfflineMode]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setAlertMsg("");
    setAlertType("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setAlertMsg("Email and Password Are Required");
      setAlertType("error");
      return;
    }

    if (isOfflineMode) {
      // Mock successful login instantly for local testing
      setAlertMsg("Offline Login Successful!");
      setAlertType("success");
      
      const demoUser = {
        fullname: cleanEmail.split("@")[0].toUpperCase() || "SHREYASH",
        email: cleanEmail,
      };

      // Delay slightly for nice UX transition
      setTimeout(() => {
        onLoginSuccess(demoUser, email, password);
      }, 800);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: cleanEmail,
        password,
      });

      setAlertMsg(response.data.message || "Login Successful");
      setAlertType("success");

      const loggedUser = response.data.user || {
        fullname: "Shreyash",
        email: cleanEmail,
      };

      setTimeout(() => {
        onLoginSuccess(loggedUser, email, password);
      }, 800);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Login Failed. Try again.";
      setAlertMsg(errorMsg);
      setAlertType("error");
    }
  };

  return (
    <div className="smart-panel-container">
      <div className="smart-panel">
        <form className="fridge-form" onSubmit={handleLogin} autoComplete="off">
          <h2>Sign In</h2>

          {alertMsg && (
            <div className={`alert-box alert-${alertType}`}>
              {alertMsg}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Offline Mode Toggle */}
          <div 
            className="demo-toggle-container"
            onClick={() => setIsOfflineMode(!isOfflineMode)}
          >
            <input
              type="checkbox"
              id="offlineMode"
              checked={isOfflineMode}
              onChange={() => {}} // handled by parent container click
            />
            <span className="demo-label">Offline Demo Mode</span>
          </div>

          {/* Hidden button programmatically clicked by door handle */}
          <button type="submit" id="fridge-submit-btn" style={{ display: "none" }} />

          <div className="handle-instruction-msg">
            👈 PULL HANDLE TO SIGN IN
          </div>

          <p className="form-switch-p">
            Need an account?
            <button type="button" onClick={switchPage}>
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login2;
