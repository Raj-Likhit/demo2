/**
 * student-peeps.ts
 * Procedurally draws upper-body "college student" sprites in an Open-Peeps-like
 * ink style (black outlines, flat fills, slightly wobbly hand-drawn lines).
 *
 * Every sprite faces RIGHT. The crowd flips it with scaleX = -1 for students
 * walking the other way. The bottom edge is deliberately drawn off-canvas so
 * the figure looks cropped at the waist.
 */

export const PEEP_W = 200;
export const PEEP_H = 320;

type Pt = [number, number];
type Rng = () => number;

const INK = "#141414";
const LW = 3.2;

// ---------------------------------------------------------------------------
// PALETTES
// ---------------------------------------------------------------------------
const SKINS = ["#ffffff", "#f0f0f0", "#d9d9d9", "#b4b4b4", "#8e8e8e"];
const HAIRS = ["#141414", "#141414", "#2a2a2a", "#4a4a4a", "#8a8a8a", "#d4d4d4", "#ffffff"];
const CLOTHES = [
  "#ffffff",
  "#ececec",
  "#d2d2d2",
  "#a9a9a9",
  "#7c7c7c",
  "#4a4a4a",
  "#1c1c1c",
  "#ffffff",
  "#c0c0c0",
];
const DENIM = ["#bcbcbc", "#9c9c9c", "#d6d6d6"];
const CREAM = "#ffffff";

// ---------------------------------------------------------------------------
// SMALL HELPERS
// ---------------------------------------------------------------------------
const mulberry32 = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T,>(rng: Rng, arr: T[]): T => arr[(rng() * arr.length) | 0];
const chance = (rng: Rng, p: number) => rng() < p;

/** Darken or lighten a #rrggbb colour. amt in -1..1 */
const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) =>
    Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

/** Smooth Catmull-Rom spline through points, added to the current path. */
const spline = (
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  closed: boolean,
  begin = true,
) => {
  const n = pts.length;
  const get = (i: number): Pt =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  if (begin) ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
      p2[0],
      p2[1],
    );
  }
  if (closed) ctx.closePath();
};

/** Straight-edged polygon added to the current path. */
const polyPath = (ctx: CanvasRenderingContext2D, pts: Pt[], begin = true) => {
  if (begin) ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
};

// ---------------------------------------------------------------------------
// DRAWING KIT (wraps ctx + rng so shapes get a touch of hand-drawn wobble)
// ---------------------------------------------------------------------------
type Kit = ReturnType<typeof makeKit>;

const makeKit = (ctx: CanvasRenderingContext2D, rng: Rng) => {
  const jitter = (pts: Pt[], amt: number): Pt[] =>
    pts.map(([x, y]) => [x + (rng() - 0.5) * 2 * amt, y + (rng() - 0.5) * 2 * amt]);

  /** Smooth, filled + outlined blob */
  const blob = (pts: Pt[], fill: string | null, wobble = 1.1, closed = true) => {
    const p = jitter(pts, wobble);
    spline(ctx, p, closed);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.stroke();
    return p;
  };

  /** Straight-edged, filled + outlined polygon */
  const poly = (pts: Pt[], fill: string | null, wobble = 0.8) => {
    const p = jitter(pts, wobble);
    polyPath(ctx, p);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.stroke();
    return p;
  };

  const line = (pts: Pt[], lw = LW, color = INK, smooth = true) => {
    ctx.save();
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    if (smooth && pts.length > 2) spline(ctx, pts, false);
    else {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
    ctx.restore();
  };

  const ellipse = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    fill: string | null,
    stroke = true,
    rot = 0,
  ) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) ctx.stroke();
  };

  /** Union of circles with one clean outline (stroke wide first, fill on top). */
  const circleUnion = (circles: [number, number, number][], fill: string) => {
    ctx.save();
    ctx.strokeStyle = INK;
    ctx.lineWidth = LW * 2;
    circles.forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.fillStyle = fill;
    circles.forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r + 0.6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  return { blob, poly, line, ellipse, circleUnion, jitter };
};

// ---------------------------------------------------------------------------
// GEOMETRY (all sprites share the same skeleton, facing right)
// ---------------------------------------------------------------------------
const FACE: Pt[] = [
  [98, 32],
  [126, 40],
  [142, 66],
  [145, 98],
  [138, 126],
  [120, 146],
  [96, 152],
  [74, 140],
  [62, 114],
  [60, 80],
  [70, 50],
];

