import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Box, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";

export default function Vehicle() {
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

      // Get the rotation of the vehicle in quaternion form
      const rotation = vehicleBody.rotation();
      const quaternion = new THREE.Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w
      );

      // Forward direction vector
      const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
        quaternion
      );

      // Update velocity based on user input
      if (moveForward) {
        const forwardVelocity = forwardDirection.multiplyScalar(speed);
        vehicleBody.setLinvel({
          x: forwardVelocity.x,
          y: vehicleBody.linvel().y, // Keep vertical velocity unchanged
          z: forwardVelocity.z,
        });
      }
      if (moveBackward) {
        const backwardVelocity = forwardDirection.multiplyScalar(-speed);
        vehicleBody.setLinvel({
          x: backwardVelocity.x,
          y: vehicleBody.linvel().y, // Keep vertical velocity unchanged
          z: backwardVelocity.z,
        });
      }

      // Stop the vehicle if no key is pressed
      if (!moveForward && !moveBackward) {
        vehicleBody.setLinvel({
          x: 0,
          y: vehicleBody.linvel().y, // Preserve gravity or vertical forces
          z: 0,
        });
      }
    }
  });

  return (
    <group ref={vehicleRef} position={[0, 0, 0]}>
      {/* Vehicle Body */}
      <RigidBody
        ref={vehicleRef}
        type="dynamic"
        colliders="cuboid"
        userData={{ tag: "vehicle" }}
        linearDamping={0.8}
        angularDamping={10}
      >
        <Box args={[2, 0.5, 1]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>

      {/* Front Wheel */}
      <RigidBody
        type="dynamic"
        colliders="ball"
        position={[0, 0.25, 0.75]}
        gravityScale={0}
        linearDamping={1.0}
        angularDamping={10}
      >
        <Sphere args={[0.25, 16, 16]}>
          <meshStandardMaterial color="black" />
        </Sphere>
      </RigidBody>

      {/* Back Left Wheel */}
      <RigidBody
        type="dynamic"
        colliders="ball"
        position={[-0.75, 0.25, -0.75]}
        gravityScale={0}
        linearDamping={1.0}
        angularDamping={10}
      >
        <Cylinder args={[0.25, 0.25, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="black" />
        </Cylinder>
      </RigidBody>

      {/* Back Right Wheel */}
      <RigidBody
        type="dynamic"
        colliders="ball"
        position={[0.75, 0.25, -0.75]}
        gravityScale={0}
        linearDamping={1.0}
        angularDamping={10}
      >
        <Cylinder args={[0.25, 0.25, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="black" />
        </Cylinder>
      </RigidBody>
    </group>
  );
}
