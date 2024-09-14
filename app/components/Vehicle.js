"use client"; // Add this line

import { useRef, useState, useEffect } from "react"; // Ensure useState is imported
import { RigidBody } from "@react-three/rapier";
import { Box, Sphere, Cylinder } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Vehicle({ onGameOver }) {
  const vehicleRef = useRef(null);

  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "w") setMoveForward(true);
      if (event.key === "s") setMoveBackward(true);
    };

    const handleKeyUp = (event) => {
      if (event.key === "w") setMoveForward(false);
      if (event.key === "s") setMoveBackward(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (vehicleRef.current) {
      const vehicleBody = vehicleRef.current;
      const speed = 5;

      const rotation = vehicleBody.rotation();
      const quaternion = new THREE.Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w
      );

      const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
        quaternion
      );

      if (moveForward) {
        const forwardVelocity = forwardDirection.multiplyScalar(speed);
        vehicleBody.setLinvel({
          x: forwardVelocity.x,
          y: vehicleBody.linvel().y,
          z: forwardVelocity.z,
        });
      }
      if (moveBackward) {
        const backwardVelocity = forwardDirection.multiplyScalar(-speed);
        vehicleBody.setLinvel({
          x: backwardVelocity.x,
          y: vehicleBody.linvel().y,
          z: backwardVelocity.z,
        });
      }

      if (!moveForward && !moveBackward) {
        vehicleBody.setLinvel({
          x: 0,
          y: vehicleBody.linvel().y,
          z: 0,
        });
      }

      // Access position directly
      const position = vehicleBody.translation(); // Adjust based on Rapier's API
      if (position.y < -10) {
        onGameOver(); // Trigger game over when the vehicle falls below a certain height
      }
    }
  });

  return (
    <RigidBody
      ref={vehicleRef}
      type="dynamic"
      colliders="cuboid"
      userData={{ tag: "vehicle" }}
      linearDamping={0.8}
      angularDamping={10}
    >
      {/* Vehicle Body */}
      <Box args={[2, 0.5, 1]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="blue" />
      </Box>

      {/* Front Wheel */}
      <Sphere args={[0.25, 16, 16]} position={[0, 0.25, 0.75]}>
        <meshStandardMaterial color="black" />
      </Sphere>

      {/* Back Left Wheel */}
      <Cylinder args={[0.25, 0.25, 0.1, 32]} position={[-0.75, 0.25, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>

      {/* Back Right Wheel */}
      <Cylinder args={[0.25, 0.25, 0.1, 32]} position={[0.75, 0.25, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
    </RigidBody>
  );
}
