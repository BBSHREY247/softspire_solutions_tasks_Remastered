import { useState, useEffect } from "react";
import Fridge from "./Fridge";
import Login from "./login";
import Register from "./register";
import Dashboard from "./Dashboard";

function App() {
  const [doorOpen, setDoorOpen] = useState(false);
  // Login resets on every page refresh — no localStorage persistence
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const cached = localStorage.getItem("soundEnabled");
    return cached !== "false"; // default to true
  });
  // Controls the fullscreen fridge interior overlay after login
  const [interiorFullscreen, setInteriorFullscreen] = useState(false);

  // After door opens, animate interior to fullscreen
  useEffect(() => {
    if (doorOpen) {
      // Give door-open animation time to start, then expand interior
      const timer = setTimeout(() => setInteriorFullscreen(true), 800);
      return () => clearTimeout(timer);
    } else {
      setInteriorFullscreen(false);
    }
  }, [doorOpen]);

  // Automatically open the door if logged in, close it if logged out
  useEffect(() => {
    if (loggedIn) {
      const timer = setTimeout(() => setDoorOpen(true), 300);
      return () => clearTimeout(timer);
    } else {
      setDoorOpen(false);
    }
  }, [loggedIn]);

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem("soundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setInteriorFullscreen(false);
    setDoorOpen(false);
    setTimeout(() => {
      setUser(null);
      setLoggedIn(false);
    }, 1250);
  };

  // Content to render attached to the door back panel
  const doorFormContent = isLogin ? (
    <Login 
      switchPage={() => setIsLogin(false)} 
      onLoginSuccess={handleLoginSuccess} 
    />
  ) : (
    <Register 
      switchPage={() => setIsLogin(true)} 
    />
  );

  return (
    <Fridge
      doorOpen={doorOpen}
      setDoorOpen={setDoorOpen}
      loggedIn={loggedIn}
      user={user}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      doorContent={!loggedIn ? doorFormContent : null}
      interiorFullscreen={interiorFullscreen}
    >
      {loggedIn ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
        />
      ) : (
        <div className="interior-alert">
          <div>🔒 FRIDGE SECURED</div>
          <div style={{ fontSize: "0.7rem", marginTop: "4px", fontWeight: "normal", opacity: 0.8 }}>
            Authenticate using the forms on the door to unlock shelves.
          </div>
        </div>
      )}
    </Fridge>
  );
}

export default App;