const TORSO: Pt[] = [
  [84, 168],
  [116, 168],
  [150, 182],
  [172, 214],
  [178, 340],
  [22, 340],
  [28, 214],
  [50, 182],
];

const ARM_L: Pt[] = [
  [52, 186],
  [30, 214],
  [24, 270],
  [22, 340],
  [58, 340],
  [62, 268],
  [66, 218],
];

const ARM_R: Pt[] = [
  [148, 186],
  [170, 214],
  [176, 270],
  [178, 340],
  [142, 340],
  [138, 268],
  [134, 218],
];

// ---------------------------------------------------------------------------
// STUDENT DEFINITION
// ---------------------------------------------------------------------------
type Outfit = "tee" | "hoodie" | "varsity" | "cardigan" | "stripes" | "denim" | "polo";
const OUTFITS: Outfit[] = ["tee", "hoodie", "varsity", "cardigan", "stripes", "denim", "polo"];
const HAIR_COUNT = 10;

interface Student {
  skin: string;
  hair: string;
  hairStyle: number;
  outfit: Outfit;
  c1: string;
  c2: string;
  c3: string;
  eyes: number;
  mouth: number;
  glasses: 0 | 1 | 2; // none / round / square
  blush: boolean;
  freckles: boolean;
  headphones: boolean;
  backpack: boolean;
  tote: boolean;
  lanyard: boolean;
  prop: "none" | "cup" | "books";
  letter: string;
}

const makeStudent = (index: number, rng: Rng): Student => {
  const hairStyle = index % HAIR_COUNT;
  const outfit = OUTFITS[(index * 3 + ((index / HAIR_COUNT) | 0)) % OUTFITS.length];
  const c1 = pick(rng, CLOTHES);
  let c2 = pick(rng, CLOTHES);
  while (c2 === c1) c2 = pick(rng, CLOTHES);
  let c3 = pick(rng, CLOTHES);
  while (c3 === c1 || c3 === c2) c3 = pick(rng, CLOTHES);

  const hat = hairStyle === 4 || hairStyle === 5;
  const backpack = chance(rng, 0.55);

  return {
    skin: pick(rng, SKINS),
    hair: pick(rng, HAIRS),
    hairStyle,
    outfit,
    c1,
    c2,
    c3,
    eyes: (rng() * 3) | 0,
    mouth: (rng() * 4) | 0,
    glasses: chance(rng, 0.32) ? (chance(rng, 0.5) ? 1 : 2) : 0,
    blush: chance(rng, 0.4),
    freckles: chance(rng, 0.18),
    headphones: !hat && chance(rng, 0.22),
    backpack,
    tote: !backpack && chance(rng, 0.35),
    lanyard: chance(rng, 0.35),
    prop: chance(rng, 0.3) ? (chance(rng, 0.55) ? "cup" : "books") : "none",
    letter: pick(rng, ["A", "B", "C", "S", "U", "W", "M"]),
  };
};

// ---------------------------------------------------------------------------
// HAIR
// ---------------------------------------------------------------------------
/** Hair that sits BEHIND the head */
const drawHairBack = (k: Kit, s: Student) => {
  const { hair } = s;
  switch (s.hairStyle) {
    case 1: {
      // afro
      const c: [number, number, number][] = [];
      for (let a = 0; a < 12; a++) {
        const ang = Math.PI * (0.55 + (a / 11) * 1.9);
        c.push([100 + Math.cos(ang) * 46, 76 + Math.sin(ang) * 46, 26]);
      }
      c.push([100, 74, 40]);
      k.circleUnion(c, hair);
      break;
    }
    case 2: // long straight
      k.blob(
        [
          [66, 40],
          [100, 20],
          [134, 34],
          [143, 80],
          [132, 140],
          [150, 198],
          [118, 236],
          [60, 236],
          [38, 196],
          [56, 140],
          [56, 80],
        ],
        hair,
      );
      break;
    case 3: // bun
      k.blob(
        [
          [64, 20],
          [84, 4],
          [106, 10],
          [110, 30],
          [92, 44],
          [70, 40],
        ],
        hair,
      );
      break;
    case 7: // ponytail
      k.blob(
        [
          [64, 66],
          [44, 80],
          [24, 124],
          [20, 176],
          [40, 160],
          [52, 128],
          [62, 100],
        ],
        hair,
      );
      break;
    case 8: // bob
      k.blob(
        [
          [58, 84],
          [60,44],
          [90, 22],
          [128, 28],
          [148, 56],
          [146, 84],
          [104, 100],
          [74, 146],
          [54, 138],
          [48, 100],
        ],
        hair,
      );
      break;
    case 9: {
      // short curls
      const c: [number, number, number][] = [];
      for (let a = 0; a < 9; a++) {
        const ang = Math.PI * (0.8 + (a / 8) * 1.4);
        c.push([100 + Math.cos(ang) * 40, 78 + Math.sin(ang) * 42, 18]);
      }
      k.circleUnion(c, hair);
      break;
    }
    default:
      break;
  }
};

