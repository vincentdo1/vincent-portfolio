/**
 * Procedural point-cloud shape generators.
 *
 * Every generator writes exactly `count` xyz triples into a Float32Array so any
 * two shapes can be linearly morphed on the GPU with a single lerp.
 *
 * Nothing here is downloaded or licensed — the geometry is math, so the whole
 * 3D layer costs 0 bytes of asset weight and has no attribution requirements.
 */

export type ShapeKey =
  | "scatter"
  | "rocket"
  | "handset"
  | "brain"
  | "dna"
  | "tree"
  | "network"
  | "mesh"
  | "globe";

/**
 * The shapes the field morphs through, in document order.
 *
 * This is decoration, not meaning. The shapes do not stand for the content
 * they sit behind and nothing should be read into which one appears where.
 * Order has to match document order so that scrolling normally never makes
 * the field race backwards through the array.
 *
 * **Registration granularity is a layout question, not a taste one.** The
 * field picks the registered element nearest the middle of the viewport, so
 * two elements that can occupy the same vertical band tie at distance zero
 * and insertion order silently decides the winner. That is exactly what went
 * wrong when both project cards registered: they share a grid row on desktop,
 * so the chess brain sat behind the Airport Routing card and the globe was
 * unreachable at any scroll position.
 *
 * The rule that follows: register per item where items **stack** (the three
 * experience roles are a single-column `<ol>`, so they can never tie), and
 * per section where they **can share a row** (Featured Work owns one shape
 * for both cards).
 *
 * `tree`, `network` and `mesh` are generated and posed but unused. `tree` is a
 * chess search tree pruning to one bright principal variation; it has been
 * built for a closing stage twice and cut twice, so check before reviving it.
 */
export const SHAPE_ORDER: ShapeKey[] = [
  "scatter", // intro
  "brain", // #work — one shape, both project cards
  "rocket", // #boeing
  "handset", // #expedia-group
  "dna", // #uw-madison
  "globe", // #profile and #contact
];

/** Position of a shape in the morph order, for sections to target. */
export function shapeIndex(key: ShapeKey): number {
  const i = SHAPE_ORDER.indexOf(key);
  return i < 0 ? 0 : i;
}

/** Deterministic RNG so a given shape is byte-identical every build. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;

function write(out: Float32Array, i: number, x: number, y: number, z: number) {
  out[i * 3] = x;
  out[i * 3 + 1] = y;
  out[i * 3 + 2] = z;
}

/** Gaussian-ish jitter without a sqrt/log per call. */
function jitter(rng: Rng, amount: number) {
  return (rng() + rng() + rng() - 1.5) * amount;
}

/** Split `count` across weighted buckets, guaranteeing the total is exact. */
function budget(count: number, weights: number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  const parts = weights.map((w) => Math.floor((w / total) * count));
  let used = parts.reduce((a, b) => a + b, 0);
  let i = 0;
  while (used < count) {
    parts[i % parts.length] += 1;
    used += 1;
    i += 1;
  }
  return parts;
}

/* ── scatter ─────────────────────────────────────────────────────────────── */
/** Diffuse cloud the field rests in before it assembles. */
function scatter(out: Float32Array, count: number, rng: Rng) {
  for (let i = 0; i < count; i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = 3.6 + rng() * 3.4;
    write(
      out,
      i,
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi) * 0.62,
      r * Math.sin(phi) * Math.sin(theta),
    );
  }
}

