import { RigidBody } from "@react-three/rapier";
import { useState, useEffect } from "react";
import { Box, Sphere, Cone } from "@react-three/drei";
import * as THREE from "three";

export default function FallingShapes({ onShapeCollision }) {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    // Add a shape at random intervals
    const interval = setInterval(() => {
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      const shapeType = Math.floor(Math.random() * 3); // 0: Box, 1: Sphere, 2: Cone
      const size = Math.random() * 0.5 + 0.5; // Random size between 0.5 and 1.0
      const mass = Math.random() * 1.5 + 0.5; // Random mass between 0.5 and 2.0

      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: THREE.MathUtils.generateUUID(),
          position: [x, 5, z],
          type: shapeType,
          size: size,
          mass: mass,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {shapes.map((shape) => {
        let shapeComponent;
        switch (shape.type) {
          case 0:
            shapeComponent = <Box args={[shape.size, shape.size, shape.size]} />;
            break;
          case 1:
            shapeComponent = <Sphere args={[shape.size, 16, 16]} />;
            break;
          case 2:
            shapeComponent = <Cone args={[shape.size, shape.size * 2, 4]} />;
            break;
          default:
            shapeComponent = <Box args={[shape.size, shape.size, shape.size]} />;
        }

        return (
          <RigidBody
            key={shape.id}
            position={shape.position}
            colliders="cuboid"
            mass={shape.mass} // Set the mass of the shape
            restitution={0.5} // Ensure bounce effect when hitting the ground
            onCollisionEnter={({ other }) => {
              // Check if the shape is colliding with the car (tagged as 'vehicle')
              if (other.rigidBodyObject?.userData?.tag === "vehicle") {
                onShapeCollision(); // Trigger game over when shape hits the vehicle
              }
            }}
          >
            {shapeComponent}
          </RigidBody>
        );
      })}
    </>
  );
}
