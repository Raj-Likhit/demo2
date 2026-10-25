// Hand-crafted modular Open-Peeps-inspired college student character generator.
// Pure monochrome (#000000 ink & #FFFFFF opaque fills on transparent background)
// so characters cleanly occlude one another in a layered crowd while matching
// Code A's signature black-and-white hand-inked illustration style.

export const PEEP_W = 240;
export const PEEP_H = 440;

export interface DrawOp {
  d: string;
  fill?: string;
  stroke?: string;
  sw?: number;
}

interface StudentRecipe {
  hair: number;
  outfit: number;
  prop: number;
  glasses: number;
  expr: number;
  backpack: boolean;
  beard: boolean;
  earStud: boolean;
}

const FEMININE_HAIRS = new Set([0, 2, 7, 8, 9, 11, 12, 14, 15]);
const HEADWEAR_HAIRS = new Set([3, 4, 5, 6, 12]); // beanie, caps, head-headphones, hijab

function buildRecipe(index: number): StudentRecipe {
  const hair = (index * 7 + Math.floor(index / 16) * 3) % 16;
  const outfit = (index * 3 + Math.floor(index / 10)) % 10;
  let prop = (index * 5 + Math.floor(index / 8) * 2) % 9;
  const glassesRaw = (index * 11 + 3) % 13;
  const glasses =
    glassesRaw < 6
      ? 0 // none
      : glassesRaw < 9
        ? 1 // round coding glasses
        : glassesRaw < 11
          ? 2 // bold rectangular frames
          : glassesRaw === 11
            ? 3 // browline glasses
            : 4; // campus sunglasses (~8%)

  const expr = (index * 5 + Math.floor(index / 7) * 3 + 1) % 8;

  // Kangaroo pocket pose pairs specifically with pullover hoodies (0, 1)
  if (prop === 6 && outfit !== 0 && outfit !== 1) {
    prop = 1; // laptop
  }
  // Neck headphones outfit (7) shouldn't pair with head headphones (6) or hijab (12)
  const finalOutfit =
    outfit === 7 && (hair === 6 || hair === 12) ? 0 : outfit;

  // Backpack peeks behind ~42% of students
  const backpack =
    finalOutfit === 4 ||
    (index % 5 < 2 &&
      finalOutfit !== 3 &&
      finalOutfit !== 9 &&
      hair !== 8);

  // Neat college scruff on a few masculine-hair profiles
  const beard =
    !FEMININE_HAIRS.has(hair) && index % 9 === 4 && hair !== 6;

  const earStud = !HEADWEAR_HAIRS.has(hair) && index % 6 === 2;

  return {
    hair,
    outfit: finalOutfit,
    prop,
    glasses,
    expr,
    backpack,
    beard,
    earStud,
  };
}

// Transform a path string uniformly around pivot (cx, cy) so the Open-Peeps head
// assembly has that iconic generous 1.16x expressive head-to-shoulder proportion.
function transformHeadPath(d: string): string {
  const scale = 1.16;
  const cx = 116;
  const cy = 158;
  const dy = 5; // Snugger sit into collar
  const tokens = d.match(/[a-zA-Z]|-?\d+(?:\.\d+)?/g);
  if (!tokens) return d;

  const out: string[] = [];
  let isX = true;
  for (const tok of tokens) {
    if (/^[a-zA-Z]$/.test(tok)) {
      out.push(tok);
      isX = true;
    } else {
      const val = parseFloat(tok);
      if (isX) {
        out.push((cx + (val - cx) * scale).toFixed(1));
      } else {
        out.push((cy + (val - cy) * scale + dy).toFixed(1));
      }
      isX = !isX;
    }
  }
  return out.join(" ");
}

/**
 * Generates the ordered vector drawing operations for student `index`.
 * All coordinates are authored in a 240 x 440 3/4-right view frame.
 */
