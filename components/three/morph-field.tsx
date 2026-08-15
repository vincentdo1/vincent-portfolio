"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildAllShapes,
  seedArray,
  SHAPE_ORDER,
  type ShapeKey,
} from "@/lib/three/shapes";

/**
 * A single point field that morphs between the shapes in SHAPE_ORDER.
 *
 * The lerp happens entirely in the vertex shader between two position
 * attributes, so scrubbing costs one uniform write per frame. Attribute
 * buffers are only rewritten when the scroll crosses a segment boundary.
 */

const VERT = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uDpr;
  uniform float uDrift;
  uniform float uFire;

  attribute vec3 aTarget;
  attribute float aSeed;

  varying float vGlow;

  void main() {
    // per-point stagger so the morph reads as a wave rather than a slab
    float stagger = aSeed * 0.28;
    float p = clamp((uProgress - stagger) / 0.72, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);

    vec3 pos = mix(position, aTarget, p);

    // slight outward bow mid-flight; kept small so the silhouette stays readable
    float arc = sin(p * 3.14159265);
    pos += normalize(pos + vec3(0.0001)) * arc * (0.1 + aSeed * 0.16);

    // idle drift keeps the field breathing when scroll is parked
    float t = uTime + aSeed * 6.2831853;
    pos += vec3(sin(t * 0.42), cos(t * 0.37), sin(t * 0.31)) * uDrift;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // clamped: without a ceiling, points that drift near the camera in the
    // opening scatter blow up into blurry discs instead of reading as a field
    gl_PointSize = clamp(
      uSize * (0.6 + aSeed * 0.65) * uDpr * (10.0 / max(0.1, -mvPosition.z)),
      1.0,
      7.5 * uDpr
    );

    vGlow = 0.52 + arc * 0.42 + smoothstep(15.0, 3.0, -mvPosition.z) * 0.4;

    // neuron firing: a depolarisation wave sweeping front-to-back plus
    // individual somas spiking off-phase. Gated by uFire so it only runs on the
    // brain and fades out with the morph rather than switching on abruptly.
    if (uFire > 0.001) {
      float wave = sin(uTime * 1.9 - pos.z * 2.3 + pos.y * 0.9);
      float spike = sin(uTime * 5.5 + aSeed * 62.83);
      float fire =
        smoothstep(0.72, 1.0, wave) * 0.85 + smoothstep(0.93, 1.0, spike) * 1.1;
      vGlow += fire * uFire;
      gl_PointSize *= 1.0 + fire * uFire * 0.55;
    }
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;

  varying float vGlow;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > 0.25) discard;

    float alpha = smoothstep(0.25, 0.0, d);
    vec3 col = mix(uColor, uHot, clamp(vGlow - 0.4, 0.0, 1.0));
    gl_FragColor = vec4(col, alpha * clamp(vGlow, 0.0, 1.0));
  }
