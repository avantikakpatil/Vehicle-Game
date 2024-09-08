"use client";

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Vehicle from './components/Vehicle';
import FallingShapes from './components/FallingShapes';
import { OrbitControls, PerspectiveCamera, Plane } from '@react-three/drei';

async function saveScore(score: number) { // Specify type for score
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score }),
  });

  if (!response.ok) {
    console.error('Failed to save score:', response.statusText);
  }
}

export default function Page() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const handleShapeCollision = () => {
    setGameOver(true);
    if (!scoreSubmitted) {
      saveScore(score);
      setScoreSubmitted(true);
    }
  };

  // Example to increase the score over time or based on certain events
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setScore((prev) => prev + 1); // Increment score every second
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameOver]);

  if (gameOver) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        <h1>Game Over</h1>
        <h2>Your Score: {score}</h2>
      </div>
    );
  }

  return (
    <Canvas
      style={{ height: '100vh', width: '100vw', display: 'block' }}
      camera={{ position: [0, 5, 10], fov: 75, near: 0.1, far: 1000 }}
    >
      <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={75} near={0.1} far={1000} />
      <ambientLight intensity={0.9} />
      <pointLight position={[20, 20, 20]} />
      <Physics>
        <Vehicle />
        <FallingShapes onShapeCollision={handleShapeCollision} />
        <Plane args={[150, 100]} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial color="gray" />
        </Plane>
      </Physics>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