export function getStudentOps(index: number): DrawOp[] {
  const r = buildRecipe(index);
  const ops: DrawOp[] = [];

  const pushBody = (
    d: string,
    fill = "none",
    stroke = "#000000",
    sw = 4.8,
  ) => {
    ops.push({ d, fill, stroke, sw });
  };

  const pushHead = (
    d: string,
    fill = "none",
    stroke = "#000000",
    sw = 4.5,
  ) => {
    ops.push({
      d: transformHeadPath(d),
      fill,
      stroke,
      sw: +(sw * 1.06).toFixed(2),
    });
  };

  // Whether the left arm is raised/bent to hold a foreground prop (laptop, coffee, books, phone)
  const leftArmBent =
    r.prop === 1 ||
    r.prop === 2 ||
    r.prop === 3 ||
    r.prop === 4 ||
    r.prop === 5;
  const bothArmsBent = r.prop === 6 || r.prop === 7;

  // =========================================================================
  // 1. BACKPACK DOME (behind shoulders & torso)
  // =========================================================================
  if (r.backpack) {
    pushBody(
      "M 78,176 C 42,168 24,196 26,242 C 27,274 34,296 50,306 L 74,300 Z",
      "#000000",
      "#000000",
      4.8,
    );
    // Top grab loop & crisp white zipper seam
    pushBody("M 66,174 C 58,158 76,156 82,171", "none", "#000000", 4.5);
    pushBody("M 40,206 C 34,230 34,260 41,284", "none", "#ffffff", 2.8);
  }

  // =========================================================================
  // 2. BACK HAIR LAYER (behind head & neck)
  // =========================================================================
  drawBackHair(r.hair, pushHead);

  // =========================================================================
  // 3. LOWER BODY / PANTS (y = 324..444, extends past bottom so crowd depth
  //    never shows a floating cut-off torso)
  // =========================================================================
  const darkTop =
    r.outfit === 1 || r.outfit === 3 || r.outfit === 5 || r.outfit === 8;
  const darkPants = !darkTop ? index % 3 !== 0 : index % 4 === 0;

  if (darkPants) {
    pushBody(
      "M 58,324 C 55,368 53,410 52,446 L 180,446 C 179,410 177,368 174,324 Z",
      "#000000",
      "#000000",
      5,
    );
    pushBody("M 120,356 L 118,446", "none", "#ffffff", 3);
    pushBody("M 64,344 C 67,364 79,372 91,369", "none", "#ffffff", 2.8);
    pushBody("M 168,344 C 164,362 154,370 144,367", "none", "#ffffff", 2.8);
  } else {
    pushBody(
      "M 58,324 C 55,368 53,410 52,446 L 180,446 C 179,410 177,368 174,324 Z",
      "#ffffff",
      "#000000",
      5,
    );
    pushBody("M 120,348 L 118,446", "none", "#000000", 4.2);
    pushBody(
      "M 120,348 C 128,350 130,369 120,375",
      "none",
      "#000000",
      3.2,
    );
    pushBody("M 63,344 C 66,364 79,372 91,369", "none", "#000000", 3.4);
    pushBody("M 169,344 C 165,362 154,370 144,367", "none", "#000000", 3.4);
  }

  // =========================================================================
  // 4. TORSO & COLLEGE OUTFIT BASE (y = 170..340)
  // =========================================================================
  drawOutfit(
    r.outfit,
    r.backpack,
    r.prop,
    leftArmBent,
    bothArmsBent,
    pushBody,
  );

  // =========================================================================
  // 5. NECK & 3/4 HEAD BASE (facing right, Open-Peeps generous proportions)
  // =========================================================================
  if (r.hair === 12) {
    drawHijabBase(pushHead);
  } else {
    // Sturdy Open-Peeps neck tucked into collar
    pushHead(
      "M 96,140 L 94,174 C 103,183 119,183 126,173 L 124,146 Z",
      "#ffffff",
      "#000000",
      4.5,
    );
    // Under-chin shadow curve
    pushHead("M 105,152 C 113,156 120,155 124,151", "none", "#000000", 3.1);

    // Expressive Open-Peeps 3/4 right-facing head silhouette
    pushHead(
      "M 113,56 " +
        "C 141,56 150,74 149,95 " +
        "C 149,104 156,115 153,130 " +
        "C 150,145 137,152 118,151 " +
        "C 99,150 86,138 85,113 " +
        "C 84,78 91,56 113,56 Z",
      "#ffffff",
      "#000000",
      4.6,
    );
  }

  // Optional neat college jawline scruff
  if (r.beard && r.hair !== 12) {
    pushHead(
      "M 93,123 C 95,138 108,145 125,144 C 138,143 148,137 151,129 " +
        "C 150,145 136,153 117,152 C 99,151 90,141 90,125 Z",
      "#000000",
      "#000000",
      3.4,
    );
  }

  // =========================================================================
  // 6. FACIAL EXPRESSION (eyes, brows, 3/4 nose, mouth)
  // =========================================================================
  drawFace(r.expr, r.glasses === 4, pushHead);

  // =========================================================================
  // 7. EYEWEAR (coding glasses, rectangular frames, browline, sunglasses)
  // =========================================================================
  drawGlasses(r.glasses, pushHead);

  // =========================================================================
  // 8. FRONT HAIR / BEANIE / CAP / STUDIO HEADPHONES & EAR
  // =========================================================================
  drawFrontHairAndEar(r.hair, r.earStud, pushHead);

  // =========================================================================
  // 9. FOREGROUND ARMS & COLLEGE PROPS (laptop, coffee, books, phone, etc.)
  // =========================================================================
  drawPropAndArms(r.prop, r.outfit, pushBody);

  return ops;
}

// ---------------------------------------------------------------------------
// MODULAR LAYER HELPERS
// ---------------------------------------------------------------------------

function drawBackHair(
  hair: number,
  push: (d: string, fill?: string, stroke?: string, sw?: number) => void,
) {
  switch (hair) {
    case 0: // Messy late-night study top-bun
      push(
        "M 80,60 C 68,44 77,28 95,29 C 110,26 118,39 109,53 Z",
        "#000000",
        "#000000",
        4.5,
      );
      push("M 85,53 C 92,47 101,49 106,54", "none", "#ffffff", 2.5);
      break;

    case 2: // Voluminous curly shoulder-length cloud (like Open Peeps #9)
      push(
        "M 78,68 C 58,74 53,97 61,113 C 52,128 57,151 73,157 " +
          "C 68,170 81,180 98,175 L 145,173 C 162,175 172,160 164,145 " +
          "C 174,132 170,109 157,99 C 162,80 149,58 130,54 " +
          "C 116,40 90,44 78,68 Z",
        "#000000",
        "#000000",
        4.6,
      );
      break;

    case 4: // Backwards campus baseball cap brim sticking out left
      push(
        "M 84,84 L 54,90 C 50,92 52,99 60,99 L 86,96 Z",
        "#000000",
        "#000000",
        4.4,
      );
      break;

    case 7: // Blunt chin-length bob back silhouette (rounded organic crown!)
      push(
        "M 86,58 C 72,68 67,102 68,152 L 162,148 C 160,118 156,82 144,64 Z",
        "#000000",
        "#000000",
        4.6,
      );
      break;

    case 8: // High swishy ponytail cascading down left
      push(
        "M 90,55 C 66,44 54,70 58,107 C 60,134 56,154 50,168 " +
          "C 66,170 79,156 83,134 C 87,108 89,78 95,60 Z",
        "#000000",
        "#000000",
        4.6,
      );
      push("M 70,65 C 65,94 67,128 62,152", "none", "#ffffff", 2.4);
      push("M 78,70 C 74,96 75,124 71,144", "none", "#ffffff", 2.1);
      break;

    case 9: // Shoulder-length wavy hair behind shoulders
      push(
        "M 84,62 C 70,76 70,136 64,168 C 78,174 96,172 104,167 " +
          "L 134,167 C 148,173 159,171 161,159 C 154,140 154,104 146,74 Z",
        "#000000",
        "#000000",
        4.6,
      );
      break;

    case 11: // Double afro space-puffs
      push(
        "M 70,75 C 55,62 59,38 80,38 C 94,38 98,52 92,65 Z",
        "#000000",
        "#000000",
        4.5,
      );
      push(
        "M 123,52 C 122,35 142,31 154,43 C 163,53 156,70 142,70 Z",
        "#000000",
        "#000000",
        4.5,
      );
      break;

    case 14: // Long sleek straight hair draping smoothly from rounded crown
      push(
        "M 96,52 C 76,58 72,94 65,180 L 156,178 C 153,128 151,82 142,62 Z",
        "#000000",
        "#000000",
        4.6,
      );
      push("M 77,108 L 72,172", "none", "#ffffff", 2.3);
      break;

    case 15: // Braided locs / box braids behind neck
      push(
        "M 92,54 C 72,62 66,112 65,178 C 75,180 83,178 89,172 " +
          "L 140,172 C 150,176 157,174 159,165 C 155,138 151,102 145,76 Z",
        "#000000",
        "#000000",
        4.6,
      );
      push("M 75,116 L 73,170", "none", "#ffffff", 2.3);
      push("M 85,128 L 83,168", "none", "#ffffff", 2.3);
      break;
  }
}

