"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Vehicle({ onGameOver }) {
  const vehicleRef = useRef(null);
  const [isColliding, setIsColliding] = useState(false);
  const [direction, setDirection] = useState([0, 0, 0]);
  const [cursorPos, setCursorPos] = useState([0, 0]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'w') setDirection([0, 0, -1]);
      if (event.key === 's') setDirection([0, 0, 1]);
      if (event.key === 'a') setDirection([-1, 0, 0]);
      if (event.key === 'd') setDirection([1, 0, 0]);
    };

    const handleKeyUp = () => setDirection([0, 0, 0]);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse movement for rotating the vehicle
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

  // Vehicle movement and rotation
  useFrame(() => {
    if (vehicleRef.current) {
      const speed = 0.05;
      const forwardVector = new THREE.Vector3(...direction);
      vehicleRef.current.position.add(forwardVector.multiplyScalar(speed));

      // Make the vehicle face the direction of the mouse
      const angle = Math.atan2(cursorPos[0], cursorPos[1]);
      vehicleRef.current.rotation.y = angle;

      if (isColliding) {
        onGameOver();
      }
    }
  });

  return (
    <group ref={vehicleRef} position={[0, 0.25, 0]}>
      <RigidBody 
        type="dynamic" 
        colliders="cuboid" 
        position={[0, 0.25, 0]} // Make sure the vehicle starts on the ground
        lockRotations
        lockTranslations={[false, true, false]} // Allow movement only along X and Z axis
      >
        <Box args={[2, 0.5, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic" colliders="ball" position={[0, 0.25, 0.75]} lockRotations>
        <Sphere args={[0.25, 16, 16]}>
          <meshStandardMaterial color="black" />
        </Sphere>
      </RigidBody>

      <RigidBody type="dynamic" colliders="ball" position={[-0.75, 0.25, -0.75]} lockRotations>
        <Cylinder args={[0.25, 0.25, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="black" />
        </Cylinder>
      </RigidBody>

      <RigidBody type="dynamic" colliders="ball" position={[0.75, 0.25, -0.75]} lockRotations>
        <Cylinder args={[0.25, 0.25, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="black" />
        </Cylinder>
      </RigidBody>
    </group>
  );
}
