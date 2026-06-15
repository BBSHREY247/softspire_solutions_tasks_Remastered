import React from "react";
import "./ThemeSelector.css";

function ThemeSelector({ currentTheme, onThemeChange }) {
  const themes = [
    { id: 1, icon: "🏫", name: "Blackboard Theme", label: "Blackboard" },
    { id: 2, icon: "❄️", name: "Smart Fridge Theme", label: "Smart Fridge" },
    { id: 3, icon: "👊", name: "S-Class Saitama Theme", label: "Saitama Shatter" },
  ];

  return (
    <div className="theme-switch-dock">
      <div className="dock-title">THEMES</div>
      <div className="dock-buttons">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-btn ${currentTheme === theme.id ? "active" : ""}`}
            onClick={() => onThemeChange(theme.id)}
            title={theme.name}
          >
            <span className="theme-icon">{theme.icon}</span>
            <span className="tooltip">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