/* ── rocket ──────────────────────────────────────────────────────────────── */
/** Launch vehicle: body, nose cone, four fins, exhaust plume. */
function rocket(out: Float32Array, count: number, rng: Rng) {
  const [nBody, nNose, nFins, nPlume, nBands] = budget(
    count,
    [34, 15, 13, 24, 14],
  );
  let i = 0;

  const R = 0.62;
  const bodyBottom = -1.25;
  const bodyTop = 1.05;

  // hull
  for (let k = 0; k < nBody; k++, i++) {
    const t = rng() * Math.PI * 2;
    const y = bodyBottom + rng() * (bodyTop - bodyBottom);
    const r = R + jitter(rng, 0.035);
    write(out, i, Math.cos(t) * r, y, Math.sin(t) * r);
  }

  // nose cone
  for (let k = 0; k < nNose; k++, i++) {
    const t = rng() * Math.PI * 2;
    const u = Math.sqrt(rng()); // bias toward the base so the tip stays sharp
    const y = bodyTop + (1 - u) * 1.5;
    const r = R * u + jitter(rng, 0.02);
    write(out, i, Math.cos(t) * r, y, Math.sin(t) * r);
  }

  // four fins, sampled inside a triangle via barycentric coords
  const finPer = Math.floor(nFins / 4);
  for (let f = 0; f < 4; f++) {
    const a = (f / 4) * Math.PI * 2;
    const cx = Math.cos(a);
    const cz = Math.sin(a);
    const n = f === 3 ? nFins - finPer * 3 : finPer;
    for (let k = 0; k < n; k++, i++) {
      let u = rng();
      let v = rng();
      if (u + v > 1) {
        u = 1 - u;
        v = 1 - v;
      }
      const w = 1 - u - v;
      // triangle: inner-top, inner-bottom, outer-bottom
      const r = w * R + u * R + v * 1.5;
      const y = w * -0.15 + u * bodyBottom + v * (bodyBottom - 0.45);
      write(out, i, cx * r, y, cz * r + jitter(rng, 0.03));
    }
  }

  // exhaust plume — thins out as it falls away
  for (let k = 0; k < nPlume; k++, i++) {
    const d = Math.pow(rng(), 0.65);
    const y = bodyBottom - d * 2.5;
    const spread = 0.34 + d * 0.85;
    const t = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * spread;
    write(out, i, Math.cos(t) * r, y, Math.sin(t) * r);
  }

  // structural bands — reads as panel lines at a glance
  for (let k = 0; k < nBands; k++, i++) {
    const band = [0.72, 0.1, -0.62][k % 3];
    const t = rng() * Math.PI * 2;
    write(
      out,
      i,
      Math.cos(t) * (R + 0.05),
      band + jitter(rng, 0.02),
      Math.sin(t) * (R + 0.05),
    );
  }
}

/* ── network ─────────────────────────────────────────────────────────────── */
/**
 * The chess model's actual shape: an 8×8 board plane feeding conv layers,
 * an LSTM strip, then a policy head.
 */
function network(out: Float32Array, count: number, rng: Rng) {
  type Layer = { x: number; nodes: [number, number, number][] };
  const layers: Layer[] = [];

  const grid = (x: number, n: number, spacing: number): Layer => {
    const nodes: [number, number, number][] = [];
    const half = ((n - 1) * spacing) / 2;
    for (let a = 0; a < n; a++) {
      for (let b = 0; b < n; b++) {
        nodes.push([x, a * spacing - half, b * spacing - half]);
      }
    }
    return { x, nodes };
  };

  const column = (x: number, n: number, spacing: number): Layer => {
    const nodes: [number, number, number][] = [];
    const half = ((n - 1) * spacing) / 2;
    for (let a = 0; a < n; a++) nodes.push([x, a * spacing - half, 0]);
    return { x, nodes };
  };

  layers.push(grid(-2.7, 8, 0.3)); // 8×8 input plane
  layers.push(grid(-1.35, 6, 0.34)); // conv
  layers.push(grid(0, 4, 0.4)); // conv
  layers.push(column(1.5, 12, 0.26)); // LSTM strip
  layers.push(column(2.8, 8, 0.3)); // policy head

  const totalNodes = layers.reduce((a, l) => a + l.nodes.length, 0);
  const [nNodes, nEdges] = budget(count, [52, 48]);
  let i = 0;

  // node clusters — every node gets a fair share of the point budget
  const perNode = Math.max(1, Math.floor(nNodes / totalNodes));
  let placed = 0;
  for (const layer of layers) {
    for (const [x, y, z] of layer.nodes) {
      for (let k = 0; k < perNode && placed < nNodes; k++, i++, placed++) {
        write(
          out,
          i,
          x + jitter(rng, 0.05),
          y + jitter(rng, 0.05),
          z + jitter(rng, 0.05),
        );
      }
    }
  }
  for (; placed < nNodes; i++, placed++) {
    const layer = layers[Math.floor(rng() * layers.length)];
    const [x, y, z] = layer.nodes[Math.floor(rng() * layer.nodes.length)];
    write(
      out,
      i,
      x + jitter(rng, 0.05),
      y + jitter(rng, 0.05),
      z + jitter(rng, 0.05),
    );
  }

  // connections between adjacent layers
  for (let k = 0; k < nEdges; k++, i++) {
    const li = Math.floor(rng() * (layers.length - 1));
    const A = layers[li].nodes[Math.floor(rng() * layers[li].nodes.length)];
    const B =
      layers[li + 1].nodes[Math.floor(rng() * layers[li + 1].nodes.length)];
    const t = rng();
    write(
      out,
      i,
      A[0] + (B[0] - A[0]) * t,
      A[1] + (B[1] - A[1]) * t + jitter(rng, 0.015),
      A[2] + (B[2] - A[2]) * t + jitter(rng, 0.015),
    );
  }
}

