import { useState } from "react";
import Register from "./register";
import Login from "./login";

function App() {

    const [isLogin, setIsLogin] = useState(true);
    const [isWiping, setIsWiping] = useState(false);

    const handleSwitch = (toLogin) => {
        if (isWiping) return; // Prevent double-triggering
        setIsWiping(true);
        
        // Swap component halfway through the slide
        setTimeout(() => {
            setIsLogin(toLogin);
        }, 500);

        // Terminate transition state
        setTimeout(() => {
            setIsWiping(false);
        }, 1000);
    };

    return (
        <div className="auth-container">
            {/* Floating Decorative School Elements */}
            <div className="school-element book">📚</div>
            <div className="school-element pencil">✏️</div>
            <div className="school-element ruler">📏</div>
            <div className="school-element apple">🍎</div>

            {/* Blackboard Board Portal Header */}
            <div className="portal-header">
            </div>

            {isLogin ? (
                <Login switchPage={() => handleSwitch(false)} isWiping={isWiping} />
            ) : (
                <Register switchPage={() => handleSwitch(true)} isWiping={isWiping} />
            )}
        </div>
    );
}

export default App;