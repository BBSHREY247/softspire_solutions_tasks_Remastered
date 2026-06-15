import { useEffect, useRef, useState } from "react";
import "./Theme2.css";

// Web Audio API Synthesizer singleton
class RefrigeratorAudio {
  constructor() {
    this.audioCtx = null;
    this.humNode = null;
    this.isEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  toggleSound(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopHum();
    } else if (this.humNode === null && this.audioCtx) {
      this.startHum();
    }
  }

  startHum() {
    if (!this.isEnabled) return;
    try {
      this.init();
      if (this.humNode) return;

      const osc1 = this.audioCtx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(60, this.audioCtx.currentTime);

      const osc2 = this.audioCtx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(120, this.audioCtx.currentTime);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(100, this.audioCtx.currentTime);

      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.04, this.audioCtx.currentTime + 1.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();

      this.humNode = { osc1, osc2, gainNode };
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  }

  stopHum() {
    if (this.humNode) {
      try {
        const { osc1, osc2, gainNode } = this.humNode;
        gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.4);
        setTimeout(() => {
          try { osc1.stop(); osc2.stop(); } catch (err) { }
        }, 450);
        this.humNode = null;
      } catch (e) {
        console.warn(e);
      }
    }
  }

  playOpenSound() {
    if (!this.isEnabled) return;
    try {
      this.init();
      const bufferSize = this.audioCtx.sampleRate * 0.25;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(280, this.audioCtx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(90, this.audioCtx.currentTime + 0.25);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);
      noise.start();

      const osc = this.audioCtx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, this.audioCtx.currentTime + 0.25);
      osc.frequency.linearRampToValueAtTime(160, this.audioCtx.currentTime + 0.7);

      const squeakGain = this.audioCtx.createGain();
      squeakGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      squeakGain.gain.linearRampToValueAtTime(0.06, this.audioCtx.currentTime + 0.1);
      squeakGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.7);

      osc.connect(squeakGain);
      squeakGain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.7);
    } catch (e) {
      console.warn("Play open sound failed:", e);
    }
  }

  playCloseSound() {
    if (!this.isEnabled) return;
    try {
      this.init();
      const osc = this.audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(15, this.audioCtx.currentTime + 0.28);

      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.28);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);

      const clickOsc = this.audioCtx.createOscillator();
      clickOsc.type = "triangle";
      clickOsc.frequency.setValueAtTime(850, this.audioCtx.currentTime);

      const clickGain = this.audioCtx.createGain();
      clickGain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      clickOsc.connect(clickGain);
      clickGain.connect(this.audioCtx.destination);
      clickOsc.start();
      clickOsc.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Play close sound failed:", e);
    }
  }
}

export const fridgeAudio = new RefrigeratorAudio();

