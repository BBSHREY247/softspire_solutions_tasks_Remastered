import React from "react";
import "../styles/saitama.css";

// Renders shattered, jagged polygonal shards of the login card
function ShatterCard({ email, password }) {
  // Define 9 irregular matching polygons with shared vertices (no gaps)
  // Vertex Coordinates:
  // A' = (30%, 38%)
  // B' = (70%, 28%)
  // C' = (25%, 70%)
  // D' = (72%, 62%)
  const shardsData = [
    {
      id: 0,
      polygon: "polygon(0% 0%, 38% 0%, 30% 38%, 0% 32%)",
      dirX: -1.2,
      dirY: -1.0,
      rz: -25
    },
    {
      id: 1,
      polygon: "polygon(38% 0%, 72% 0%, 70% 28%, 30% 38%)",
      dirX: 0.1,
      dirY: -1.3,
      rz: 15
    },
    {
      id: 2,
      polygon: "polygon(72% 0%, 100% 0%, 100% 35%, 70% 28%)",
      dirX: 1.3,
      dirY: -0.9,
      rz: 30
    },
    {
      id: 3,
      polygon: "polygon(0% 32%, 30% 38%, 25% 70%, 0% 68%)",
      dirX: -1.4,
      dirY: 0.1,
      rz: -20
    },
    {
      id: 4,
      polygon: "polygon(30% 38%, 70% 28%, 72% 62%, 25% 70%)",
      dirX: 0.2,
      dirY: 0.2,
      rz: -10
    },
    {
      id: 5,
      polygon: "polygon(70% 28%, 100% 35%, 100% 65%, 72% 62%)",
      dirX: 1.4,
      dirY: 0.1,
      rz: 25
    },
    {
      id: 6,
      polygon: "polygon(0% 68%, 25% 70%, 35% 100%, 0% 100%)",
      dirX: -1.1,
      dirY: 1.1,
      rz: -30
    },
    {
      id: 7,
      polygon: "polygon(25% 70%, 72% 62%, 68% 100%, 35% 100%)",
      dirX: -0.1,
      dirY: 1.3,
      rz: 10
    },
    {
      id: 8,
      polygon: "polygon(72% 62%, 100% 65%, 100% 100%, 68% 100%)",
      dirX: 1.2,
      dirY: 1.2,
      rz: 35
    }
  ];

  const shards = shardsData.map((s) => {
    // Randomize explosion drift slightly for variety
    const baseForce = 150;
    const transX = (s.dirX * baseForce + (Math.random() * 50 - 25)).toFixed(0);
    const transY = (s.dirY * baseForce + (Math.random() * 50 - 25)).toFixed(0);
    const rotation = (s.rz + (Math.random() * 15 - 7.5)).toFixed(1);

    return {
      id: s.id,
      clipStyle: {
        clipPath: s.polygon
      },
      styleVariables: {
        "--tx": `${transX}px`,
        "--ty": `${transY}px`,
        "--rz": `${rotation}deg`,
        "--delay": `${(Math.random() * 0.02).toFixed(3)}s`
      }
    };
  });

  // Inner card mockup replica (matches style exactly)
  const cardReplica = (
    <div className="auth-card replica">
      <div className="login">
        <h1>Login</h1>
        <label>Enter Your Existing Email</label>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          readOnly
          disabled
        />
        <label>Enter Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          readOnly
          disabled
        />
        <button type="button" disabled style={{ background: "#f97316" }}>
          Login
        </button>
        <p>
          Don't have an account? <span className="link-btn">Register</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="shatter-container">
      {shards.map((shard) => (
        <div
          key={shard.id}
          className="shattered-shard"
          style={{ ...shard.clipStyle, ...shard.styleVariables }}
        >
          {cardReplica}
        </div>
      ))}
    </div>
  );
}

export default ShatterCard;