function drawHijabBase(
  push: (d: string, fill?: string, stroke?: string, sw?: number) => void,
) {
  push(
    "M 114,46 C 147,46 160,73 158,112 C 156,143 149,165 156,179 " +
      "C 135,190 93,190 73,177 C 69,150 69,115 73,86 C 77,60 92,46 114,46 Z",
    "#000000",
    "#000000",
    4.8,
  );
  push(
    "M 96,75 C 112,58 138,60 148,81 C 136,69 112,69 96,79 Z",
    "#ffffff",
    "#000000",
    3.4,
  );
  push(
    "M 122,65 C 143,67 150,85 149,104 C 148,124 145,145 124,148 " +
      "C 104,150 95,134 96,108 C 97,83 106,64 122,65 Z",
    "#ffffff",
    "#000000",
    4.5,
  );
  push("M 92,160 C 110,169 132,169 145,160", "none", "#ffffff", 2.6);
  push("M 98,171 C 114,177 128,177 140,171", "none", "#ffffff", 2.3);
}

function drawFrontHairAndEar(
  hair: number,
  earStud: boolean,
  push: (d: string, fill?: string, stroke?: string, sw?: number) => void,
) {
  if (hair === 12) return;

  const drawEar = () => {
    push(
      "M 94,107 C 79,104 78,128 94,127",
      "#ffffff",
      "#000000",
      4.5,
    );
    push("M 90,113 C 85,115 85,120 90,121", "none", "#000000", 2.7);
    if (earStud) {
      push(
        "M 86,127 C 84,127 84,131 86,131 C 88,131 88,127 86,127 Z",
        "#000000",
        "#000000",
        2,
      );
    }
  };

  switch (hair) {
    case 0: // Top-bun front swept hair
      push(
        "M 84,116 C 80,83 90,52 118,52 C 136,52 148,62 150,76 " +
          "C 138,68 120,68 106,77 C 98,83 94,96 93,108 Z",
        "#000000",
        "#000000",
        4.5,
      );
      drawEar();
      break;

    case 1: // Curly short fade / textured crop
      push(
        "M 84,132 C 74,126 73,110 79,98 C 73,83 80,64 96,56 " +
          "C 106,46 126,46 138,54 C 148,56 154,66 150,76 " +
          "C 138,70 118,70 104,76 C 96,80 94,93 94,107 Z",
        "#000000",
        "#000000",
        4.5,
      );
      drawEar();
      break;

    case 2: // Voluminous curls framing forehead
      push(
        "M 84,115 C 82,85 92,58 118,56 C 136,56 148,66 152,79 " +
          "C 140,73 130,68 118,74 C 106,68 96,83 94,107 Z",
        "#000000",
        "#000000",
        4.5,
      );
      drawEar();
      break;

    case 3: // Cozy folded-cuff knit college beanie!
      // Upper knit beanie dome
      push(
        "M 82,96 C 82,54 102,40 124,44 C 142,47 150,62 150,82 Z",
        "#ffffff",
        "#000000",
        4.6,
      );
      // Folded thick ribbed cuff band wrapping snug across forehead
      push(
        "M 79,106 C 78,92 84,82 96,76 C 114,68 138,70 153,82 " +
          "C 155,88 153,94 149,95 C 134,84 110,83 95,93 C 89,97 86,103 85,109 Z",
        "#ffffff",
        "#000000",
        4.6,
      );
      // Ribbed cuff stitch lines
      push("M 96,77 L 98,90", "none", "#000000", 2.8);
      push("M 112,72 L 113,85", "none", "#000000", 2.8);
      push("M 129,72 L 128,85", "none", "#000000", 2.8);
      push("M 143,76 L 141,88", "none", "#000000", 2.8);
      drawEar();
      break;

    case 4: // Backwards campus baseball cap
      push(
        "M 82,103 C 80,70 96,48 122,50 C 142,52 152,66 152,83 " +
          "C 138,77 114,77 94,89 Z",
        "#000000",
        "#000000",
        4.6,
      );
      push("M 116,50 C 112,62 110,71 110,79", "none", "#ffffff", 2.3);
      drawEar();
      break;

    case 5: // Classic forwards university cap
      push(
        "M 82,103 C 80,70 96,48 120,50 C 140,52 150,66 150,81 L 92,89 Z",
        "#000000",
        "#000000",
        4.6,
      );
      push(
        "M 112,77 C 136,71 166,73 174,83 C 162,87 138,85 116,83 Z",
        "#ffffff",
        "#000000",
        4.5,
      );
      drawEar();
      break;

    case 6: // Tousled hair + wireless over-ear studio headphones
      push(
        "M 82,111 C 78,78 92,50 118,50 C 140,50 154,62 154,79 " +
          "C 142,71 132,77 126,69 C 116,77 102,75 94,97 Z",
        "#000000",
        "#000000",
        4.5,
      );
      push(
        "M 86,106 C 84,65 102,42 124,44 C 134,45 140,50 142,56 " +
          "C 134,51 124,50 114,52 C 98,56 92,77 92,106 Z",
        "#ffffff",
        "#000000",
        4.5,
      );
      push(
        "M 89,97 C 76,97 74,132 89,132 C 102,132 102,97 89,97 Z",
        "#ffffff",
        "#000000",
        4.6,
      );
      push("M 90,104 C 83,104 83,125 90,125", "none", "#000000", 2.7);
      break;

    case 7: // Blunt bob with straight fringe bangs
      push(
        "M 74,148 C 72,106 76,68 96,54 C 114,44 142,48 154,70 " +
          "C 159,80 161,91 161,99 L 148,96 L 146,83 L 102,85 " +
          "C 100,108 98,132 98,149 Z",
        "#000000",
        "#000000",
        4.6,
      );
      break;

    case 8: // Sleek pulled-back hair for high ponytail
      push(
        "M 84,115 C 82,82 94,56 120,56 C 136,56 146,64 149,74 " +
          "C 136,66 114,68 100,81 C 94,87 93,97 93,107 Z",
        "#000000",
        "#000000",
        4.5,
      );
      push("M 96,66 C 108,61 120,60 130,62", "none", "#ffffff", 2.1);
      drawEar();
      break;

    case 9: // Wavy side-parted hair tucked behind ear
      push(
        "M 82,116 C 80,80 92,52 118,52 C 138,52 150,64 151,79 " +
          "C 138,70 122,68 106,77 C 98,83 94,95 94,107 Z",
        "#000000",
        "#000000",
        4.5,
      );
      drawEar();
      break;

    case 10: // Indie curtain bangs / middle-part swept hair
      push(
        "M 82,120 C 76,85 88,52 116,50 C 140,48 156,64 156,89 " +
          "C 146,85 136,75 130,66 C 122,79 108,89 94,95 L 94,108 Z",
        "#000000",
        "#000000",
        4.5,
      );
      drawEar();
      break;

    case 11: // Afro puffs hairline
      push(
        "M 84,115 C 82,82 94,56 118,56 C 136,56 148,66 150,77 " +
          "C 136,70 116,70 102,81 C 96,87 94,97 94,107 Z",
        "#000000",
        "#000000",
        4.5,
      );
      drawEar();
      break;

    case 13: // Tousled spiky 8am-lecture bedhead
      push(
        "M 82,116 C 78,93 80,74 88,60 L 84,50 L 98,54 L 106,42 " +
          "L 118,51 L 132,42 L 138,54 L 151,52 L 148,68 " +
          "C 152,74 152,79 150,83 C 138,73 116,73 100,85 L 94,107 Z",
        "#000000",
        "#000000",
        4.4,
      );
      drawEar();
      break;

    case 14: // Long straight hair with cute hairclips + fringe
      push(
        "M 82,116 C 80,78 92,50 118,50 C 140,50 152,64 153,83 " +
          "C 140,79 132,75 128,68 C 120,77 106,81 94,85 L 94,107 Z",
        "#000000",
        "#000000",
        4.5,
      );
      push("M 102,70 L 114,74", "none", "#ffffff", 2.7);
      push("M 100,76 L 112,80", "none", "#ffffff", 2.7);
      drawEar();
      break;

    case 15:
    default:
      push(
        "M 82,116 C 80,80 92,52 118,52 C 138,52 150,64 150,77 " +
          "C 138,70 118,70 102,79 C 96,85 94,95 94,107 Z",
        "#000000",
        "#000000",
        4.5,
      );
      drawEar();
      break;
  }
}