/** Hair / hats that sit ON TOP of the face */
const drawHairFront = (k: Kit, s: Student, rng: Rng) => {
  const { hair } = s;
  switch (s.hairStyle) {
    case 0: // short side-swept fringe
      k.blob(
        [
          [58, 100],
          [54, 62],
          [70, 34],
          [100, 22],
          [134, 32],
          [148, 58],
          [146, 80],
          [132, 66],
          [112, 58],
          [96, 70],
          [84, 86],
          [74, 102],
        ],
        hair,
      );
      break;
    case 1: {
      // afro hairline scallops
      const c: [number, number, number][] = [];
      [78, 98, 118, 136].forEach((x, i) => c.push([x, 46 - (i === 3 ? -2 : 0), 17]));
      c.push([66, 74, 16], [64, 96, 12]);
      k.circleUnion(c, hair);
      break;
    }
    case 2: // long hair: centre-ish part and bangs swept right
      k.blob(
        [
          [58, 112],
          [54, 62],
          [70, 32],
          [100, 20],
          [134, 30],
          [148, 58],
          [146, 82],
          [126, 62],
          [108, 56],
          [92, 78],
          [76, 108],
        ],
        hair,
      );
      break;
    case 3: // bun: slicked back
      k.blob(
        [
          [58, 100],
          [56, 62],
          [72, 36],
          [100, 26],
          [130, 34],
          [146, 56],
          [138, 66],
          [116, 54],
          [92, 62],
          [78, 84],
          [74, 102],
        ],
        hair,
      );
      // hair tie
      k.ellipse(88, 38, 6, 4, s.c3, true, -0.5);
      break;
    case 4: {
      // beanie (with fold)
      const body = s.c2;
      k.blob(
        [
          [54, 90],
          [54, 56],
          [70, 28],
          [100, 16],
          [132, 26],
          [148, 52],
          [150, 84],
          [100, 80],
        ],
        body,
      );
      k.blob(
        [
          [52, 94],
          [50, 66],
          [100, 62],
          [152, 68],
          [152, 92],
          [100, 88],
        ],
        shade(body, 0.18),
        0.8,
      );
      [72, 88, 104, 120, 136].forEach((x) => k.line([[x, 68], [x, 88]], 2, shade(body, -0.35), false));
      // pom-pom
      k.ellipse(100, 12, 13, 12, s.c3);
      // a bit of hair poking out at the back
      k.blob(
        [
          [54, 92],
          [48, 112],
          [58, 122],
          [64, 100],
        ],
        hair,
      );
      break;
    }
    case 5: {
      // baseball cap, brim pointing right
      const body = s.c2;
      k.blob(
        [
          [56, 82],
          [58, 52],
          [78, 32],
          [108, 24],
          [134, 36],
          [146, 62],
          [146, 80],
          [100, 74],
        ],
        body,
      );
      k.blob(
        [
          [130, 68],
          [150, 66],
          [176, 74],
          [172, 84],
          [146, 84],
          [128, 80],
        ],
        shade(body, -0.18),
        0.8,
      );
      k.ellipse(102, 26, 5, 4, shade(body, -0.25));
      // hair tufts at the back
      k.blob(
        [
          [56, 82],
          [46, 104],
          [54, 126],
          [66, 108],
          [68, 86],
        ],
        hair,
      );
      break;
    }
    case 6: // buzz cut
      k.blob(
        [
          [60, 98],
          [56, 62],
          [70, 38],
          [100, 28],
          [132, 36],
          [146, 60],
          [144, 74],
          [128, 62],
          [100, 56],
          [78, 66],
          [68, 90],
        ],
        shade(hair, 0.0),
        0.8,
      );
      break;
    case 7: // ponytail: pulled-back fringe
      k.blob(
        [
          [58, 100],
          [54, 62],
          [70, 34],
          [100, 22],
          [134, 32],
          [148, 58],
          [140, 70],
          [118, 56],
          [96, 62],
          [80, 84],
          [74, 102],
        ],
        hair,
      );
      k.ellipse(60, 74, 6, 8, s.c3, true, 0.4);
      break;
    case 8: // bob: bangs
      k.blob(
        [
          [58, 104],
          [54, 62],
          [70, 34],
          [100, 22],
          [134, 32],
          [148, 58],
          [146, 80],
          [118, 66],
          [96, 72],
          [80, 90],
          [74, 108],
        ],
        hair,
      );
      break;
    case 9: {
      // curls hairline
      const c: [number, number, number][] = [];
      for (let a = 0; a < 6; a++) c.push([72 + a * 13, 44 + Math.abs(2 - a) * 2, 15]);
      k.circleUnion(c, hair);
      break;
    }
    default:
      break;
  }
  void rng;
};

