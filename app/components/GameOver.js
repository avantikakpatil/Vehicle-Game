"use client";

import React from "react";

const GameOver = ({ onRestart }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "20px",
        borderRadius: "10px",
        color: "#fff",
      }}
    >
      <h1>Game Over</h1>
      <button
        onClick={onRestart}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          border: "none",
          background: "#28a745",
          color: "#fff",
        }}
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;
