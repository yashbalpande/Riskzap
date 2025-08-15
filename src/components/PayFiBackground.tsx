import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ count = 5000 }) => {
  const points = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions in 3D space
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Warm color palette (reds, oranges, yellows, greens)
      const colorType = Math.random();
      if (colorType < 0.25) {
        // Red particles
        colors[i3] = 1;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.1;
      } else if (colorType < 0.5) {
        // Orange particles
        colors[i3] = 1;
        colors[i3 + 1] = 0.6;
        colors[i3 + 2] = 0.1;
      } else if (colorType < 0.75) {
        // Yellow particles
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 0.2;
      } else {
        // Green particles
        colors[i3] = 0.2;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 0.3;
      }
    }
    
    return { positions, colors };
  }, [count]);

  const pointsRef = React.useRef<THREE.Points>(null);

  React.useEffect(() => {
    let animationId: number;
    const animate = () => {
      if (pointsRef.current) {
        pointsRef.current.rotation.x += 0.0005;
        pointsRef.current.rotation.y += 0.001;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <Points ref={pointsRef} positions={points.positions} colors={points.colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        alphaTest={0.5}
      />
    </Points>
  );
};

const PayFiBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleField />
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#ff6b35" />
          <pointLight position={[-10, -10, 10]} intensity={0.3} color="#4ade80" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PayFiBackground;