// ---------------------------------------------------------------------------
// CLOTHES
// ---------------------------------------------------------------------------
const drawNeck = (k: Kit, ctx: CanvasRenderingContext2D, s: Student, vNeck: boolean) => {
  const skinShade = shade(s.skin, -0.08);
  ctx.save();
  const pts: Pt[] = vNeck
    ? [
        [82, 130],
        [118, 130],
        [120, 170],
        [100, 206],
        [80, 170],
      ]
    : [
        [82, 130],
        [118, 130],
        [120, 172],
        [100, 192],
        [80, 172],
      ];
  k.blob(pts, skinShade, 0.6);
  ctx.restore();
};

const drawStudentBody = (
  ctx: CanvasRenderingContext2D,
  k: Kit,
  s: Student,
  rng: Rng,
) => {
  const { outfit, c1, c2, c3 } = s;

  // body colours
  let torsoColor = c1;
  let sleeveColor = c1;
  if (outfit === "varsity") sleeveColor = CREAM;
  if (outfit === "denim") {
    torsoColor = pick(rng, DENIM);
    sleeveColor = torsoColor;
  }
  if (outfit === "polo") {
    torsoColor = c1;
    sleeveColor = c1;
  }

  // --- things behind the torso ---
  if (outfit === "hoodie") {
    k.blob(
      [
        [56, 184],
        [62, 150],
        [100, 138],
        [138, 150],
        [144, 184],
        [100, 200],
      ],
      shade(c1, -0.12),
    );
  }

  if (s.backpack) {
    const packColor = pick(rng, [c2, c3, "#3a3a3a", "#1c1c1c", "#8a8a8a"]);
    k.blob(
      [
        [8, 232],
        [14, 198],
        [38, 176],
        [68, 182],
        [72, 340],
        [2, 340],
      ],
      packColor,
    );
    k.line(
      [
        [14, 262],
        [30, 276],
        [52, 270],
      ],
      2.4,
      INK,
    );
    k.ellipse(34, 214, 5, 5, shade(packColor, 0.35), true);
  }

  // --- torso + arms ---
  k.blob(TORSO, torsoColor, 1.0);
  k.blob(ARM_L, sleeveColor, 0.8);
  k.blob(ARM_R, sleeveColor, 0.8);

  // --- outfit details clipped to the body ---
  ctx.save();
  ctx.beginPath();
  spline(ctx, TORSO, true, false);
  spline(ctx, ARM_L, true, false);
  spline(ctx, ARM_R, true, false);
  ctx.clip();

  switch (outfit) {
    case "tee": {
      const print = (rng() * 3) | 0;
      if (print === 1) {
        // chest stripes
        ctx.fillStyle = c2;
        ctx.fillRect(20, 236, 160, 16);
        ctx.fillRect(20, 270, 160, 16);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.4;
        [236, 252, 270, 286].forEach((y) => {
          ctx.beginPath();
          ctx.moveTo(20, y);
          ctx.lineTo(180, y);
          ctx.stroke();
        });
        ctx.lineWidth = LW;
      } else if (print === 2) {
        // round badge print
        k.ellipse(100, 250, 20, 20, c2);
        k.ellipse(100, 250, 9, 9, CREAM);
      }
      break;
    }
    case "stripes": {
      ctx.fillStyle = c2;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      for (let y = 224; y < 340; y += 34) {
        ctx.fillRect(0, y, 200, 15);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(200, y);
        ctx.moveTo(0, y + 15);
        ctx.lineTo(200, y + 15);
        ctx.stroke();
      }
      ctx.lineWidth = LW;
      break;
    }
    case "varsity": {
      // sleeve bands
      ctx.fillStyle = c2;
      [ARM_L, ARM_R].forEach((arm, i) => {
        const x0 = i === 0 ? 10 : 132;
        ctx.fillRect(x0, 276, 60, 11);
        ctx.fillRect(x0, 296, 60, 11);
      });
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      [276, 287, 296, 307].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(70, y);
        ctx.moveTo(130, y);
        ctx.lineTo(190, y);
        ctx.stroke();
      });
      ctx.lineWidth = LW;
      // placket + snaps
      k.line([[100, 190], [100, 340]], 2.6, INK, false);
      [222, 258, 294].forEach((y) => {
        k.ellipse(106, y, 3.5, 3.5, CREAM);
      });
      break;
    }
    case "cardigan": {
      // inner tee between the two cardigan fronts
      k.poly(
        [
          [84, 170],
          [116, 170],
          [128, 340],
          [72, 340],
        ],
        c3 === c1 ? CREAM : c3,
        0.5,
      );
      [236, 280].forEach((y) => k.ellipse(138, y, 3.6, 3.6, CREAM));
      break;
    }
    case "denim": {
      // placket + two chest pockets
      k.line([[100, 200], [100, 340]], 2.6, INK, false);
      [
        [52, 90],
        [110, 148],
      ].forEach(([x0, x1]) => {
        k.poly(
          [
            [x0, 236],
            [x1, 236],
            [x1, 270],
            [(x0 + x1) / 2, 278],
            [x0, 270],
          ],
          shade(torsoColor, 0.08),
          0.5,
        );
        k.line([[x0, 246], [x1, 246]], 2, INK, false);
      });
      break;
    }
    default:
      break;
  }
  ctx.restore();

  // sleeve seam lines are already visible from the arm outlines.

  // --- neck + neckline treatments ---
  const vNeck = outfit === "denim" || outfit === "polo" || outfit === "cardigan";
  drawNeck(k, ctx, s, vNeck);

  switch (outfit) {
    case "tee":
    case "stripes":
      k.line(
        [
          [80, 172],
          [100, 194],
          [120, 172],
        ],
        LW,
      );
      break;
    case "hoodie": {
      // front hood rim + drawstrings
      k.blob(
        [
          [64, 176],
          [100, 204],
          [136, 176],
          [126, 166],
          [100, 188],
          [74, 166],
        ],
        shade(c1, -0.2),
        0.6,
      );
      k.line([[90, 196], [88, 232], [92, 240]], 2.6);
      k.line([[110, 196], [112, 230], [108, 238]], 2.6);
      k.ellipse(92, 241, 3, 4, CREAM);
      k.ellipse(108, 239, 3, 4, CREAM);
      break;
    }
    case "varsity":
      // ribbed collar
      k.blob(
        [
          [74, 170],
          [100, 198],
          [126, 170],
          [128, 182],
          [100, 210],
          [72, 182],
        ],
        c2,
        0.5,
      );
      // letter patch
      k.ellipse(138, 246, 15, 15, c2);
      ctx.save();
      ctx.fillStyle = CREAM;
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.letter, 138, 248);
      ctx.restore();
      break;
    case "cardigan":
      k.line([[80, 170], [100, 200], [120, 170]], 2.6);
      break;
    case "denim": {
      const dark = shade(torsoColor, -0.18);
      k.poly(
        [
          [72, 166],
          [96, 200],
          [84, 218],
          [56, 186],
        ],
        dark,
        0.6,
      );
      k.poly(
        [
          [128, 166],
          [104, 200],
          [116, 218],
          [144, 186],
        ],
        dark,
        0.6,
      );
      break;
    }
    case "polo": {
      k.poly(
        [
          [72, 168],
          [96, 196],
          [90, 214],
          [58, 190],
        ],
        CREAM,
        0.6,
      );
      k.poly(
        [
          [128, 168],
          [104, 196],
          [110, 214],
          [142, 190],
        ],
        CREAM,
        0.6,
      );
      k.line([[100, 200], [100, 262]], 2.4, INK, false);
      [214, 236, 258].forEach((y) => k.ellipse(100, y, 3, 3, CREAM));
      break;
    }
  }
};

