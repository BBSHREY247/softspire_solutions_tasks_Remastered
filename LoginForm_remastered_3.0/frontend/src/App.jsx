import { useState } from "react";
import Register from "./register";
import Login from "./login";
import Dashboard from "./components/Dashboard";
import ShatterCard from "./components/ShatterCard";
import { synth } from "./utils/audio";

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Animation phase: 'idle' | 'gif' | 'flash' | 'shatter' | 'done'
    const [phase, setPhase] = useState("idle");
    const [gifKey, setGifKey] = useState(0);

    // Saved credentials for the ShatterCard replica
    const [savedEmail, setSavedEmail] = useState("");
    const [savedPassword, setSavedPassword] = useState("");

    const handleLoginSuccess = (userData, email, password) => {
        setUser(userData);
        setSavedEmail(email);
        setSavedPassword(password);
        setGifKey(Date.now());

        // ── PHASE 1 (0ms): GIF plays behind card. Card stays visible. ──
        setPhase("gif");
        synth.playWhoosh();

        // ── PHASE 2 (2100ms): GIF completes playing. Flash background as white. ──
        setTimeout(() => {
            setPhase("flash");
            synth.playImpact();
        }, 2100);

        // ── PHASE 3 (2400ms): Shatter the login card on the white background. ──
        setTimeout(() => {
            setPhase("shatter");
        }, 2400);

        // Stop sound slightly earlier to cut off the unwanted trailing noise (at 4700ms)
        setTimeout(() => {
            synth.stopAll();
        }, 4200);

        // ── PHASE 4 (5600ms): Transition to Dashboard ──
        setTimeout(() => {
            setLoggedIn(true);
            setPhase("done");
        }, 5600);
    };

    const handleLogout = () => {
        setUser(null);
        setLoggedIn(false);
        setIsLogin(true);
        setPhase("idle");
    };

    // Dashboard
    if (loggedIn) {
        return <Dashboard user={user} onLogout={handleLogout} />;
    }

    return (
        <>
            {/* FULL-SCREEN GIF BACKGROUND — plays behind the card during 'gif' phase */}
            {phase === "gif" && (
                <div className="gif-background">
                    <img
                        key={gifKey}
                        src={`/saitama.gif?t=${gifKey}`}
                        alt="Saitama punching"
                        className="gif-fullscreen"
                    />
                </div>
            )}

            {/* SCREEN SHAKE on impact */}
            <div className={phase === "shatter" ? "shake-screen" : ""} style={{ minHeight: "100vh" }}>
                {phase === "shatter" ? (
                    <div className="auth-container bg-white-flash">
                        <ShatterCard email={savedEmail} password={savedPassword} />
                    </div>
                ) : isLogin ? (
                    <Login
                        switchPage={() => setIsLogin(false)}
                        onLoginSuccess={handleLoginSuccess}
                        animPhase={phase}
                    />
                ) : (
                    <Register switchPage={() => setIsLogin(true)} />
                )}
            </div>
        </>
    );
}

export default App;