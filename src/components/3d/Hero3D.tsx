import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

function FloatingPhone() {
  const ref = useRef<any>(null);
  const reduced = usePrefersReducedMotion();

  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t / 2) * 0.08;
    ref.current.rotation.x = Math.sin(t / 3) * 0.03;
    ref.current.position.y = Math.sin(t) * 0.15;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 3.6, 0.14]} />
      <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.2} />
      {/* screen */}
      <mesh position={[0, 0, 0.077]}>
        <planeGeometry args={[1.6, 3.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.02} />
      </mesh>
    </mesh>
  );
}

function FloatingTorus({ speed = 1.2, radius = 0.6, color = "#ffb86b" }: { speed?: number; radius?: number; color?: string }) {
  const ref = useRef<any>(null);
  const reduced = usePrefersReducedMotion();
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.y = t;
    ref.current.position.y = Math.sin(t) * 0.25;
  });

  return (
    <mesh ref={ref} position={[radius, 0.4, 0]}>
      <torusGeometry args={[0.25, 0.12, 16, 64]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

export default function Hero3D() {
  const reduced = usePrefersReducedMotion();

  return (
    <div style={{ width: "100%", height: 420, pointerEvents: reduced ? "none" : "auto" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        <Suspense fallback={null}>
          <FloatingPhone />
          <FloatingTorus speed={1.1} radius={-1.2} color="#ffd28a" />
          <FloatingTorus speed={1.4} radius={1.2} color="#ff9aa2" />
        </Suspense>
      </Canvas>
    </div>
  );
}