// ---------------------------------------------------------------------------
// FACE
// ---------------------------------------------------------------------------
const drawFace = (ctx: CanvasRenderingContext2D, k: Kit, s: Student) => {
  const skin = s.skin;

  // head
  k.blob(FACE, skin, 0.9);

  // nose (small bump on the right edge, outline only on the outside)
  ctx.save();
  ctx.fillStyle = skin;
  spline(
    ctx,
    [
      [140, 92],
      [152, 108],
      [141, 114],
    ],
    true,
  );
  ctx.fill();
  ctx.restore();
  k.line(
    [
      [141, 90],
      [153, 108],
      [141, 114],
    ],
    LW,
  );

  // ear
  k.ellipse(72, 106, 8.5, 12.5, skin);
  k.line(
    [
      [70, 100],
      [74, 106],
      [70, 112],
    ],
    2,
  );

  // blush + freckles
  if (s.blush) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.13)";
    ctx.beginPath();
    ctx.ellipse(122, 116, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (s.freckles) {
    ctx.save();
    ctx.fillStyle = shade(skin, -0.35);
    [
      [118, 112],
      [126, 116],
      [132, 111],
      [122, 120],
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // eyes
  ctx.save();
  ctx.fillStyle = INK;
  const eyes: Pt[] = [
    [112, 98],
    [135, 98],
  ];
  eyes.forEach(([x, y]) => {
    ctx.beginPath();
    if (s.eyes === 0) ctx.ellipse(x, y, 3.2, 5, 0, 0, Math.PI * 2);
    else if (s.eyes === 1) ctx.ellipse(x, y, 3.6, 3.6, 0, 0, Math.PI * 2);
    else ctx.ellipse(x, y, 3, 5.6, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // brows
  k.line([[104, 84], [112, 81], [121, 83]], 2.8);
  k.line([[128, 83], [136, 80], [144, 83]], 2.8);

  // mouth
  switch (s.mouth) {
    case 0: // smile
      k.line([[116, 128], [127, 134], [141, 126]], 3);
      break;
    case 1: {
      // open grin
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(114, 126);
      ctx.quadraticCurveTo(128, 124, 142, 126);
      ctx.quadraticCurveTo(136, 144, 126, 142);
      ctx.quadraticCurveTo(116, 140, 114, 126);
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#8a8a8a";
      ctx.beginPath();
      ctx.ellipse(127, 139, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 2: // smirk
      k.line([[118, 130], [130, 131], [142, 124]], 3);
      break;
    default: // neutral
      k.line([[118, 130], [142, 129]], 3);
  }

  // glasses
  if (s.glasses) {
    ctx.save();
    ctx.lineWidth = 2.8;
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    eyes.forEach(([x, y]) => {
      ctx.beginPath();
      if (s.glasses === 1) ctx.ellipse(x, y, 11.5, 11.5, 0, 0, Math.PI * 2);
      else ctx.roundRect(x - 12, y - 9.5, 24, 19, 4);
      ctx.fill();
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(123.5, 97);
    ctx.lineTo(123.5, 97);
    ctx.moveTo(122, 96);
    ctx.quadraticCurveTo(123.5, 93, 125, 96);
    ctx.stroke();
    // temple arm towards the ear
    ctx.beginPath();
    ctx.moveTo(100.5, 96);
    ctx.lineTo(76, 100);
    ctx.stroke();
    ctx.restore();
  }
};

// ---------------------------------------------------------------------------
// ACCESSORIES
// ---------------------------------------------------------------------------
const drawHeadphones = (ctx: CanvasRenderingContext2D, k: Kit, s: Student) => {
  const band: Pt[] = [
    [74, 98],
    [66, 58],
    [88, 24],
    [124, 24],
    [144, 52],
  ];
  k.line(band, 10, INK);
  k.line(band, 5.5, s.c3);
  k.ellipse(74, 108, 12, 18, s.c3);
  k.ellipse(74, 108, 6, 11, shade(s.c3, -0.25), false);
  void ctx;
};

const drawLanyard = (k: Kit, s: Student) => {
  const strap = s.c3;
  k.line([[84, 172], [96, 236]], 5, INK, false);
  k.line([[116, 172], [104, 236]], 5, INK, false);
  k.line([[84, 172], [96, 236]], 2.4, strap, false);
  k.line([[116, 172], [104, 236]], 2.4, strap, false);
  k.poly(
    [
      [84, 236],
      [116, 236],
      [116, 274],
      [84, 274],
    ],
    CREAM,
    0.4,
  );
  k.poly(
    [
      [84, 236],
      [116, 236],
      [116, 246],
      [84, 246],
    ],
    s.c2,
    0.3,
  );
  k.ellipse(100, 259, 5, 5, shade(s.skin, 0));
};

const drawStraps = (k: Kit, s: Student) => {
  if (s.backpack) {
    const strapColor = "#1c1c1c";
    k.poly(
      [
        [62, 176],
        [80, 176],
        [74, 340],
        [52, 340],
      ],
      strapColor,
      0.8,
    );
    k.poly(
      [
        [126, 178],
        [144, 184],
        [148, 340],
        [128, 340],
      ],
      strapColor,
      0.8,
    );
    // chest clip
    k.line([[76, 232], [130, 232]], 3, INK, false);
  } else if (s.tote) {
    k.poly(
      [
        [118, 172],
        [140, 180],
        [74, 340],
        [46, 340],
      ],
      CREAM,
      0.8,
    );
    k.line([[66, 300], [120, 196]], 2, shade(s.c2, 0), false);
  }
};

const drawProp = (ctx: CanvasRenderingContext2D, k: Kit, s: Student, rng: Rng) => {
  if (s.prop === "cup") {
    // hand + paper coffee cup on the right (front) side
    k.ellipse(150, 250, 7, 11, s.skin);
    k.poly(
      [
        [153, 224],
        [183, 224],
        [178, 270],
        [158, 270],
      ],
      CREAM,
      0.5,
    );
    k.poly(
      [
        [154, 238],
        [182, 238],
        [180, 254],
        [156, 254],
      ],
      s.c2,
      0.4,
    );
    k.poly(
      [
        [149, 213],
        [187, 213],
        [186, 225],
        [150, 225],
      ],
      "#3a3a3a",
      0.4,
    );
    // steam
    ctx.save();
    ctx.strokeStyle = "rgba(20,20,20,0.35)";
    ctx.lineWidth = 2.4;
    [160, 176].forEach((x, i) => {
      ctx.beginPath();
      ctx.moveTo(x, 206);
      ctx.bezierCurveTo(x - 6, 196, x + 6, 188, x - 2 + i * 2, 178);
      ctx.stroke();
    });
    ctx.restore();
  } else if (s.prop === "books") {
    const a = pick(rng, [s.c1, s.c2, s.c3]);
    const b = pick(rng, CLOTHES);
    const c = pick(rng, CLOTHES);
    const book = (y: number, color: string) => {
      k.poly(
        [
          [36, y],
          [152, y - 4],
          [154, y + 24],
          [38, y + 28],
        ],
        color,
        0.5,
      );
      // page edge on the right + spine highlight
      k.poly(
        [
          [152, y - 4],
          [160, y - 3],
          [162, y + 23],
          [154, y + 24],
        ],
        CREAM,
        0.3,
      );
      k.line([[44, y + 6], [140, y + 3]], 2, shade(color, -0.35), false);
    };
    book(292, c);
    book(266, b);
    book(240, a);
    // hand holding the top book
    k.ellipse(150, 238, 14, 10, s.skin, true, -0.2);
    k.line([[146, 230], [146, 240]], 2, INK, false);
    k.line([[154, 229], [155, 239]], 2, INK, false);
  }
};

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------
/**
 * Draw student number `index` onto a fresh canvas.
 * The same index always produces the same student.
 * @param pixelRatio resolution multiplier (cap at 2 for memory reasons)
 */
export const createStudentSprite = (index: number, pixelRatio = 1): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PEEP_W * pixelRatio);
  canvas.height = Math.round(PEEP_H * pixelRatio);

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(pixelRatio, pixelRatio);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = LW;

  const rng = mulberry32(index * 9973 + 17);
  const student = makeStudent(index, rng);
  const k = makeKit(ctx, rng);

  drawHairBack(k, student);
  drawStudentBody(ctx, k, student, rng);
  drawFace(ctx, k, student);
  drawHairFront(k, student, rng);
  if (student.headphones) drawHeadphones(ctx, k, student);
  if (student.lanyard) drawLanyard(k, student);
  drawStraps(k, student);
  drawProp(ctx, k, student, rng);

  return canvas;
};
