"use client"; // Add this line

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Vehicle from "./components/Vehicle";
import FallingShapes from "./components/FallingShapes";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Box } from "@react-three/drei";

async function saveScore(score: number) {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
  });

  if (!response.ok) {
    console.error("Failed to save score:", response.statusText);
  }
}

export default function Page() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const handleGameOver = () => {
    setGameOver(true);
    if (!scoreSubmitted) {
      saveScore(score);
      setScoreSubmitted(true);
    }
  };

  const handleShapeCollision = () => {
    setGameOver(true);
    if (!scoreSubmitted) {
      saveScore(score);
      setScoreSubmitted(true);
    }
  };

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setScore((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameOver]);

  if (gameOver) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h1>Game Over</h1>
        <h2>Your Score: {score}</h2>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <Canvas
      style={{ height: "100vh", width: "100vw", display: "block" }}
      camera={{ position: [0, 5, 10], fov: 75, near: 0.1, far: 1000 }}
    >
      <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={75} near={0.1} far={1000} />
      <ambientLight intensity={0.9} />
      <pointLight position={[20, 20, 20]} />

      <Physics>
        {/* Add the vehicle */}
        <Vehicle onGameOver={handleGameOver} />

        {/* Add ground */}
        <RigidBody type="fixed" colliders="cuboid" position={[0, -0.25, 0]}>
          <Box args={[100, 0.5, 100]}>
            <meshStandardMaterial color="gray" />
          </Box>
        </RigidBody>

        {/* Add falling shapes */}
        <FallingShapes onShapeCollision={handleShapeCollision} />
      </Physics>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
