"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Sphere, Box, Cylinder } from '@react-three/drei';

export default function FallingShapes({ onShapeCollision }) {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: Date.now(),
          position: [
            Math.random() * 10 - 5,
            10,
            Math.random() * 10 - 5,
          ],
          size: Math.random() * 0.5 + 0.5,
          type: Math.random() > 0.5 ? 'box' : Math.random() > 0.5 ? 'sphere' : 'cylinder',
          mass: Math.random() * 2 + 1,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {shapes.map((shape) => {
        const { id, position, size, type, mass } = shape;
        return (
          <RigidBody
            key={id}
            type="dynamic"
            position={position}
            mass={mass}
            onCollisionEnter={() => onShapeCollision(id)} // Call onShapeCollision when collision occurs
          >
            {type === 'box' && <Box args={[size, size, size]} />}
            {type === 'sphere' && <Sphere args={[size, 16, 16]} />}
            {type === 'cylinder' && <Cylinder args={[size, size, size, 32]} />}
          </RigidBody>
        );
      })}
    </>
  );
}
