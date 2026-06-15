import { useState } from "react";
import axios from "axios";

function Register({switchPage, isWiping}) {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        setAlertMsg("");
        setAlertType("");

        const cleanFullname = fullname.trim();
        const cleanEmail = email.trim().toLowerCase();

        // 1. Empty fields check
        if (!cleanFullname || !cleanEmail || !password) {
            setAlertMsg("All Fields Are Required");
            setAlertType("error");
            return;
        }

        // 2. Full name length validation
        if (cleanFullname.length < 3) {
            setAlertMsg("Name Must Be At Least 3 Characters");
            setAlertType("error");
            return;
        }

        // 3. Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            setAlertMsg("Invalid Email Format");
            setAlertType("error");
            return;
        }

        // 4. Password length validation
        if (password.length < 6) {
            setAlertMsg("Password Must Be At Least 6 Characters");
            setAlertType("error");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:5000/register",
                {
                    fullname: cleanFullname,
                    email: cleanEmail,
                    password
                }
            );

            setAlertMsg(response.data.message || "User Registered Successfully");
            setAlertType("success");

            // Reset form
            setFullname("");
            setEmail("");
            setPassword("");

            // Redirect to login page after 1.5 seconds
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
        <div className="auth-card">
            {isWiping && (
                <div className="wiper-container">
                    <div className="board-wiper wiping">
                        <div className="eraser-block"></div>
                    </div>
                </div>
            )}

            <form className="register" onSubmit={handleRegister} autoComplete="off">
                <h1>Register Page</h1>
                
                {alertMsg && (
                    <div className={`alert-box alert-${alertType}`}>
                        {alertMsg}
                    </div>
                )}

                <label htmlFor="fullname">
                    Enter Your Name
                </label>
                <input
                    type="text"
                    id="fullname"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                />

                <label htmlFor="email">
                    Enter Your Email
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">
                    Enter Your Password
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
                    Register
                </button>

                <p>
                    Already have an account?
                    <button
                        type="button"
                        className="link-btn"
                        onClick={switchPage}
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );

}

export default Register;