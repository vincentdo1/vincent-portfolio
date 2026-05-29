"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AdditiveBlending, Color, Vector3, type Points } from "three";
import {
  ELECTRONS_ON_HE,
  TOTAL_ELECTRONS,
} from "@/components/chemistry/heh-constants";

// Nuclear positions in scene units. The bond is drawn longer than scale for
// legibility; He is rendered slightly larger so the two atoms read distinctly.
const HE_POS = new Vector3(-0.62, 0, 0);
const H_POS = new Vector3(0.62, 0, 0);

// Sample N points from a Slater-like 1s density ρ(r) ∝ e^(−r/mean) around a
// nucleus: radius via inverse-CDF of an exponential, direction uniform on the
// sphere. The cusp at the nucleus gives a dense, realistic-looking core.
function sampleCloud(
  center: Vector3,
  count: number,
  mean: number,
  positions: Float32Array,
  colors: Float32Array,
  offset: number,
) {
  const core = new Color("#9dffc4"); // bright neon-green core (matches --primary)
  const edge = new Color("#0f8a47"); // dim green at the diffuse edge
  const tmp = new Color();

  for (let i = 0; i < count; i++) {
    let r = -mean * Math.log(1 - Math.random());
    if (r > 3 * mean) r = 3 * mean; // clip rare far samples

    const cosT = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - cosT * cosT);

    const j = (offset + i) * 3;
    positions[j] = center.x + r * s * Math.cos(phi);
    positions[j + 1] = center.y + r * s * Math.sin(phi);
    positions[j + 2] = center.z + r * cosT;

    const intensity = Math.min(1, Math.max(0.06, 1 - r / (2.2 * mean)));
    tmp.copy(edge).lerp(core, intensity);
    colors[j] = tmp.r;
    colors[j + 1] = tmp.g;
    colors[j + 2] = tmp.b;
  }
}

function ElectronCloud() {
  const { positions, colors } = useMemo(() => {
    const total = 7000;
    // Partition points by the integrated electron density on each centre.
    const nHe = Math.round((total * ELECTRONS_ON_HE) / TOTAL_ELECTRONS);
    const nH = total - nHe;
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);
    // He holds its electrons tighter (higher effective nuclear charge).
    sampleCloud(HE_POS, nHe, 0.4, positions, colors, 0);
    sampleCloud(H_POS, nH, 0.55, positions, colors, nHe);
    return { positions, colors };
  }, []);

  const ref = useRef<Points>(null);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.026}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function Molecule() {
  return (
    <group>
      <ElectronCloud />

      {/* Bond: cylinder aligned along x between the two nuclei */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, HE_POS.distanceTo(H_POS), 16]} />
        <meshStandardMaterial
          color="#bdeccd"
          transparent
          opacity={0.25}
          emissive="#2f7d4f"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* He nucleus (larger, electron-rich δ− end) */}
      <mesh position={HE_POS}>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial
          color="#dfe9ff"
          emissive="#9fc4ff"
          emissiveIntensity={0.5}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      {/* H nucleus (smaller, electron-poor δ+ end) */}
      <mesh position={H_POS}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial
          color="#fff1d6"
          emissive="#ffd27a"
          emissiveIntensity={0.45}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

export function HehPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Pause rendering when the canvas is offscreen or the tab is hidden.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let inView = true;
    const update = () =>
      setActive(inView && document.visibilityState === "visible");

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
        update();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReducedMotion(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 38% 45%, rgba(30,120,70,0.22), rgba(8,18,14,0.0) 60%)",
        }}
      />
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.18, 3.4], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[2, 3, 4]} intensity={1.6} />
        <Molecule />
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={1.2}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
