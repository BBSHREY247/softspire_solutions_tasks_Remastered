import { useState, useEffect } from "react";

// Theme 0 (Default Basic)
import Login0 from "./themes/Theme0/Login0";
import Register0 from "./themes/Theme0/Register0";
import Dashboard0 from "./themes/Theme0/Dashboard0";
import "./themes/Theme0/Theme0.css";

// Theme 1 (Blackboard)
import Login1 from "./themes/Theme1/Login1";
import Register1 from "./themes/Theme1/Register1";
import Dashboard1 from "./themes/Theme1/Dashboard1";
import "./themes/Theme1/Theme1.css";

// Theme 2 (Fridge)
import Fridge2, { fridgeAudio } from "./themes/Theme2/Fridge2";
import Login2 from "./themes/Theme2/Login2";
import Register2 from "./themes/Theme2/Register2";
import Dashboard2 from "./themes/Theme2/Dashboard2";
import "./themes/Theme2/Theme2.css";

// Theme 3 (Saitama)
import Login3 from "./themes/Theme3/Login3";
import Register3 from "./themes/Theme3/Register3";
import Dashboard3 from "./themes/Theme3/Dashboard3";
import ShatterCard3 from "./themes/Theme3/ShatterCard3";
import "./themes/Theme3/Theme3.css";

// Shared Controls
import { synth } from "./utils/audio";
import ThemeSelector from "./components/ThemeSelector";

