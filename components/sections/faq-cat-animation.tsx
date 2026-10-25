/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export function installFaqCatAnimation(svgElement: SVGSVGElement) {
const CAT_CONFIG = {
// Eye & head tracking limits
maxPupilOffset: 4.2, // Max px pupils shift inside sclera
maxHeadShift: 3.5, // Max px head translates toward pointer
maxHeadTiltDeg: 3.5, // Max degrees head rotates toward pointer
trackingSmoothing: 0.085, // Damped spring factor (lower = dreamier)
pointerIdleTimeoutMs: 3600,// Return to resting gaze after idle
// Proximity radius (in SVG units) around Floor Cat / Yarn
floorAlertRadius: 175,
autoSwipeCooldownMs: 2800,
// Randomized Idle Timing Ranges [minMs, maxMs]
blinkInterval: [2600, 6200],
earTwitchInterval: [3800, 9500],
peekDuckInterval: [9500, 17500],
peekHiddenDuration: [1300, 2300],
floorIdleInterval: [7500, 14500],
// Yarn Ball 1D Rolling Physics
yarnMaxRollX: 28, // Max horizontal travel in SVG px
yarnSpringStiffness: 0.045,// Pull back toward resting spot
yarnFriction: 0.91 // Velocity damping per frame
};
class InteractiveCatsController {
constructor(svgElement, config = CAT_CONFIG) {
this.svg = svgElement;
this.cfg = config;
this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Cache SVG layer nodes
this.nodes = {
// Peeking Cat
peekRoot: svgElement.querySelector('#peek-cat-root'),
peekHead: svgElement.querySelector('#peek-head-group'),
peekTail: svgElement.querySelector('#peek-tail-pivot'),
peekEarL: svgElement.querySelector('#peek-ear-l'),
peekEarR: svgElement.querySelector('#peek-ear-r'),
peekEyesBlink: svgElement.querySelector('#peek-eyes-blink'),
peekPupilL: svgElement.querySelector('#peek-pupil-l'),
peekPupilR: svgElement.querySelector('#peek-pupil-r'),
peekPawsFront: svgElement.querySelector('#peek-paws-front'),
peekChin: svgElement.querySelector('#peek-chin-overlap'),
peekTicks: svgElement.querySelector('#peek-action-ticks'),
peekHitbox: svgElement.querySelector('#peek-cat-hitbox'),
// Floor Cat
floorTail: svgElement.querySelector('#floor-tail-pivot'),
floorBody: svgElement.querySelector('#floor-body-pivot'),
floorHindLegR: svgElement.querySelector('#floor-hind-leg-r'),
floorHead: svgElement.querySelector('#floor-head-group'),
floorEarL: svgElement.querySelector('#floor-ear-l'),
floorEarR: svgElement.querySelector('#floor-ear-r'),
floorEyesBlink: svgElement.querySelector('#floor-eyes-blink'),
floorPupilU: svgElement.querySelector('#floor-pupil-u'),
floorPupilL: svgElement.querySelector('#floor-pupil-l'),
floorPawSwipe: svgElement.querySelector('#floor-paw-swipe'),
floorTicks: svgElement.querySelector('#floor-action-ticks'),
floorHitbox: svgElement.querySelector('#floor-cat-hitbox'),
// Yarn System
yarnGroup: svgElement.querySelector('#yarn-ball-group'),
yarnRotator: svgElement.querySelector('#yarn-ball-rotator'),
yarnStringRight: svgElement.querySelector('#yarn-string-right'),
yarnStringLeft: svgElement.querySelector('#yarn-string-left'),
yarnHitbox: svgElement.querySelector('#yarn-hitbox')
};
// Internal animation state
this.state = {
pointerSvg: { x: 420, y: 380 },
lastPointerMoveTime: 0,
isPointerActive: false,
// Smoothed gaze states
peekGaze: { px: 3.2, py: -0.8, hx: 0, hy: 0, hrot: 0 },
floorGaze: { px: -2.5, py: -1.5, hx: 0, hy: 0, hrot: 0 },
// Peeking Cat Duck/Peek
peekOffsetY: 0,
peekTargetY: 0,
isPeekingDucked: false,
// Floor Cat proximity & swipe
isFloorAlert: false,
lastSwipeTime: 0,
swipeProgress: 0, // 0 = rest, >0 = active swipe curve
stretchProgress: 0,
// Yarn 1D physics
yarnX: 0,
yarnVx: 0,
yarnAngle: 0
};
this.timers = [];
this.rafId = null;
this.bindEvents();
if (!this.reducedMotion) {
this.scheduleAutonomousBehaviours();
this.startLoop();
}
}
// Utility: random float in [min, max]
rand(min, max) {
return min + Math.random() * (max - min);
}
// Convert client (screen) coordinates into SVG viewBox coordinates
clientToSvg(clientX, clientY) {
const rect = this.svg.getBoundingClientRect();
if (!rect.width || !rect.height) return { x: 325, y: 370 };
const scaleX = 650 / rect.width;
const scaleY = 740 / rect.height;
return {
x: (clientX - rect.left) * scaleX,
y: (clientY - rect.top) * scaleY
};
}
bindEvents() {
this.onPointerMove = (e) => {
if (this.reducedMotion) return;
const pt = this.clientToSvg(e.clientX, e.clientY);
this.state.pointerSvg = pt;
this.state.lastPointerMoveTime = performance.now();
this.state.isPointerActive = true;
// Check proximity to Floor Cat / Yarn Ball (center around 300, 625)
const distToFloor = Math.hypot(pt.x - 295, pt.y - 625);
this.state.isFloorAlert = distToFloor < this.cfg.floorAlertRadius;
// If pointer approaches close to the yarn/paw, occasionally swipe!
const now = performance.now();
if (
distToFloor < 125 &&
now - this.state.lastSwipeTime > this.cfg.autoSwipeCooldownMs
) {
this.triggerFloorSwipe(pt.x < 242 ? -1 : 1);
}
};
// Touch / Click interactions on specific hitboxes
this.onPeekClick = (e) => {
e.stopPropagation();
if (this.reducedMotion) return;
this.triggerPeekDuckCycle();
};
this.onFloorClick = (e) => {
e.stopPropagation();
if (this.reducedMotion) return;
this.triggerFloorSwipe(1);
};
this.onYarnClick = (e) => {
e.stopPropagation();
if (this.reducedMotion) return;
const dir = Math.random() > 0.5 ? 1 : -1;
this.impulseYarn(dir * this.rand(5.5, 8.2));
this.triggerFloorSwipe(dir);
};
window.addEventListener('pointermove', this.onPointerMove, { passive: true });
this.nodes.peekHitbox?.addEventListener('click', this.onPeekClick);
this.nodes.floorHitbox?.addEventListener('click', this.onFloorClick);
this.nodes.yarnHitbox?.addEventListener('click', this.onYarnClick);
}
// Schedule non-robotic recursive timeouts
schedule(fn, range) {
const id = window.setTimeout(() => {
fn();
this.schedule(fn, range);
}, this.rand(range[0], range[1]));
this.timers.push(id);
}
scheduleAutonomousBehaviours() {
// 1. Peeking Cat Blinking
this.schedule(() => this.blinkCat(this.nodes.peekEyesBlink, 0, -25), this.cfg.blinkInterval);
// 2. Floor Cat Blinking
this.schedule(() => this.blinkCat(this.nodes.floorEyesBlink, 0, 0), this.cfg.blinkInterval);
// 3. Ear Twitches (Independent for all 4 ears)
this.schedule(() => this.twitchEar(this.nodes.peekEarL, -40, -52, -9), this.cfg.earTwitchInterval);
this.schedule(() => this.twitchEar(this.nodes.peekEarR, 38, -54, 9), this.cfg.earTwitchInterval);
this.schedule(() => this.twitchEar(this.nodes.floorEarL, 4, -46, -8), this.cfg.earTwitchInterval);
this.schedule(() => this.twitchEar(this.nodes.floorEarR, 44, -8, 8), this.cfg.earTwitchInterval);
// 4. Peeking Cat Duck & Peek-a-Boo
this.schedule(() => {
if (!this.state.isPeekingDucked) {
this.triggerPeekDuckCycle();
}
}, this.cfg.peekDuckInterval);
// 5. Floor Cat Idle Stretch or Play with Yarn
this.schedule(() => {
if (!this.state.isFloorAlert && this.state.swipeProgress <= 0) {
if (Math.random() < 0.55) {
this.triggerFloorSwipe(Math.random() > 0.4 ? -1 : 1);
} else {
this.triggerFloorStretch();
}
}
}, this.cfg.floorIdleInterval);
}
// Natural single or occasional double blink
blinkCat(eyeGroupNode, baseX, baseY) {
if (!eyeGroupNode) return;
const setScale = (sy) => {
eyeGroupNode.setAttribute(
'transform',
`translate(${baseX}, ${baseY}) scale(1, ${sy})`
);
};
setScale(0.08);
const t1 = window.setTimeout(() => setScale(1), 130);
this.timers.push(t1);
// 20% chance of a quick double-blink
if (Math.random() < 0.2) {
const t2 = window.setTimeout(() => setScale(0.08), 260);
const t3 = window.setTimeout(() => setScale(1), 380);
this.timers.push(t2, t3);
}
}
// Quick double ear flick
twitchEar(earNode, bx, by, deg) {
if (!earNode) return;
earNode.setAttribute('transform', `translate(${bx}, ${by}) rotate(${deg})`);
const t1 = window.setTimeout(() => {
earNode.setAttribute('transform', `translate(${bx}, ${by}) rotate(${-deg * 0.4})`);
}, 110);
const t2 = window.setTimeout(() => {
earNode.setAttribute('transform', `translate(${bx}, ${by}) rotate(0)`);
}, 220);
this.timers.push(t1, t2);
}
// Top Cat ducks behind the FAQ board and peeks back up
triggerPeekDuckCycle() {
if (this.state.isPeekingDucked) return;
this.state.isPeekingDucked = true;
this.state.peekTargetY = 66; // Slide down behind opaque white board
if (this.nodes.peekTicks) this.nodes.peekTicks.style.opacity = '0';
if (this.nodes.peekChin) this.nodes.peekChin.style.opacity = '0';
const hideTime = this.rand(
this.cfg.peekHiddenDuration[0],
this.cfg.peekHiddenDuration[1]
);
const t = window.setTimeout(() => {
this.state.peekTargetY = 0;
this.state.isPeekingDucked = false;
if (this.nodes.peekTicks) this.nodes.peekTicks.style.opacity = '1';
if (this.nodes.peekChin) this.nodes.peekChin.style.opacity = '1';
this.twitchEar(this.nodes.peekEarL, -40, -52, -7);
this.twitchEar(this.nodes.peekEarR, 38, -54, 7);
}, hideTime);
this.timers.push(t);
}
// Floor Cat bats at the yarn ball / pointer
triggerFloorSwipe(direction = -1) {
this.state.lastSwipeTime = performance.now();
this.state.swipeProgress = 1.0;
// Nudge the yarn ball after the paw reaches the bottom of its arc
const t = window.setTimeout(() => {
this.impulseYarn(direction * this.rand(4.2, 6.8));
}, 140);
this.timers.push(t);
}
// Floor Cat cozy stretch & roll
triggerFloorStretch() {
this.state.stretchProgress = 1.0;
}
// Apply horizontal velocity impulse to the yarn ball
impulseYarn(vx) {
this.state.yarnVx += vx;
}
startLoop() {
const tick = (now) => {
this.updateFrame(now);
this.rafId = window.requestAnimationFrame(tick);
};
this.rafId = window.requestAnimationFrame(tick);
}
updateFrame(now) {
const t = now * 0.001;
const s = this.state;
const cfg = this.cfg;
// Check if pointer has been idle
if (s.isPointerActive && now - s.lastPointerMoveTime > cfg.pointerIdleTimeoutMs) {
s.isPointerActive = false;
s.isFloorAlert = false;
}
// -----------------------------------------------------------------
// 1. PEEKING CAT ANIMATION (Gaze, Head, Tail, Ducking)
// -----------------------------------------------------------------
const peekOrigin = { x: 268, y: 145 };
let peekTargetPx = 3.2;
let peekTargetPy = -0.8;
let peekTargetHx = 0;
let peekTargetHy = 0;
let peekTargetRot = 0;
if (s.isPointerActive && !s.isPeekingDucked) {
const dx = s.pointerSvg.x - peekOrigin.x;
const dy = s.pointerSvg.y - peekOrigin.y;
const dist = Math.hypot(dx, dy) || 1;
const factor = Math.min(dist / 220, 1);
peekTargetPx = (dx / dist) * cfg.maxPupilOffset * factor;
peekTargetPy = (dy / dist) * cfg.maxPupilOffset * factor;
peekTargetHx = (dx / dist) * cfg.maxHeadShift * factor;
peekTargetHy = (dy / dist) * (cfg.maxHeadShift * 0.7) * factor;
peekTargetRot = Math.max(-cfg.maxHeadTiltDeg, Math.min(cfg.maxHeadTiltDeg, dx * 0.012));
}
// Smooth interpolation
s.peekGaze.px += (peekTargetPx - s.peekGaze.px) * cfg.trackingSmoothing;
s.peekGaze.py += (peekTargetPy - s.peekGaze.py) * cfg.trackingSmoothing;
s.peekGaze.hx += (peekTargetHx - s.peekGaze.hx) * cfg.trackingSmoothing;
s.peekGaze.hy += (peekTargetHy - s.peekGaze.hy) * cfg.trackingSmoothing;
s.peekGaze.hrot += (peekTargetRot - s.peekGaze.hrot) * cfg.trackingSmoothing;
// Smooth ducking interpolation
s.peekOffsetY += (s.peekTargetY - s.peekOffsetY) * 0.11;
this.nodes.peekRoot?.setAttribute(
'transform',
`translate(285, ${(162 + s.peekOffsetY).toFixed(2)})`
);
this.nodes.peekHead?.setAttribute(
'transform',
`translate(${s.peekGaze.hx.toFixed(2)}, ${s.peekGaze.hy.toFixed(2)}) rotate(${s.peekGaze.hrot.toFixed(2)})`
);
this.nodes.peekPupilL?.setAttribute('cx', s.peekGaze.px.toFixed(2));
this.nodes.peekPupilL?.setAttribute('cy', s.peekGaze.py.toFixed(2));
this.nodes.peekPupilR?.setAttribute('cx', s.peekGaze.px.toFixed(2));
this.nodes.peekPupilR?.setAttribute('cy', s.peekGaze.py.toFixed(2));
// Organic dual-sine tail sway for Peeking Cat
const peekTailAngle = Math.sin(t * 1.4) * 5.5 + Math.sin(t * 2.9) * 2.5;
this.nodes.peekTail?.setAttribute(
'transform',
`translate(68, 4) rotate(${peekTailAngle.toFixed(2)})`
);
// -----------------------------------------------------------------
// 2. FLOOR CAT ANIMATION (Gaze, Alertness, Tail, Stretch, Swipe)
// -----------------------------------------------------------------
const floorHeadOrigin = { x: 362, y: 616 };
// Default resting gaze looks playfully toward the yarn ball (242, 642)
const targetPt = s.isPointerActive
? s.pointerSvg
: { x: 242 + s.yarnX, y: 642 };
const fdx = targetPt.x - floorHeadOrigin.x;
const fdy = targetPt.y - floorHeadOrigin.y;
const fdist = Math.hypot(fdx, fdy) || 1;
const fFactor = Math.min(fdist / 200, 1);
// Rotate vector by -52deg because the floor cat's head is lying playfully on its side
const rawPx = (fdx / fdist) * cfg.maxPupilOffset * fFactor;
const rawPy = (fdy / fdist) * cfg.maxPupilOffset * fFactor;
const floorTargetHx = (fdx / fdist) * cfg.maxHeadShift * fFactor;
const floorTargetHy = (fdy / fdist) * cfg.maxHeadShift * fFactor;
const floorTargetRot = Math.max(
-cfg.maxHeadTiltDeg,
Math.min(cfg.maxHeadTiltDeg, (fdy - fdx) * 0.01)
);
s.floorGaze.px += (rawPx - s.floorGaze.px) * cfg.trackingSmoothing;
s.floorGaze.py += (rawPy - s.floorGaze.py) * cfg.trackingSmoothing;
s.floorGaze.hx += (floorTargetHx - s.floorGaze.hx) * cfg.trackingSmoothing;
s.floorGaze.hy += (floorTargetHy - s.floorGaze.hy) * cfg.trackingSmoothing;
s.floorGaze.hrot += (floorTargetRot - s.floorGaze.hrot) * cfg.trackingSmoothing;
this.nodes.floorHead?.setAttribute(
'transform',
`translate(${(362 + s.floorGaze.hx).toFixed(2)}, ${(616 + s.floorGaze.hy).toFixed(2)}) rotate(${s.floorGaze.hrot.toFixed(2)})`
);
this.nodes.floorPupilU?.setAttribute('cx', s.floorGaze.px.toFixed(2));
this.nodes.floorPupilU?.setAttribute('cy', s.floorGaze.py.toFixed(2));
this.nodes.floorPupilL?.setAttribute('cx', s.floorGaze.px.toFixed(2));
this.nodes.floorPupilL?.setAttribute('cy', s.floorGaze.py.toFixed(2));
// Floor Cat Tail Sway (speeds up slightly when pointer is nearby)
const tailSpeed = s.isFloorAlert ? 2.8 : 1.25;
const tailAmp = s.isFloorAlert ? 7.5 : 4.2;
const floorTailAngle =
Math.sin(t * tailSpeed) * tailAmp + Math.cos(t * tailSpeed * 1.7) * 2.2;
this.nodes.floorTail?.setAttribute(
'transform',
`translate(152, 636) rotate(${floorTailAngle.toFixed(2)})`
);
// Cozy Stretch & Hind Leg Curl
if (s.stretchProgress > 0) {
s.stretchProgress = Math.max(0, s.stretchProgress - 0.012);
}
const stretchCurve = Math.sin(s.stretchProgress * Math.PI);
const bodyRollDeg = Math.sin(t * 0.9) * 0.8 - stretchCurve * 3.5;
const legStretchDeg = Math.sin(t * 1.1) * 2.5 - stretchCurve * 14;
this.nodes.floorBody?.setAttribute(
'transform',
`translate(222, 626) rotate(${bodyRollDeg.toFixed(2)})`
);
this.nodes.floorHindLegR?.setAttribute(
'transform',
`translate(2, -34) rotate(${legStretchDeg.toFixed(2)})`
);
// Front Swiping Paw Animation
if (s.swipeProgress > 0) {
s.swipeProgress = Math.max(0, s.swipeProgress - 0.045);
}
const swipeArc = Math.sin(s.swipeProgress * Math.PI);
const alertCrouchDeg = s.isFloorAlert ? 6 : 0;
const pawRot = -swipeArc * 26 + alertCrouchDeg;
const pawTx = 312 - swipeArc * 10;
const pawTy = 608 + swipeArc * 8;
this.nodes.floorPawSwipe?.setAttribute(
'transform',
`translate(${pawTx.toFixed(2)}, ${pawTy.toFixed(2)}) rotate(${pawRot.toFixed(2)})`
);
// -----------------------------------------------------------------
// 3. YARN BALL ROLLING PHYSICS & TRAILING STRING WAVE
// -----------------------------------------------------------------
// Restoring spring toward x = 0 + damping
const springForce = -s.yarnX * cfg.yarnSpringStiffness;
s.yarnVx = (s.yarnVx + springForce) * cfg.yarnFriction;
s.yarnX += s.yarnVx;
// Clamp within sensible bounds
if (s.yarnX > cfg.yarnMaxRollX) {
s.yarnX = cfg.yarnMaxRollX;
s.yarnVx *= -0.5;
} else if (s.yarnX < -cfg.yarnMaxRollX) {
s.yarnX = -cfg.yarnMaxRollX;
s.yarnVx *= -0.5;
}
// Convert horizontal travel to rolling degrees (arc length / radius)
s.yarnAngle = (s.yarnX / 35) * (180 / Math.PI);
if (Math.abs(s.yarnX) > 0.02 || Math.abs(s.yarnVx) > 0.02) {
this.nodes.yarnGroup?.setAttribute(
'transform',
`translate(${(242 + s.yarnX).toFixed(2)}, 642)`
);
this.nodes.yarnRotator?.setAttribute(
'transform',
`rotate(${s.yarnAngle.toFixed(2)})`
);
// Dynamically ripple the attached yarn strings
const wave = Math.sin(t * 10) * Math.min(Math.abs(s.yarnVx) * 2.5, 6);
const rightAttachX = (262 + s.yarnX * 0.85).toFixed(1);
const leftAttachX = (214 + s.yarnX * 0.85).toFixed(1);
this.nodes.yarnStringRight?.setAttribute(
'd',
`M ${rightAttachX} 660 C ${(292 + s.yarnX * 0.4).toFixed(1)} ${(642 + wave).toFixed(1)}, 326 ${(654 - wave).toFixed(1)}, 360 680 C 392 704, 436 676, 462 692 C 474 698, 464 710, 452 704`
);
this.nodes.yarnStringLeft?.setAttribute(
'd',
`M ${leftAttachX} 662 C ${(196 + s.yarnX * 0.5).toFixed(1)} ${(668 + wave * 0.5).toFixed(1)}, 192 684, 162 683`
);
}
}
// Clean teardown if removed from DOM
destroy() {
if (this.rafId) window.cancelAnimationFrame(this.rafId);
this.timers.forEach((id) => window.clearTimeout(id));
window.removeEventListener('pointermove', this.onPointerMove);
this.nodes.peekHitbox?.removeEventListener('click', this.onPeekClick);
this.nodes.floorHitbox?.removeEventListener('click', this.onFloorClick);
this.nodes.yarnHitbox?.removeEventListener('click', this.onYarnClick);
}
}
const instance = new InteractiveCatsController(svgElement); return () => instance.destroy();
}