/* ── mesh ────────────────────────────────────────────────────────────────── */
/** Service mesh: hub ring, chord links, and a central broker. */
function mesh(out: Float32Array, count: number, rng: Rng) {
  const HUBS = 22;
  const R = 2.45;
  const hubs: [number, number, number][] = [];
  for (let h = 0; h < HUBS; h++) {
    const a = (h / HUBS) * Math.PI * 2;
    const tilt = Math.sin(a * 3) * 0.42;
    hubs.push([Math.cos(a) * R, tilt, Math.sin(a) * R]);
  }

  const [nHubs, nChords, nSpokes, nCore] = budget(count, [26, 34, 28, 12]);
  let i = 0;

  for (let k = 0; k < nHubs; k++, i++) {
    const [x, y, z] = hubs[k % HUBS];
    write(
      out,
      i,
      x + jitter(rng, 0.09),
      y + jitter(rng, 0.09),
      z + jitter(rng, 0.09),
    );
  }

  // hub-to-hub chords, pulled toward the centre so they read as routed links
  for (let k = 0; k < nChords; k++, i++) {
    const A = hubs[Math.floor(rng() * HUBS)];
    const B = hubs[Math.floor(rng() * HUBS)];
    const t = rng();
    const sag = Math.sin(t * Math.PI) * 0.42;
    write(
      out,
      i,
      (A[0] + (B[0] - A[0]) * t) * (1 - sag * 0.3),
      A[1] + (B[1] - A[1]) * t + sag * 0.28,
      (A[2] + (B[2] - A[2]) * t) * (1 - sag * 0.3),
    );
  }

  // spokes into the broker
  for (let k = 0; k < nSpokes; k++, i++) {
    const A = hubs[Math.floor(rng() * HUBS)];
    const t = Math.pow(rng(), 0.8);
    write(
      out,
      i,
      A[0] * (1 - t) + jitter(rng, 0.02),
      A[1] * (1 - t) + jitter(rng, 0.02),
      A[2] * (1 - t) + jitter(rng, 0.02),
    );
  }

  for (let k = 0; k < nCore; k++, i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = 0.28 * Math.cbrt(rng());
    write(
      out,
      i,
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    );
  }
}

/* ── dna ─────────────────────────────────────────────────────────────────── */
/**
 * Double helix: two sugar-phosphate backbones a half-turn apart, with base
 * pairs rungs between them. Vertical, because that is the silhouette everyone
 * recognises instantly.
 */
function dna(out: Float32Array, count: number, rng: Rng) {
  const [nBackbone, nRungs, nAmbient] = budget(count, [44, 46, 10]);
  let i = 0;

  const R = 0.72;
  const TURNS = 3.6;
  const H = 5.0; // total height, centred on origin

  const strand = (t: number, offset: number): [number, number, number] => {
    const a = t * TURNS * Math.PI * 2 + offset;
    return [Math.cos(a) * R, t * H - H / 2, Math.sin(a) * R];
  };

  for (let k = 0; k < nBackbone; k++, i++) {
    const t = rng();
    const [x, y, z] = strand(t, k % 2 === 0 ? 0 : Math.PI);
    write(
      out,
      i,
      x + jitter(rng, 0.022),
      y + jitter(rng, 0.022),
      z + jitter(rng, 0.022),
    );
  }

  // base pairs, evenly spaced up the axis so the ladder reads
  const RUNGS = 30;
  const perRung = Math.floor(nRungs / RUNGS);
  let placed = 0;
  for (let r = 0; r < RUNGS && placed < nRungs; r++) {
    const t = (r + 0.5) / RUNGS;
    const A = strand(t, 0);
    const B = strand(t, Math.PI);
    const n = r === RUNGS - 1 ? nRungs - placed : perRung;
    for (let k = 0; k < n && placed < nRungs; k++, i++, placed++) {
      // gap at the centre so the two bases read as a pair, not one bar
      let u = k / Math.max(1, n - 1);
      u = u < 0.5 ? u * 0.86 : 0.14 + u * 0.86;
      write(
        out,
        i,
        A[0] + (B[0] - A[0]) * u,
        A[1] + (B[1] - A[1]) * u + jitter(rng, 0.012),
        A[2] + (B[2] - A[2]) * u,
      );
    }
  }
  for (; placed < nRungs; i++, placed++) {
    const [x, y, z] = strand(rng(), rng() < 0.5 ? 0 : Math.PI);
    write(out, i, x, y, z);
  }

  // sparse halo so the helix does not read as a hard cutout
  for (let k = 0; k < nAmbient; k++, i++) {
    const a = rng() * Math.PI * 2;
    const rr = R * (1.35 + rng() * 1.5);
    write(out, i, Math.cos(a) * rr, (rng() - 0.5) * H * 1.1, Math.sin(a) * rr);
  }
}