function drawFace(
  expr: number,
  wearingShades: boolean,
  push: (d: string, fill?: string, stroke?: string, sw?: number) => void,
) {
  push("M 129,104 C 136,110 136,118 127,120", "none", "#000000", 3.5);

  if (!wearingShades) {
    if (expr === 1) {
      // 3AM debugging tired half-lidded eyes + under-eye bags
      push("M 109,92 C 113,90 118,91 121,93", "none", "#000000", 3.4);
      push("M 134,93 C 138,91 143,91 146,93", "none", "#000000", 3.4);
      push("M 110,103 L 121,103", "none", "#000000", 3.3);
      push("M 134,103 L 145,103", "none", "#000000", 3.3);
      push(
        "M 116,103 C 114,103 114,108 116,108 C 119,108 119,103 116,103 Z",
        "#000000",
        "#000000",
        2,
      );
      push(
        "M 140,103 C 138,103 138,108 140,108 C 143,108 143,103 140,103 Z",
        "#000000",
        "#000000",
        2,
      );
      push("M 111,111 Q 116,114 121,111", "none", "#000000", 2.1);
      push("M 135,111 Q 140,114 145,111", "none", "#000000", 2.1);
    } else if (expr === 6) {
      // Joyful closed-eye laugh (^ ^)
      push("M 108,90 Q 115,86 121,90", "none", "#000000", 3.4);
      push("M 134,90 Q 140,86 146,91", "none", "#000000", 3.4);
      push("M 110,106 Q 116,99 122,106", "none", "#000000", 3.5);
      push("M 134,106 Q 140,99 146,106", "none", "#000000", 3.5);
    } else {
      if (expr === 3) {
        push("M 109,91 L 122,95", "none", "#000000", 3.5);
        push("M 146,91 L 134,95", "none", "#000000", 3.5);
      } else if (expr === 5) {
        push("M 108,87 Q 115,82 122,88", "none", "#000000", 3.5);
        push("M 134,94 L 146,94", "none", "#000000", 3.5);
      } else {
        push("M 109,93 Q 115,88 121,92", "none", "#000000", 3.5);
        push("M 134,92 Q 140,88 146,93", "none", "#000000", 3.5);
      }
      push(
        "M 116,101 C 113,101 113,109 116,109 C 119,109 119,101 116,101 Z",
        "#000000",
        "#000000",
        2.1,
      );
      push(
        "M 140,101 C 137,101 137,109 140,109 C 143,109 143,101 140,101 Z",
        "#000000",
        "#000000",
        2.1,
      );
    }
  } else {
    push("M 108,91 Q 115,87 122,90", "none", "#000000", 3.4);
    push("M 134,90 Q 140,87 146,91", "none", "#000000", 3.4);
  }

  switch (expr) {
    case 1:
      push("M 117,133 Q 124,131 131,134", "none", "#000000", 3.4);
      break;
    case 2:
      push(
        "M 115,128 L 136,128 C 136,140 115,140 115,128 Z",
        "#000000",
        "#000000",
        3.3,
      );
      push("M 117,129 L 134,129 L 133,132 L 118,132 Z", "#ffffff", "none", 0);
      break;
    case 6:
      push("M 116,128 C 122,138 130,138 136,128", "none", "#000000", 3.6);
      break;
    case 3:
      push("M 116,133 C 122,134 129,132 134,127", "none", "#000000", 3.5);
      break;
    case 4:
      push(
        "M 125,129 C 121,129 121,137 125,137 C 129,137 129,129 125,129 Z",
        "#000000",
        "#000000",
        2.5,
      );
      break;
    case 5:
      push("M 115,130 Q 124,138 135,129", "none", "#000000", 3.5);
      break;
    default:
      push("M 118,130 Q 126,139 134,130", "none", "#000000", 3.5);
      break;
  }
}

