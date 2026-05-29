// Spectroscopic and structural constants for helium hydride (HeH⁺).
//
// HeH⁺ has only TWO electrons (He contributes 2, H contributes 1, the cation
// removes 1). That makes full configuration interaction (FCI) exact within the
// basis and identical to CCSD for this system — there are no triple excitations,
// so a perturbative (T) correction is identically zero. The rigour of the
// standalone viewer therefore comes from basis-set quality + calibration to the
// non-Born–Oppenheimer literature, not from the correlation method.
//
// References
//   - Bishop & Cheung (1979)  J. Mol. Spectrosc. 75, 462.  ωe, Be, anharmonicity
//   - Stanke et al.    (2006)  Phys. Rev. A 73, 012503.    re, De (non-BO)
//   - Pachucki         (2012)  Phys. Rev. A 85, 042511.    re to spectroscopic accuracy
//   - Engel et al.     (2005)  Mol. Phys. 103, 1085.       dipole-moment function
//   - Güsten et al.    (2019)  Nature 568, 357.            NGC 7027 detection (SOFIA/GREAT)

// ---- Structural ----------------------------------------------------------
export const BOND_LENGTH_ANGSTROM = 0.7743; // equilibrium re
export const DISSOCIATION_ENERGY_EV = 2.04; // De (well depth, excludes ZPE)

// Dipole moment is ORIGIN-DEPENDENT for a charged ion. We quote the value about
// the centre of mass, which is the convention used for spectroscopic intensities.
export const DIPOLE_MOMENT_DEBYE = 1.66; // μe about centre of mass (Engel 2005)

// ---- Vibrational / rotational (cm⁻¹) ------------------------------------
export const HARMONIC_FREQUENCY_CM = 3228.3; // ωe
export const ANHARMONICITY_CM = 174.1; // ωe·xe
export const ROT_CONSTANT_CM = 33.56; // Be

// ---- Electron-density partition (approximate) ---------------------------
// HeH⁺ has 2 electrons total. They polarise toward He (higher effective nuclear
// charge / ionisation energy), so the proton end is electron-poor (δ+) and He is
// the electron-rich (δ−) end. A natural-orbital / Mulliken analysis puts roughly
// 1.7 e⁻ on He and 0.3 e⁻ on H near equilibrium. Used to skew the preview cloud.
export const TOTAL_ELECTRONS = 2;
export const ELECTRONS_ON_HE = 1.7;
export const ELECTRONS_ON_H = 0.3;

// ---- Isotopologues -------------------------------------------------------
// Atomic masses (amu) from AME2020. Reduced mass μ = (mA·mB)/(mA+mB) sets the
// vibrational scaling: ZPE ≈ ωe/2 ∝ √(k/μ), so heavier isotopes have a lower
// zero-point energy and a more localised ground-state wavefunction.
const M_HE4 = 4.002602;
const M_HE3 = 3.016029;
const M_H = 1.007825;
const M_D = 2.014102;
const M_T = 3.016049;

const reduced = (a: number, b: number) => (a * b) / (a + b);

export type Isotopologue = {
  id: string;
  label: string;
  reducedMass: number; // amu
  zpeRatio: number; // ZPE relative to ⁴HeH⁺ (= 1), ∝ √(μ_ref / μ)
};

const MU_REF = reduced(M_HE4, M_H);

export const ISOTOPOLOGUES: Isotopologue[] = [
  { id: "4HeH", label: "⁴HeH⁺", reducedMass: MU_REF, zpeRatio: 1 },
  {
    id: "4HeD",
    label: "⁴HeD⁺",
    reducedMass: reduced(M_HE4, M_D),
    zpeRatio: Math.sqrt(MU_REF / reduced(M_HE4, M_D)),
  },
  {
    id: "4HeT",
    label: "⁴HeT⁺",
    reducedMass: reduced(M_HE4, M_T),
    zpeRatio: Math.sqrt(MU_REF / reduced(M_HE4, M_T)),
  },
  {
    id: "3HeH",
    label: "³HeH⁺",
    reducedMass: reduced(M_HE3, M_H),
    zpeRatio: Math.sqrt(MU_REF / reduced(M_HE3, M_H)),
  },
];

// ---- Cosmic origin -------------------------------------------------------
export const NGC_7027_DETECTION_YEAR = 2019;

// ---- Deployed standalone viewer URL --------------------------------------
// The full ray-marched density / dissociation / vibrational experience lives in
// a separate repository. Set NEXT_PUBLIC_HEH_VIZ_URL at build time once deployed;
// until then the page shows a "coming soon" affordance instead of a dead link.
export const FULL_VIZ_URL = process.env.NEXT_PUBLIC_HEH_VIZ_URL ?? "";