/* ── handset ─────────────────────────────────────────────────────────────── */
/**
 * The Expedia story as one picture: a column of backend services fanning into a
 * gateway, the gateway feeding a phone, and locale arcs radiating off the
 * device. Deliberately not just a phone — the service graph is the part that
 * belongs on a backend engineer's site.
 */
function handset(out: Float32Array, count: number, rng: Rng) {
  const [nFrame, nRows, nSvc, nGate, nEdges, nLocale] = budget(
    count,
    [20, 18, 11, 4, 32, 15],
  );
  let i = 0;

  const PX = 1.55; // phone centre x
  const HW = 0.78; // half width
  const HH = 1.62; // half height
  const CR = 0.26; // corner radius
  const GATE: [number, number, number] = [-0.55, 0, 0];

  /** Point at parameter t around a rounded-rectangle perimeter. */
  const framePoint = (t: number): [number, number] => {
    const straightW = 2 * (HW - CR);
    const straightH = 2 * (HH - CR);
    const arc = (Math.PI / 2) * CR;
    const total = 2 * straightW + 2 * straightH + 4 * arc;
    let d = t * total;

    if (d < straightW) return [PX - HW + CR + d, HH];
    d -= straightW;
    if (d < arc) {
      const a = d / CR;
      return [PX + HW - CR + Math.sin(a) * CR, HH - CR + Math.cos(a) * CR];
    }
    d -= arc;
    if (d < straightH) return [PX + HW, HH - CR - d];
    d -= straightH;
    if (d < arc) {
      const a = d / CR;
      return [PX + HW - CR + Math.cos(a) * CR, -HH + CR - Math.sin(a) * CR];
    }
    d -= arc;
    if (d < straightW) return [PX + HW - CR - d, -HH];
    d -= straightW;
    if (d < arc) {
      const a = d / CR;
      return [PX - HW + CR - Math.sin(a) * CR, -HH + CR - Math.cos(a) * CR];
    }
    d -= arc;
    if (d < straightH) return [PX - HW, -HH + CR + d];
    d -= straightH;
    const a = d / CR;
    return [PX - HW + CR - Math.cos(a) * CR, HH - CR + Math.sin(a) * CR];
  };

  for (let k = 0; k < nFrame; k++, i++) {
    const [x, y] = framePoint(k / nFrame);
    write(out, i, x, y, jitter(rng, 0.03));
  }

  // search result rows on the screen
  const ROWS = 5;
  for (let k = 0; k < nRows; k++, i++) {
    const row = k % ROWS;
    const y = 1.0 - row * 0.52;
    const w = row === 0 ? 0.52 : 0.58;
    write(
      out,
      i,
      PX + (rng() - 0.5) * 2 * w,
      y + (rng() - 0.5) * 0.16,
      jitter(rng, 0.02),
    );
  }

  // backend services
  const SVC = 6;
  const svcNodes: [number, number, number][] = [];
  for (let s = 0; s < SVC; s++) {
    svcNodes.push([-2.5, ((s - (SVC - 1) / 2) * 2.6) / SVC, 0]);
  }
  for (let k = 0; k < nSvc; k++, i++) {
    const [x, y, z] = svcNodes[k % SVC];
    write(
      out,
      i,
      x + jitter(rng, 0.07),
      y + jitter(rng, 0.07),
      z + jitter(rng, 0.07),
    );
  }

  // gateway
  for (let k = 0; k < nGate; k++, i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = 0.2 * Math.cbrt(rng());
    write(
      out,
      i,
      GATE[0] + r * Math.sin(phi) * Math.cos(theta),
      GATE[1] + r * Math.cos(phi),
      GATE[2] + r * Math.sin(phi) * Math.sin(theta),
    );
  }

  // services → gateway → device
  for (let k = 0; k < nEdges; k++, i++) {
    const t = rng();
    if (k % 5 < 3) {
      const A = svcNodes[Math.floor(rng() * SVC)];
      write(
        out,
        i,
        A[0] + (GATE[0] - A[0]) * t,
        A[1] + (GATE[1] - A[1]) * t + jitter(rng, 0.015),
        jitter(rng, 0.02),
      );
    } else {
      const ey = (rng() - 0.5) * 1.4;
      write(
        out,
        i,
        GATE[0] + (PX - HW - GATE[0]) * t,
        GATE[1] + (ey - GATE[1]) * t + jitter(rng, 0.015),
        jitter(rng, 0.02),
      );
    }
  }

  // locale arcs radiating off the device
  const LOCALES = 16;
  for (let k = 0; k < nLocale; k++, i++) {
    const l = k % LOCALES;
    const a = -Math.PI / 2 + (l / (LOCALES - 1)) * Math.PI;
    const t = Math.pow(rng(), 0.7);
    const reach = 1.25;
    write(
      out,
      i,
      PX + HW + Math.cos(a) * reach * t,
      Math.sin(a) * (HH + 0.35) * t,
      Math.sin(t * Math.PI) * 0.4,
    );
  }
}