function drawGlasses(
  glasses: number,
  push: (d: string, fill?: string, stroke?: string, sw?: number) => void,
) {
  if (glasses === 0) return;

  if (glasses === 1) {
    push("M 94,105 L 105,104", "none", "#000000", 3.2);
    push(
      "M 115,94 C 103,94 103,116 115,116 C 127,116 127,94 115,94 Z",
      "none",
      "#000000",
      3.5,
    );
    push("M 126,103 Q 130,100 133,103", "none", "#000000", 3.2);
    push(
      "M 142,94 C 131,94 131,116 142,116 C 153,116 153,94 142,94 Z",
      "none",
      "#000000",
      3.5,
    );
  } else if (glasses === 2) {
    push("M 94,103 L 104,102", "none", "#000000", 3.8);
    push(
      "M 104,96 L 126,96 L 125,114 L 105,114 Z",
      "none",
      "#000000",
      4.2,
    );
    push("M 126,102 L 133,102", "none", "#000000", 3.8);
    push(
      "M 133,96 L 153,96 L 152,114 L 134,114 Z",
      "none",
      "#000000",
      4.2,
    );
  } else if (glasses === 3) {
    push("M 94,102 L 104,100", "none", "#000000", 3.4);
    push("M 103,97 L 127,97", "none", "#000000", 5);
    push("M 132,97 L 154,97", "none", "#000000", 5);
    push("M 126,100 L 133,100", "none", "#000000", 3.2);
    push("M 105,98 C 105,115 125,115 125,98", "none", "#000000", 2.5);
    push("M 134,98 C 134,115 152,115 152,98", "none", "#000000", 2.5);
  } else if (glasses === 4) {
    push("M 94,102 L 104,100", "none", "#000000", 4);
    push(
      "M 103,96 L 128,96 C 128,114 104,116 103,96 Z",
      "#000000",
      "#000000",
      3.8,
    );
    push("M 127,99 L 134,99", "none", "#000000", 4);
    push(
      "M 133,96 L 155,96 C 155,114 134,116 133,96 Z",
      "#000000",
      "#000000",
      3.8,
    );
    push("M 109,100 L 114,106", "none", "#ffffff", 2.3);
    push("M 139,100 L 144,106", "none", "#ffffff", 2.3);
  }
}

