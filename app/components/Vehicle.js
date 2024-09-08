// components/Vehicle.js
"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function Vehicle({ onGameOver }) {
  const vehicleRef = useRef();
  const [direction, setDirection] = useState([0, 0, 0]);
  const [cursorPos, setCursorPos] = useState([0, 0]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'w') {
        setDirection([0, 0, -1]); // Move forward
      }
      if (event.key === 's') {
        setDirection([0, 0, 1]); // Move backward
      }
    };

    const handleKeyUp = () => {
      setDirection([0, 0, 0]); // Stop movement
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = - (event.clientY / window.innerHeight) * 2 + 1;
      setCursorPos([x, y]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(() => {
    if (vehicleRef.current) {
      const forwardVector = new THREE.Vector3();
      vehicleRef.current.getWorldDirection(forwardVector);

      // Move vehicle based on direction
      const speed = 0.1;
      vehicleRef.current.position.z += direction[2] * speed;

      // Adjust rotation based on cursor position
      vehicleRef.current.rotation.y = Math.atan2(cursorPos[0], cursorPos[1]);
    }
  });

  return (
    <group ref={vehicleRef} position={[0, 1, 0]} name="vehicle">
      {/* Vehicle body */}
      <RigidBody type="kinematicPosition" colliders="cuboid">
        <Box args={[2, 0.5, 1]} />
      </RigidBody>
      {/* Front wheel */}
      <RigidBody type="kinematicPosition" position={[0, 1.25, 0.75]} colliders="ball">
        <Sphere args={[0.5, 16, 16]} />
      </RigidBody>
      {/* Back wheels */}
      <RigidBody type="kinematicPosition" position={[-0.75, 0.75, -0.5]} colliders="ball">
        <Cylinder args={[0.25, 0.25, 0.5, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </RigidBody>
      <RigidBody type="kinematicPosition" position={[0.75, 0.75, -0.5]} colliders="ball">
        <Cylinder args={[0.25, 0.25, 0.5, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </RigidBody>
    </group>
  );
}