/* ── brain ───────────────────────────────────────────────────────────────── */
/**
 * Cerebrum with gyri, a sagittal fissure, cerebellum and brainstem, plus an
 * interior web of neurons and axon filaments for the firing animation to run
 * along. The folds are what make it read as a brain rather than a lumpy egg, so
 * they are two octaves of sine displacement rather than one.
 */
function brain(out: Float32Array, count: number, rng: Rng) {
  const [nCortex, nCereb, nStem, nNeurons, nAxons] = budget(
    count,
    [56, 13, 4, 8, 19],
  );
  let i = 0;

  // half-axes: wider than tall, longest front-to-back
  const RX = 1.3;
  const RY = 1.06;
  const RZ = 1.62;

  /** Unit direction → folded cortical surface point. */
  const cortexPoint = (
    sx: number,
    sy: number,
    sz: number,
  ): [number, number, number] => {
    // two octaves of folding = gyri and sulci
    const fold =
      Math.sin(sx * 8.5) * Math.sin(sy * 7.0) * Math.sin(sz * 8.0) * 0.085 +
      Math.sin(sx * 15.0 + sz * 12.0) * Math.cos(sy * 13.0) * 0.032;
    const r = 1 + fold;

    // frontal lobe tapers, occipital stays full
    const taper = 1 - 0.15 * Math.max(0, sz);
    // underside is flatter than the crown
    const flat = sy < 0 ? 0.8 : 1;

    return [sx * RX * r * taper, sy * RY * r * flat, sz * RZ * r];
  };

  for (let k = 0; k < nCortex; k++, i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    let sx = Math.sin(phi) * Math.cos(theta);
    const sy = Math.cos(phi);
    const sz = Math.sin(phi) * Math.sin(theta);

    // push each point off the midline so the longitudinal fissure reads as a gap
    const side = sx >= 0 ? 1 : -1;
    sx = sx + side * 0.075;

    const [x, y, z] = cortexPoint(sx, sy, sz);
    write(
      out,
      i,
      x + jitter(rng, 0.012),
      y + jitter(rng, 0.012),
      z + jitter(rng, 0.012),
    );
  }

  // cerebellum: tighter, higher-frequency folding, tucked back and below
  for (let k = 0; k < nCereb; k++, i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const sx = Math.sin(phi) * Math.cos(theta);
    const sy = Math.cos(phi);
    const sz = Math.sin(phi) * Math.sin(theta);
    const ridge = 1 + Math.sin(sy * 26.0) * 0.05;
    write(
      out,
      i,
      sx * 0.66 * ridge,
      -0.74 + sy * 0.36 * ridge,
      -1.02 + sz * 0.5 * ridge,
    );
  }

  // brainstem
  for (let k = 0; k < nStem; k++, i++) {
    const t = rng();
    const a = rng() * Math.PI * 2;
    const r = (0.19 - t * 0.06) * Math.sqrt(rng());
    write(
      out,
      i,
      Math.cos(a) * r,
      -0.7 - t * 0.95,
      -0.5 + Math.cos(a) * 0.04 + t * 0.16 + Math.sin(a) * r * 0.4,
    );
  }

  // interior neuron somas, then axons strung between them
  const NEURONS = 48;
  const somas: [number, number, number][] = [];
  for (let n = 0; n < NEURONS; n++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const d = 0.32 + rng() * 0.44;
    somas.push([
      Math.sin(phi) * Math.cos(theta) * RX * d,
      Math.cos(phi) * RY * d,
      Math.sin(phi) * Math.sin(theta) * RZ * d,
    ]);
  }

  for (let k = 0; k < nNeurons; k++, i++) {
    const [x, y, z] = somas[k % NEURONS];
    write(
      out,
      i,
      x + jitter(rng, 0.045),
      y + jitter(rng, 0.045),
      z + jitter(rng, 0.045),
    );
  }

  for (let k = 0; k < nAxons; k++, i++) {
    const A = somas[Math.floor(rng() * NEURONS)];
    const B = somas[Math.floor(rng() * NEURONS)];
    const t = rng();
    const sag = Math.sin(t * Math.PI) * 0.14;
    write(
      out,
      i,
      A[0] + (B[0] - A[0]) * t + jitter(rng, 0.02),
      A[1] + (B[1] - A[1]) * t + sag,
      A[2] + (B[2] - A[2]) * t + jitter(rng, 0.02),
    );
  }
}