`;

/**
 * Dwell curve.
 *
 * A linear scroll→morph mapping means each shape exists for exactly one
 * instant, so the field reads as permanent mush. This holds the source shape
 * for the first quarter of a segment and the target for the last quarter,
 * leaving the middle half for the transition — every shape gets a real plateau
 * you can stop and look at.
 */
function dwell(u: number) {
  const t = Math.min(1, Math.max(0, (u - 0.25) / 0.5));
  return t * t * (3 - 2 * t);
}

/**
 * Presentation pose per shape.
 *
 * A single global rotation shows some shapes well and others edge-on — the hub
 * ring in particular collapses to a smear when viewed from the equator. Each
 * shape declares the angle it reads best from, and poses are interpolated with
 * the same dwell curve as the morph itself.
 */
const POSES: Record<ShapeKey, { rx: number; ry: number; s: number }> = {
  scatter: { rx: 0.1, ry: 0, s: 1 },
  rocket: { rx: 0.02, ry: 0.35, s: 1 },
  brain: { rx: 0.14, ry: 1.32, s: 1.18 },
  // helix and handset both read as flat silhouettes, so keep them near front-on
  dna: { rx: 0.04, ry: 0.28, s: 0.92 },
  handset: { rx: 0.05, ry: -0.22, s: 0.98 },
  // the tree is tall and only reads as a tree face-on; scaled down so the
  // pruned width and the surviving line both stay in frame
  tree: { rx: 0.05, ry: 0.2, s: 0.84 },
  network: { rx: 0.14, ry: -0.42, s: 0.8 },
  mesh: { rx: 0.62, ry: 0.3, s: 0.95 },
  globe: { rx: 0.18, ry: 0, s: 1 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = {
  /** 0 → 1 across the whole shape sequence. Read every frame, never re-renders. */
  progressRef: React.RefObject<number>;
  count: number;
  /** Shift the field clear of the copy column on wide screens. */
  offsetX?: number;
  /** Lift the field above the copy on narrow screens, where they stack. */
  offsetY?: number;
  /** Extra scale on top of each shape's pose, to fit narrow viewports. */
  fieldScale?: number;
  /** Frozen pose for prefers-reduced-motion. */
  staticMode?: boolean;
};

export function MorphField({
  progressRef,
  count,
  offsetX = 0,
  offsetY = 0,
  fieldScale = 1,
  staticMode = false,
}: Props) {
  const shapes = useMemo(() => buildAllShapes(count), [count]);
  const segments = SHAPE_ORDER.length - 1;
  const lastSegment = useRef(-1);
  const points = useRef<THREE.Points>(null);
  const spin = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(shapes[0]), 3),
    );
    g.setAttribute(
      "aTarget",
      new THREE.BufferAttribute(new Float32Array(shapes[1]), 3),
    );
    g.setAttribute("aSeed", new THREE.BufferAttribute(seedArray(count), 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 9);
    return g;
  }, [shapes, count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 3.4 },
          uDpr: { value: 1 },
          uDrift: { value: staticMode ? 0 : 0.022 },
          uFire: { value: 0 },
          uColor: { value: new THREE.Color("#3fae44") },
          uHot: { value: new THREE.Color("#7cff6b") },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [staticMode],
  );

  // All mutation happens through the <points> ref inside the frame callback —
  // render-scope objects stay untouched after render, which is both what the
  // react compiler rules require and the cheapest path (no allocations here).
  useFrame((state, delta) => {
    const pts = points.current;
    if (!pts) return;
    const u = (pts.material as THREE.ShaderMaterial).uniforms;
    const geo = pts.geometry;

    u.uDpr.value = state.viewport.dpr;
    if (!staticMode) u.uTime.value += delta;

    const raw = Math.min(0.9999, Math.max(0, progressRef.current ?? 0));
    const scaled = raw * segments;
    const segment = Math.floor(scaled);

    if (segment !== lastSegment.current) {
      const pos = geo.attributes.position as THREE.BufferAttribute;
      const tgt = geo.attributes.aTarget as THREE.BufferAttribute;
      (pos.array as Float32Array).set(shapes[segment]);
      (tgt.array as Float32Array).set(shapes[segment + 1]);
      pos.needsUpdate = true;
      tgt.needsUpdate = true;
      lastSegment.current = segment;
    }

    const p = dwell(scaled - segment);
    u.uProgress.value = p;

    // how "brain" the field currently is, so firing fades in with the morph
    const from = SHAPE_ORDER[segment];
    const to = SHAPE_ORDER[segment + 1];
    u.uFire.value = from === "brain" ? 1 - p : to === "brain" ? p : 0;

    const a = POSES[SHAPE_ORDER[segment]];
    const b = POSES[SHAPE_ORDER[segment + 1]];

    // bounded wobble, not an accumulating spin — an unbounded rotation would
    // eventually swing every shape back to the bad angle the poses avoid
    if (!staticMode) spin.current += delta;
    const w = spin.current;

    pts.rotation.x = lerp(a.rx, b.rx, p) + Math.sin(w * 0.23) * 0.03;
    pts.rotation.y = lerp(a.ry, b.ry, p) + Math.sin(w * 0.17) * 0.11;
    pts.scale.setScalar(lerp(a.s, b.s, p) * fieldScale);
  });

  return (
    <points
      ref={points}
      geometry={geometry}
      material={material}
      position={[offsetX, offsetY, 0]}
    />
  );
}