function drawOutfit(
  outfit: number,
  backpack: boolean,
  prop: number,
  leftArmBent: boolean,
  bothArmsBent: boolean,
  push: (d: string, fill?: string, stroke?: string, sw?: number) => void,
) {
  // When an arm bends forward to hold a laptop/coffee/books/phone, the outer sleeve stops
  // cleanly at the bent elbow (~y=282) rather than leaving an extra straight cuff at y=328!
  const leftSide =
    leftArmBent || bothArmsBent
      ? "M 92,176 C 64,185 42,206 34,250 C 31,268 38,284 56,286 L 58,334 "
      : "M 92,176 C 64,185 44,206 36,244 L 29,326 L 54,328 L 58,334 ";

  const rightSide = bothArmsBent
    ? "C 96,341 142,341 175,334 L 177,286 C 192,282 197,266 193,246 C 184,204 160,185 126,176 Z"
    : "C 96,341 142,341 175,334 L 178,326 L 199,324 L 190,240 C 182,204 160,185 126,176 Z";

  const baseSilhouette = leftSide + rightSide;

  const drawSleeveSeams = (color: string, sw: number) => {
    if (!leftArmBent && !bothArmsBent) {
      push("M 58,244 L 54,328", "none", color, sw);
    }
    if (!bothArmsBent) {
      push("M 174,242 L 178,326", "none", color, sw);
    }
  };

  const drawBackpackStraps = (invertColor = false) => {
    const strapFill = invertColor ? "#ffffff" : "#000000";
    push(
      "M 76,181 C 66,214 66,258 70,298 L 84,296 C 80,256 80,214 88,178 Z",
      strapFill,
      "#000000",
      4,
    );
    push(
      "M 142,181 C 152,214 154,256 150,296 L 163,294 C 166,254 164,212 153,184 Z",
      strapFill,
      "#000000",
      4,
    );
  };

  switch (outfit) {
    case 0: {
      // WHITE CAMPUS PULLOVER HOODIE
      push(
        "M 84,180 C 62,173 60,152 84,149 L 138,153 C 154,158 152,175 134,180 Z",
        "#ffffff",
        "#000000",
        4.8,
      );
      push(baseSilhouette, "#ffffff", "#000000", 5);
      drawSleeveSeams("#000000", 4.6);
      push("M 90,177 C 102,197 122,197 130,177", "none", "#000000", 4.2);
      push("M 108,193 C 107,214 106,228 108,240", "none", "#000000", 3.6);
      push("M 124,193 C 125,212 126,226 124,236", "none", "#000000", 3.6);
      push("M 79,324 L 89,286 L 149,286 L 159,324", "none", "#000000", 3.8);
      push("M 58,325 C 96,331 140,331 175,325", "none", "#000000", 3.6);
      if (backpack) drawBackpackStraps(false);
      break;
    }

    case 1: {
      // SOLID BLACK HACKATHON HOODIE (`</>`)
      push(
        "M 84,180 C 62,173 60,152 84,149 L 138,153 C 154,158 152,175 134,180 Z",
        "#000000",
        "#000000",
        4.8,
      );
      push(baseSilhouette, "#000000", "#000000", 5);
      drawSleeveSeams("#ffffff", 3);
      push("M 88,177 C 102,197 122,197 132,177", "none", "#ffffff", 3);
      push("M 108,194 L 107,236", "none", "#ffffff", 3);
      push("M 124,194 L 125,232", "none", "#ffffff", 3);
      push("M 80,324 L 90,288 L 148,288 L 158,324", "none", "#ffffff", 2.6);
      if (prop === 0 || prop === 2 || prop === 4 || prop === 8) {
        push("M 112,228 L 103,236 L 112,244", "none", "#ffffff", 3);
        push("M 124,225 L 117,247", "none", "#ffffff", 3);
        push("M 130,228 L 139,236 L 130,244", "none", "#ffffff", 3);
      }
      break;
    }

    case 2: {
      // WHITE ZIP-UP HOODIE OVER BLACK TEE
      push(
        "M 84,181 C 60,173 60,150 85,148 L 138,153 C 154,158 152,175 134,181 Z",
        "#ffffff",
        "#000000",
        4.8,
      );
      push(baseSilhouette, "#ffffff", "#000000", 5);
      push("M 92,177 L 118,213 L 129,177 Z", "#000000", "#000000", 4);
      push("M 118,213 L 118,338", "none", "#000000", 4.2);
      drawSleeveSeams("#000000", 4.6);
      push("M 79,325 L 89,286 L 148,286 L 158,325", "none", "#000000", 3.6);
      if (backpack) drawBackpackStraps(false);
      break;
    }

    case 3: {
      // VARSITY LETTERMAN CAMPUS JACKET
      push(baseSilhouette, "#ffffff", "#000000", 5);
      push(
        "M 86,178 L 60,226 L 58,334 C 96,341 142,341 175,334 L 172,224 L 132,178 Z",
        "#000000",
        "#000000",
        4.8,
      );
      push("M 90,176 C 102,195 120,195 130,176", "none", "#ffffff", 3.4);
      push("M 120,193 L 120,336", "none", "#ffffff", 2.6);
      push("M 127,214 L 127,217", "none", "#ffffff", 4.5);
      push("M 127,244 L 127,247", "none", "#ffffff", 4.5);
      push("M 127,274 L 127,277", "none", "#ffffff", 4.5);
      push("M 127,304 L 127,307", "none", "#ffffff", 4.5);
      if (prop === 0 || prop === 2 || prop === 8) {
        push(
          "M 152,222 C 140,218 138,240 152,237",
          "none",
          "#ffffff",
          3.8,
        );
      }
      break;
    }

    case 4: {
      // WHITE UNIVERSITY CREWNECK SWEATSHIRT + BACKPACK STRAPS
      push(baseSilhouette, "#ffffff", "#000000", 5);
      drawSleeveSeams("#000000", 4.6);
      push("M 90,177 C 102,195 120,195 130,177", "none", "#000000", 4.5);
      push("M 103,191 L 111,204 L 119,191", "none", "#000000", 3.2);
      push("M 58,325 C 96,331 140,331 175,325", "none", "#000000", 3.6);
      drawBackpackStraps(false);
      break;
    }

    case 5: {
      // BLACK RINGER TEE + CROSSBODY CANVAS TOTE BAG STRAP
      push(baseSilhouette, "#ffffff", "#000000", 5);
      push(
        "M 92,176 C 66,185 44,205 35,254 L 60,262 L 58,334 " +
          "C 96,341 142,341 175,334 L 174,258 L 195,250 C 184,203 160,185 126,176 Z",
        "#000000",
        "#000000",
        4.8,
      );
      push("M 88,178 C 102,198 122,198 132,178", "none", "#ffffff", 4.6);
      push("M 36,250 L 60,258", "none", "#ffffff", 4.4);
      push("M 174,254 L 194,246", "none", "#ffffff", 4.4);
      push(
        "M 76,183 L 167,318 L 175,308 L 88,179 Z",
        "#ffffff",
        "#000000",
        3.8,
      );
      break;
    }

    case 6: {
      // LAYERED OVERSHIRT + CAMPUS LANYARD & STUDENT ID BADGE
      push(baseSilhouette, "#ffffff", "#000000", 5);
      drawSleeveSeams("#000000", 4.6);
      push("M 94,181 C 104,193 118,193 126,181", "none", "#000000", 4);
      push("M 88,177 L 78,205 L 94,211 L 96,337", "none", "#000000", 4);
      push("M 130,177 L 144,205 L 132,211 L 134,337", "none", "#000000", 4);
      push("M 94,179 L 115,237 L 127,179", "none", "#000000", 3.6);
      push(
        "M 105,237 L 127,237 L 127,269 L 105,269 Z",
        "#ffffff",
        "#000000",
        3.8,
      );
      push("M 110,245 L 122,245 L 122,255 L 110,255 Z", "#000000", "none", 0);
      push("M 110,261 L 122,261", "none", "#000000", 2.6);
      break;
    }

    case 7: {
      // CREWNECK SWEATER + STUDIO HEADPHONES RESTING AROUND NECK
      push(baseSilhouette, "#ffffff", "#000000", 5);
      drawSleeveSeams("#000000", 4.6);
      push("M 90,177 C 102,193 120,193 130,177", "none", "#000000", 4.2);
      push("M 86,177 C 82,197 138,197 134,177", "none", "#000000", 4.8);
      push(
        "M 96,185 C 84,185 84,213 96,213 C 108,213 108,185 96,185 Z",
        "#000000",
        "#000000",
        4,
      );
      push(
        "M 132,185 C 120,185 120,213 132,213 C 144,213 144,185 132,185 Z",
        "#000000",
        "#000000",
        4,
      );
      push("M 96,191 C 90,191 90,207 96,207", "none", "#ffffff", 2.4);
      push("M 132,191 C 126,191 126,207 132,207", "none", "#ffffff", 2.4);
      if (backpack) drawBackpackStraps(false);
      break;
    }

    case 8: {
      // BLACK COLLEGIATE CREWNECK SWEATSHIRT
      push(baseSilhouette, "#000000", "#000000", 5);
      drawSleeveSeams("#ffffff", 3);
      push("M 88,178 C 102,196 122,196 132,178", "none", "#ffffff", 3.6);
      if (prop === 0 || prop === 2 || prop === 8) {
        push("M 92,238 Q 122,224 150,236", "none", "#ffffff", 4.4);
        push("M 98,248 Q 122,237 146,246", "none", "#ffffff", 2.8);
      }
      if (backpack) drawBackpackStraps(true);
      break;
    }

    case 9:
    default: {
      // CAMPUS PUFFER VEST OVER WHITE LONG-SLEEVE THERMAL
      push(baseSilhouette, "#ffffff", "#000000", 5);
      push(
        "M 86,173 L 62,213 L 58,334 C 96,341 142,341 175,334 L 172,211 L 134,173 " +
          "C 122,191 100,191 86,173 Z",
        "#000000",
        "#000000",
        4.8,
      );
      push("M 120,189 L 120,337", "none", "#ffffff", 2.8);
      push("M 62,238 L 172,238", "none", "#ffffff", 2.4);
      push("M 60,284 L 174,284", "none", "#ffffff", 2.4);
      break;
    }
  }
}