/* ── globe ───────────────────────────────────────────────────────────────── */
/** Airport graph: Fibonacci-distributed surface nodes plus great-circle arcs. */
function globe(out: Float32Array, count: number, rng: Rng) {
  const R = 2.35;
  const [nSurface, nArcs] = budget(count, [58, 42]);
  let i = 0;

  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < nSurface; k++, i++) {
    const y = 1 - (k / (nSurface - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN * k;
    write(
      out,
      i,
      Math.cos(theta) * radius * R,
      y * R,
      Math.sin(theta) * radius * R,
    );
  }

  const surfacePoint = (): [number, number, number] => {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    return [
      R * Math.sin(phi) * Math.cos(theta),
      R * Math.cos(phi),
      R * Math.sin(phi) * Math.sin(theta),
    ];
  };

  // arcs: slerp along the sphere, lifted by a sine bulge
  const ARCS = 90;
  const perArc = Math.floor(nArcs / ARCS);
  let placed = 0;
  for (let a = 0; a < ARCS && placed < nArcs; a++) {
    const A = surfacePoint();
    const B = surfacePoint();
    const dot = Math.min(
      1,
      Math.max(-1, (A[0] * B[0] + A[1] * B[1] + A[2] * B[2]) / (R * R)),
    );
    const omega = Math.acos(dot);
    const sinOmega = Math.sin(omega) || 1e-6;
    const n = a === ARCS - 1 ? nArcs - placed : perArc;
    for (let k = 0; k < n && placed < nArcs; k++, i++, placed++) {
      const t = k / Math.max(1, n - 1);
      const s1 = Math.sin((1 - t) * omega) / sinOmega;
      const s2 = Math.sin(t * omega) / sinOmega;
      const lift = 1 + Math.sin(t * Math.PI) * 0.22;
      write(
        out,
        i,
        (A[0] * s1 + B[0] * s2) * lift,
        (A[1] * s1 + B[1] * s2) * lift,
        (A[2] * s1 + B[2] * s2) * lift,
      );
    }
  }
  for (; placed < nArcs; i++, placed++) {
    const [x, y, z] = surfacePoint();
    write(out, i, x, y, z);
  }
}

/* ── tree ────────────────────────────────────────────────────────────────── */
/**
 * A chess search tree: the position at the root, three candidate moves, nine
 * replies — and then everything except one line is pruned and the principal
 * variation carries on alone.
 *
 * That is what selective search actually looks like, and it is the closing
 * stage's sentence made visible: search wide, then commit to one line. The
 * surviving line gets a disproportionate share of the point budget, so under
 * additive blending it reads as the brightest thing on screen.
 */
function tree(out: Float32Array, count: number, rng: Rng) {
  type Node = [number, number, number];

  const H = 1.12; // vertical gap per ply
  const BASE = -2.55;

  const root: Node = [0, BASE, 0];

  const ply1: Node[] = [];
  for (let i = 0; i < 3; i++) {
    ply1.push([(i - 1) * 1.62, BASE + H, Math.sin(i * 2.1) * 0.3]);
  }

  const ply2: Node[] = [];
  for (const parent of ply1) {
    for (let c = 0; c < 3; c++) {
      ply2.push([
        parent[0] + (c - 1) * 0.6,
        BASE + 2 * H,
        parent[2] + (c - 1) * 0.24,
      ]);
    }
  }

  // the one line that survives the cut, climbing away from the pruned width
  const pv: Node[] = [ply2[4]];
  for (let k = 1; k <= 3; k++) {
    const prev = pv[k - 1];
    pv.push([prev[0] + 0.44, prev[1] + H, prev[2] - 0.2]);
  }

  const edges: [Node, Node][] = [];
  for (const n of ply1) edges.push([root, n]);
  ply1.forEach((parent, p) => {
    for (let c = 0; c < 3; c++) edges.push([parent, ply2[p * 3 + c]]);
  });

  const pvEdges: [Node, Node][] = [];
  for (let k = 1; k < pv.length; k++) pvEdges.push([pv[k - 1], pv[k]]);

  const searched = [root, ...ply1, ...ply2];
  const [nNodes, nEdges, nPvNodes, nPvEdges] = budget(count, [24, 30, 17, 29]);
  let i = 0;

  const ball = (n: Node, radius: number) => {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = radius * Math.cbrt(rng());
    return [
      n[0] + r * Math.sin(phi) * Math.cos(theta),
      n[1] + r * Math.cos(phi),
      n[2] + r * Math.sin(phi) * Math.sin(theta),
    ] as Node;
  };

  for (let k = 0; k < nNodes; k++, i++) {
    const [x, y, z] = ball(searched[k % searched.length], 0.115);
    write(out, i, x, y, z);
  }

  for (let k = 0; k < nEdges; k++, i++) {
    const [A, B] = edges[k % edges.length];
    const t = rng();
    write(
      out,
      i,
      A[0] + (B[0] - A[0]) * t + jitter(rng, 0.012),
      A[1] + (B[1] - A[1]) * t,
      A[2] + (B[2] - A[2]) * t + jitter(rng, 0.012),
    );
  }

  // pv[0] already belongs to ply2, so only the new nodes get the dense treatment
  const pvNodes = pv.slice(1);
  for (let k = 0; k < nPvNodes; k++, i++) {
    const [x, y, z] = ball(pvNodes[k % pvNodes.length], 0.15);
    write(out, i, x, y, z);
  }

  for (let k = 0; k < nPvEdges; k++, i++) {
    const [A, B] = pvEdges[k % pvEdges.length];
    const t = rng();
    write(
      out,
      i,
      A[0] + (B[0] - A[0]) * t + jitter(rng, 0.01),
      A[1] + (B[1] - A[1]) * t,
      A[2] + (B[2] - A[2]) * t + jitter(rng, 0.01),
    );
  }
}

const BUILDERS: Record<ShapeKey, (o: Float32Array, c: number, r: Rng) => void> =
  {
    scatter,
    rocket,
    handset,
    brain,
    dna,
    tree,
    network,
    mesh,
    globe,
  };

const SEEDS: Record<ShapeKey, number> = {
  scatter: 1,
  rocket: 2,
  brain: 6,
  dna: 7,
  handset: 8,
  tree: 9,
  network: 3,
  mesh: 4,
  globe: 5,
};

export function buildShape(key: ShapeKey, count: number): Float32Array {
  const out = new Float32Array(count * 3);
  BUILDERS[key](out, count, mulberry32(SEEDS[key] * 7919));
  return out;
}

/** Deterministic per-point seeds shared by the point-field materials. */
export function seedArray(count: number): Float32Array {
  const out = new Float32Array(count);
  let a = 0x9e3779b9;
  for (let i = 0; i < count; i++) {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    out[i] = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return out;
}

export function buildAllShapes(count: number): Float32Array[] {
  return SHAPE_ORDER.map((k) => buildShape(k, count));
}