function Fridge2({
  doorOpen,
  setDoorOpen,
  loggedIn,
  user,
  soundEnabled,
  setSoundEnabled,
  doorContent,
  interiorFullscreen,
  children,
}) {
  const [magnetOffsets, setMagnetOffsets] = useState([
    { id: 1, rot: -8, char: "🧲", label: "Magnet A" },
    { id: 2, rot: 12, char: "📋", label: "Notes" },
    { id: 3, rot: -15, char: "🔑", label: "Keys" },
    { id: 4, rot: 5, char: "⭐", label: "Star" },
  ]);
  const [shakeForm, setShakeForm] = useState(false);

  useEffect(() => {
    fridgeAudio.toggleSound(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (doorOpen) {
      fridgeAudio.startHum();
    } else {
      fridgeAudio.stopHum();
    }
    // Cleanup on unmount
    return () => {
      fridgeAudio.stopHum();
    };
  }, [doorOpen]);

  const handleHandleClick = () => {
    if (!loggedIn) {
      const submitBtn = document.getElementById("fridge-submit-btn");
      if (submitBtn) {
        submitBtn.click();
      } else {
        fridgeAudio.playCloseSound();
        setShakeForm(true);
        setTimeout(() => setShakeForm(false), 500);
      }
      return;
    }

    if (!doorOpen) {
      fridgeAudio.playOpenSound();
      setDoorOpen(true);
    } else {
      fridgeAudio.playCloseSound();
      setDoorOpen(false);
    }
  };

  const wobbleMagnet = (id) => {
    setMagnetOffsets((prev) =>
      prev.map((mag) =>
        mag.id === id ? { ...mag, rot: mag.rot + (Math.random() > 0.5 ? 15 : -15) } : mag
      )
    );
  };

  return (
    <div className="fridge-page">
      {/* Sound toggle — always visible */}
      <div className="audio-control-floating">
        <button
          className="audio-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      {/* ── FULLSCREEN INTERIOR OVERLAY (after login) ── */}
      <div className={`fridge-interior-fullscreen ${interiorFullscreen ? "active" : ""}`}>
        {/* 3D perspective room walls */}
        <div className="fi-room">
          {/* Ambient warm top LED strip */}
          <div className="fi-led-strip">
            <div className="fi-led-dome"></div>
          </div>

          {/* Left & Right depth walls for 3D box feel */}
          <div className="fi-wall fi-wall-left"></div>
          <div className="fi-wall fi-wall-right"></div>
          <div className="fi-wall fi-wall-top"></div>
          <div className="fi-wall fi-wall-bottom"></div>

          {/* Interior content */}
          <div className="fi-content">
            {interiorFullscreen && children}
          </div>
        </div>
      </div>

      {/* ── STANDARD FRIDGE UI (login / closed state) ── */}
      <div className={`fridge-stage ${interiorFullscreen ? "hidden-stage" : ""}`}>
        <div className="fridge-header"></div>

        <div className="fridge-container">
          {/* Chassis */}
          <div className="fridge-cabinet">
            <div className={`fridge-interior ${doorOpen ? "light-on" : ""}`}>
              <div className="interior-led-dome"></div>
              <div className="frost-overlay"></div>
              {doorOpen && loggedIn && (
                <div className="fridge-small-dashboard-wrap">
                  {children}
                </div>
              )}
            </div>
          </div>

          {/* 3D Rotating Door */}
          <div className={`fridge-door-wrapper ${doorOpen ? "open" : ""}`}>
            <div className="fridge-door">
              {/* Door Front */}
              <div className="door-front brushed-metal">
                <div className="door-front-header"></div>

                {!loggedIn ? (
                  <div className={`door-login-container ${shakeForm ? "shake-form" : ""}`}>
                    {doorContent}
                  </div>
                ) : (
                  <div className="magnets-container">
                    {magnetOffsets.map((mag) => (
                      <div
                        key={mag.id}
                        className={`magnet magnet-${mag.id}`}
                        style={{ transform: `rotate(${mag.rot}deg)` }}
                        onClick={() => wobbleMagnet(mag.id)}
                        title={`Click to nudge: ${mag.label}`}
                      >
                        {mag.char}
                      </div>
                    ))}
                    <div className="magnet-notepad">
                      <div style={{ textDecoration: "underline", marginBottom: "4px" }}>
                        Shopping List
                      </div>
                      - Logins 🔑<br />
                      - Auth 🔐<br />
                      - Cool UI ❄️
                    </div>
                  </div>
                )}

                {/* Handle */}
                <div className="door-handle-container" onClick={handleHandleClick}>
                  <div className="door-handle">
                    <div className="handle-glow-indicator"></div>
                    <span className="handle-text">
                      {loggedIn ? "PULL TO CLOSE" : "PULL TO SIGN IN"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Door Back */}
              <div className="door-back">
                {loggedIn && user && (
                  <div className="sticky-note">
                    <span className="sticky-note-title">Welcome Back</span>
                    <span className="sticky-note-name">{user.fullname}</span>
                    <span className="sticky-note-footer">Have a cool day! ❄️</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fridge2;
