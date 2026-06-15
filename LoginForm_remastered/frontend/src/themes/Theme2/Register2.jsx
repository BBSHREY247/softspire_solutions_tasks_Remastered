import { useState } from "react";
import axios from "axios";

function Register2({ switchPage, fullname, setFullname, email, setEmail, password, setPassword }) {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setAlertMsg("");
    setAlertType("");

    const cleanFullname = fullname.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFullname || !cleanEmail || !password) {
      setAlertMsg("All Fields Are Required");
      setAlertType("error");
      return;
    }

    if (cleanFullname.length < 3) {
      setAlertMsg("Name Must Be At Least 3 Characters");
      setAlertType("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setAlertMsg("Invalid Email Format");
      setAlertType("error");
      return;
    }

    if (password.length < 6) {
      setAlertMsg("Password Must Be At Least 6 Characters");
      setAlertType("error");
      return;
    }

    const isOffline = localStorage.getItem("offlineMode") === "true";

    if (isOffline) {
      // Mock successful registration in offline mode
      setAlertMsg("Offline Registration Successful!");
      setAlertType("success");
      setFullname("");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        switchPage();
      }, 1500);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        fullname: cleanFullname,
        email: cleanEmail,
        password,
      });

      setAlertMsg(response.data.message || "User Registered Successfully");
      setAlertType("success");

      setFullname("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        switchPage();
      }, 1500);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Registration Failed. Try again.";
      setAlertMsg(errorMsg);
      setAlertType("error");
    }
  };

  return (
    <div className="smart-panel-container">
      <div className="smart-panel">
        <form className="fridge-form" onSubmit={handleRegister} autoComplete="off">
          <h2>Create Account</h2>

          {alertMsg && (
            <div className={`alert-box alert-${alertType}`}>
              {alertMsg}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="Shreyash"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
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

          {/* Hidden button programmatically clicked by door handle */}
          <button type="submit" id="fridge-submit-btn" style={{ display: "none" }} />

          <div className="handle-instruction-msg">
            👈 PULL HANDLE TO REGISTER
          </div>

          <p className="form-switch-p">
            Already registered?
            <button type="button" onClick={switchPage}>
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register2;