function App() {
  // Global/Shared States (Initialize Theme to 0: Default Form)
  const [currentTheme, setCurrentTheme] = useState(0); 
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  // Shared Form Inputs (Reset on reload)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  // Theme 1 (Blackboard) transition state
  const [isWiping, setIsWiping] = useState(false);

  // Theme 2 (Fridge) states
  const [doorOpen, setDoorOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("soundEnabled") !== "false";
  });
  const [interiorFullscreen, setInteriorFullscreen] = useState(false);

  // Theme 3 (Saitama) states
  const [phase, setPhase] = useState("idle"); // 'idle' | 'gif' | 'flash' | 'shatter' | 'done'
  const [gifKey, setGifKey] = useState(0);
  const [savedEmail, setSavedEmail] = useState("");
  const [savedPassword, setSavedPassword] = useState("");

  // Keep Fridge interior fullscreen state in sync with door
  useEffect(() => {
    if (currentTheme === 2) {
      if (doorOpen) {
        const timer = setTimeout(() => setInteriorFullscreen(true), 2500);
        return () => clearTimeout(timer);
      } else {
        setInteriorFullscreen(false);
      }
    }
  }, [doorOpen, currentTheme]);

  // Automatically open the Fridge door if logged in and switching to it
  useEffect(() => {
    if (loggedIn && currentTheme === 2) {
      setDoorOpen(true);
      setInteriorFullscreen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme]);

  // Sync sound preference
  useEffect(() => {
    localStorage.setItem("soundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  // Handle theme transitions & stop active loops
  const handleThemeChange = (newTheme) => {
    // Silence active hums / audio synth loops
    if (fridgeAudio) {
      fridgeAudio.stopHum();
    }
    if (synth) {
      synth.stopAll();
    }

    // Reset animations states to avoid frozen elements
    setIsWiping(false);
    setPhase("idle");
    
    // Closed door if not logged in
    if (!loggedIn) {
      setDoorOpen(false);
      setInteriorFullscreen(false);
    }

    setCurrentTheme(newTheme);
  };

  // Login callback
  const handleLoginSuccess = (userData, submittedEmail, submittedPassword) => {
    setUser(userData);
    
    if (currentTheme === 0) {
      // Default Login
      setLoggedIn(true);
    } else if (currentTheme === 1) {
      // Blackboard Login
      setLoggedIn(true);
    } else if (currentTheme === 2) {
      // Fridge Login: automatically open door
      setLoggedIn(true);
      setTimeout(() => setDoorOpen(true), 300);
    } else if (currentTheme === 3) {
      // Saitama Punch sequence
      setSavedEmail(submittedEmail);
      setSavedPassword(submittedPassword);
      setGifKey(Date.now());

      setPhase("gif");
      synth.playWhoosh();

      // Phase 2: Flash
      setTimeout(() => {
        setPhase("flash");
        synth.playImpact();
      }, 2100);

      // Phase 3: Shatter
      setTimeout(() => {
        setPhase("shatter");
      }, 2400);

      // Stop whoosh/loop before dashboard transitions
      setTimeout(() => {
        synth.stopAll();
      }, 4200);

      // Phase 4: Dashboard Transition
      setTimeout(() => {
        setLoggedIn(true);
        setPhase("done");
      }, 5600);
    }
  };

  // Logout callback (End Session refreshes the page)
  const handleLogout = () => {
    // Silent hums
    if (fridgeAudio) {
      fridgeAudio.stopHum();
    }
    if (synth) {
      synth.stopAll();
    }

    // Reset fridge view states
    setInteriorFullscreen(false);
    setDoorOpen(false);
    setPhase("idle");

    setUser(null);
    setLoggedIn(false);
    setIsLogin(true);

    // Refresh the entire page!
    window.location.reload();
  };

  // Switch between Login and Register views
  const handleSwitchPage = (toLogin) => {
    if (currentTheme === 1) {
      // Blackboard eraser sweep switch
      if (isWiping) return;
      setIsWiping(true);
      setTimeout(() => {
        setIsLogin(toLogin);
      }, 500);
      setTimeout(() => {
        setIsWiping(false);
      }, 1000);
    } else {
      setIsLogin(toLogin);
    }
  };

  // Render Default theme layout
  const renderTheme0 = () => {
    return (
      <div className="theme-default">
        <div className="auth-container">
          {loggedIn ? (
            <Dashboard0 user={user} onLogout={handleLogout} />
          ) : isLogin ? (
            <Login0
              switchPage={() => handleSwitchPage(false)}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <Register0
              switchPage={() => handleSwitchPage(true)}
              fullname={fullname}
              setFullname={setFullname}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          )}
        </div>
      </div>
    );
  };

  // Render Blackboard layout
  const renderTheme1 = () => {
    return (
      <div className="theme-blackboard">
        <div className="auth-container">
          <div className="school-element book">📚</div>
          <div className="school-element pencil">✏️</div>
          <div className="school-element ruler">📏</div>
          <div className="school-element apple">🍎</div>

          <div className="portal-header">
            <h2>School Blackboard</h2>
            <p>Remastered Edition 1.0</p>
          </div>

          {loggedIn ? (
            <Dashboard1 user={user} onLogout={handleLogout} />
          ) : isLogin ? (
            <Login1
              switchPage={() => handleSwitchPage(false)}
              isWiping={isWiping}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <Register1
              switchPage={() => handleSwitchPage(true)}
              isWiping={isWiping}
              fullname={fullname}
              setFullname={setFullname}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          )}
        </div>
      </div>
    );
  };

  // Render Fridge layout
  const renderTheme2 = () => {
    const doorContent = isLogin ? (
      <Login2
        switchPage={() => handleSwitchPage(false)}
        onLoginSuccess={handleLoginSuccess}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    ) : (
      <Register2
        switchPage={() => handleSwitchPage(true)}
        fullname={fullname}
        setFullname={setFullname}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    );

    return (
      <div className="theme-fridge">
        <Fridge2
          doorOpen={doorOpen}
          setDoorOpen={setDoorOpen}
          loggedIn={loggedIn}
          user={user}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          doorContent={!loggedIn ? doorContent : null}
          interiorFullscreen={interiorFullscreen}
        >
          {loggedIn ? (
            <Dashboard2 user={user} onLogout={handleLogout} />
          ) : (
            <div className="interior-alert">
              <div>🔒 FRIDGE SECURED</div>
              <div style={{ fontSize: "0.7rem", marginTop: "4px", fontWeight: "normal", opacity: 0.8 }}>
                Authenticate using the forms on the door to unlock shelves.
              </div>
            </div>
          )}
        </Fridge2>
      </div>
    );
  };

  // Render Saitama layout
  const renderTheme3 = () => {
    return (
      <div className="theme-saitama">
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

        <div className={phase === "shatter" ? "shake-screen" : ""} style={{ minHeight: "100vh" }}>
          {loggedIn ? (
            <Dashboard3 user={user} onLogout={handleLogout} />
          ) : phase === "shatter" ? (
            <div className="auth-container bg-white-flash">
              <ShatterCard3 email={savedEmail} password={savedPassword} />
            </div>
          ) : isLogin ? (
            <Login3
              switchPage={() => handleSwitchPage(false)}
              onLoginSuccess={handleLoginSuccess}
              animPhase={phase}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          ) : (
            <Register3
              switchPage={() => handleSwitchPage(true)}
              fullname={fullname}
              setFullname={setFullname}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Theme Switching Dock on the right */}
      <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />

      {/* Render Active Theme View */}
      {currentTheme === 0 && renderTheme0()}
      {currentTheme === 1 && renderTheme1()}
      {currentTheme === 2 && renderTheme2()}
      {currentTheme === 3 && renderTheme3()}
    </>
  );
}

export default App;