function drawPropAndArms(
  prop: number,
  outfit: number,
  push: (d: string, fill?: string, stroke?: string, sw?: number) => void,
) {
  const darkSleeve = outfit === 1 || outfit === 8;
  const sleeveFill = darkSleeve ? "#000000" : "#ffffff";

  // Helper for an organic rounded bent left arm sweeping from shoulder/elbow to wrist
  const drawBentLeftArm = (wristX: number, wristY: number) => {
    push(
      `M 36,242 C 28,274 34,308 62,302 L ${wristX},${wristY + 20} ` +
        `L ${wristX - 6},${wristY} L 60,274 C 54,264 54,250 58,238`,
      sleeveFill,
      "#000000",
      4.6,
    );
    if (darkSleeve) {
      // Crisp white inner elbow crease so black sleeve reads clearly over black torso
      push(
        `M 58,274 L ${wristX - 8},${wristY + 2}`,
        "none",
        "#ffffff",
        2.8,
      );
      push(
        `M 42,296 C 50,304 64,302 ${wristX - 2},${wristY + 19}`,
        "none",
        "#ffffff",
        2.6,
      );
    }
  };

  switch (prop) {
    case 1: {
      // CRADLING A SLEEK LAPTOP / MACBOOK AGAINST CHEST
      push(
        "M 96,216 L 166,208 L 158,286 L 88,294 Z",
        "#ffffff",
        "#000000",
        4.6,
      );
      push("M 88,294 L 96,216 L 91,218 L 83,292 Z", "#000000", "#000000", 3);
      push(
        "M 128,242 C 123,242 123,252 128,252 C 133,252 133,242 128,242 Z",
        "#000000",
        "#000000",
        2,
      );
      push("M 142,264 L 152,262 L 151,272 L 141,274 Z", "#000000", "none", 0);

      drawBentLeftArm(98, 266);
      push(
        "M 95,264 C 114,261 117,285 99,288 L 91,287 Z",
        "#ffffff",
        "#000000",
        4.2,
      );
      break;
    }

    case 2: {
      // HOLDING ICED COFFEE / BOBA CUP WITH DOME LID & STRAW
      push("M 156,194 L 149,170 L 141,171", "none", "#000000", 4.2);
      push(
        "M 142,212 L 174,212 L 169,266 L 147,266 Z",
        "#ffffff",
        "#000000",
        4.4,
      );
      push(
        "M 145,234 L 171,234 L 169,265 L 147,265 Z",
        "#000000",
        "#000000",
        2,
      );
      push(
        "M 140,212 C 142,196 172,196 176,212 Z",
        "#ffffff",
        "#000000",
        4.2,
      );

      drawBentLeftArm(138, 238);
      push(
        "M 134,234 C 156,230 158,258 139,260 Z",
        "#ffffff",
        "#000000",
        4.2,
      );
      break;
    }

    case 3: {
      // HUGGING TWO STACKED CAMPUS TEXTBOOKS / SPIRAL NOTEBOOK
      push(
        "M 92,218 L 154,212 L 150,288 L 88,294 Z",
        "#000000",
        "#000000",
        4.4,
      );
      push(
        "M 102,228 L 162,224 L 158,296 L 98,300 Z",
        "#ffffff",
        "#000000",
        4.4,
      );
      push("M 98,238 L 106,238", "none", "#000000", 3.4);
      push("M 98,252 L 106,252", "none", "#000000", 3.4);
      push("M 97,266 L 105,266", "none", "#000000", 3.4);
      push("M 96,280 L 104,280", "none", "#000000", 3.4);
      push("M 118,244 L 146,242 L 145,256 L 117,258 Z", "none", "#000000", 3);

      drawBentLeftArm(114, 266);
      push(
        "M 111,264 C 132,262 134,287 115,289 Z",
        "#ffffff",
        "#000000",
        4.2,
      );
      break;
    }

    case 4: {
      // CHECKING SMARTPHONE IN HAND
      push(
        "M 148,212 L 170,216 L 162,258 L 140,254 Z",
        "#000000",
        "#000000",
        4.2,
      );
      push("M 153,220 L 161,222", "none", "#ffffff", 2.8);

      drawBentLeftArm(136, 240);
      push(
        "M 132,236 C 154,233 156,260 137,262 Z",
        "#ffffff",
        "#000000",
        4.2,
      );
      break;
    }

    case 5: {
      // STEAMING HOT TAKEAWAY COFFEE CUP
      push("M 152,190 C 149,182 155,176 152,168", "none", "#000000", 2.8);
      push("M 164,192 C 161,184 167,178 164,170", "none", "#000000", 2.8);
      push(
        "M 142,210 L 174,210 L 168,262 L 148,262 Z",
        "#ffffff",
        "#000000",
        4.4,
      );
      push(
        "M 145,226 L 171,226 L 169,246 L 147,246 Z",
        "#000000",
        "#000000",
        3,
      );
      push(
        "M 139,204 L 177,204 L 175,211 L 141,211 Z",
        "#ffffff",
        "#000000",
        4,
      );

      drawBentLeftArm(138, 238);
      push(
        "M 134,234 C 154,231 156,257 139,259 Z",
        "#ffffff",
        "#000000",
        4.2,
      );
      break;
    }

    case 6: {
      // HANDS TUCKED COZILY INTO HOODIE KANGAROO POCKET
      push(
        "M 36,248 C 30,274 44,296 86,312 L 92,292 C 64,280 56,268 58,244",
        sleeveFill,
        "#000000",
        4.6,
      );
      push(
        "M 190,246 C 196,272 184,294 148,312 L 142,292 C 166,280 174,268 172,244",
        sleeveFill,
        "#000000",
        4.6,
      );
      if (darkSleeve) {
        push("M 56,268 L 90,292", "none", "#ffffff", 2.6);
        push("M 174,268 L 144,292", "none", "#ffffff", 2.6);
      }
      break;
    }

    case 7: {
      // NATURAL FOLDED / CROSSED ARMS (like Open Peeps #10!)
      // Right arm tucked underneath
      push(
        "M 172,244 C 176,268 182,286 168,296 C 142,306 90,304 62,296 " +
          "C 52,292 52,276 66,274 L 158,274",
        sleeveFill,
        "#000000",
        4.6,
      );
      // Left forearm crossing smoothly over top + relaxed hand resting on bicep
      push(
        "M 36,246 C 32,276 42,294 68,292 L 154,284 C 166,282 166,264 152,264 " +
          "L 62,268 C 56,262 56,252 58,242",
        sleeveFill,
        "#000000",
        4.6,
      );
      // Tucked fingers resting on right arm
      push(
        "M 150,264 C 168,262 170,282 152,284 Z",
        "#ffffff",
        "#000000",
        4,
      );
      if (darkSleeve) {
        push("M 58,268 L 150,265", "none", "#ffffff", 2.8);
        push("M 64,291 L 152,284", "none", "#ffffff", 2.8);
        push("M 72,301 C 104,305 138,305 166,297", "none", "#ffffff", 2.5);
      }
      break;
    }

    case 0:
    case 8:
    default:
      break;
  }
}

