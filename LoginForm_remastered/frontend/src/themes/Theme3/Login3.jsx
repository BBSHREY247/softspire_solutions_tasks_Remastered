import { useState } from "react";
import axios from "axios";
import "./Theme3.css";

function Login3({ switchPage, onLoginSuccess, animPhase, email, setEmail, password, setPassword }) {
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");

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

        try {
            const response = await axios.post(
                "http://localhost:5000/login",
                {
                    email: cleanEmail,
                    password
                }
            );

            setAlertMsg(response.data.message || "Login Successful");
            setAlertType("success");

            // Invoke success callback after a brief delay so the success alert is visible
            setTimeout(() => {
                if (onLoginSuccess) {
                    onLoginSuccess(response.data.user, email, password);
                }
            }, 600);

        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Login Failed. Try again.";
            setAlertMsg(errorMsg);
            setAlertType("error");
        }
    };

    // Build class names based on animation phase
    let containerClass = "auth-container";
    if (animPhase === "gif") {
        containerClass += " bg-transparent";
    } else if (animPhase === "flash") {
        containerClass += " bg-white-flash";
    }
    const cardClass = "auth-card";

    return (
        <div className={containerClass}>
            <div className={cardClass}>
                <form className="login" onSubmit={handleLogin} autoComplete="off">
                    <h1>Login</h1>
                    
                    {alertMsg && (
                        <div className={`alert-box alert-${alertType}`}>
                            {alertMsg}
                        </div>
                    )}

                    <label htmlFor="email">
                        Enter Your Existing Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">
                        Enter Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                    <p>
                        Don't have an account?
                        <button
                            type="button"
                            className="link-btn"
                            onClick={switchPage}
                        >
                            Register
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login3;