/**
 * Renders a single student onto a standalone canvas.
 */
export function createStudentSprite(
  index: number,
  pixelRatio = 2,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PEEP_W * pixelRatio);
  canvas.height = Math.round(PEEP_H * pixelRatio);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.save();
  ctx.scale(pixelRatio, pixelRatio);
  renderStudentToContext(ctx, index, 0, 0);
  ctx.restore();
  return canvas;
}

/**
 * Draws student `index` at `(offsetX, offsetY)` in logical coordinates onto `ctx`.
 */
export function renderStudentToContext(
  ctx: CanvasRenderingContext2D,
  index: number,
  offsetX = 0,
  offsetY = 0,
) {
  const ops = getStudentOps(index);
  ctx.save();
  ctx.beginPath();
  ctx.rect(offsetX, offsetY, PEEP_W, PEEP_H);
  ctx.clip();
  ctx.translate(offsetX, offsetY);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const op of ops) {
    const p = new Path2D(op.d);
    if (op.fill && op.fill !== "none") {
      ctx.fillStyle = op.fill;
      ctx.fill(p);
    }
    if (op.stroke && op.stroke !== "none" && (op.sw ?? 0) > 0) {
      ctx.strokeStyle = op.stroke;
      ctx.lineWidth = op.sw ?? 4.8;
      ctx.stroke(p);
    }
  }
  ctx.restore();
}

let cachedSheetUrl: string | null = null;
let cachedKey = "";

/**
 * Generates a full `rows x cols` (default 15 x 7 = 105 college students) sprite sheet
 * matching Code A's exact sprite-sheet slicing architecture (`src`, `rows`, `cols`),
 * cached in memory as a crisp PNG Data URL.
 */
export function getStudentSpriteSheetDataUrl(
  rows = 15,
  cols = 7,
  pixelRatio = 1.5,
): string {
  const key = `${rows}x${cols}@${pixelRatio}`;
  if (cachedSheetUrl && cachedKey === key) {
    return cachedSheetUrl;
  }

  const sheet = document.createElement("canvas");
  sheet.width = Math.round(rows * PEEP_W * pixelRatio);
  sheet.height = Math.round(cols * PEEP_H * pixelRatio);
  const ctx = sheet.getContext("2d");
  if (!ctx) return "";

  ctx.scale(pixelRatio, pixelRatio);
  const total = rows * cols;
  for (let i = 0; i < total; i++) {
    const colX = (i % rows) * PEEP_W;
    const rowY = ((i / rows) | 0) * PEEP_H;
    renderStudentToContext(ctx, i, colX, rowY);
  }

  cachedSheetUrl = sheet.toDataURL("image/png");
  cachedKey = key;
  return cachedSheetUrl;
}
