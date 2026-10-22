"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import {
  getStudentSpriteSheetDataUrl,
  PEEP_H,
  PEEP_W,
} from "./student-peeps";

const DEFAULT_MESSAGES = [
  "MY FIRST PR!",
  "3AM DEBUGGING",
  "24 HRS LEFT",
  "SHIPPED IT!",
  "WHO KNOWS GIT?",
  "BUILD NIGHT?",
  "MERGE CONFLICT...",
  "WORKS ON MY MACHINE",
  "TEAM OF 4",
  "ONE MORE BUG",
  "LET'S HACK!",
  "SEND THE REPO LINK",
  "LEARNING REACT",
  "BEYOND THE SYLLABUS",
];

export interface CrowdCanvasProps {
  /** Optional custom sprite sheet URL; defaults to generated Open-Peeps college students sheet */
  src?: string;
  /** Number of columns across the sprite sheet (matches Code A's `rows` convention) */
  rows?: number;
  /** Number of rows down the sprite sheet (matches Code A's `cols` convention) */
  cols?: number;
  /** Maximum number of students walking on stage at once */
  maxOnStage?: number;
  /** Texts shown in the speech bubbles */
  messages?: string[];
  /** Maximum number of speech bubbles visible at once */
  maxBubbles?: number;
}

const CrowdCanvas = ({
  src,
  rows = 15,
  cols = 7,
  maxOnStage = 30,
  messages = DEFAULT_MESSAGES,
  maxBubbles = 3,
}: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const isLowEnd =
      isMobile &&
      (device.deviceMemory !== undefined && device.deviceMemory <= 4 ||
        navigator.hardwareConcurrency <= 4 ||
        device.connection?.saveData === true);
    const spritePixelRatio = src
      ? 1
      : isMobile
        ? isLowEnd ? 1 : 1.25
        : Math.min(2, Math.max(1.5, window.devicePixelRatio || 1.5));

    const resolvedSrc =
      src ?? getStudentSpriteSheetDataUrl(rows, cols, spritePixelRatio);

    const config = {
      src: resolvedSrc,
      rows,
      cols,
      maxOnStage,
      messages,
      maxBubbles,
    };

    let disposed = false;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      naturalW: number;
      naturalH: number;
      width: number;
      height: number;
      drawArgs: unknown[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      baseScale: number;
      walk: gsap.core.Timeline | null;
      setRect: (rect: number[]) => void;
      setScale: (scale: number) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    type Bubble = {
      peep: Peep;
      walk: gsap.core.Timeline | null;
      root: HTMLDivElement;
      pop: HTMLDivElement;
      tl: gsap.core.Timeline | null;
      frozen: boolean;
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = <T,>(array: T[]) => randomRange(0, array.length) | 0;
    const removeFromArray = <T,>(array: T[], i: number) =>
      array.splice(i, 1)[0];
    const removeItemFromArray = <T,>(array: T[], item: T) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = <T,>(array: T[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = <T,>(array: T[]) =>
      array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({
      stage,
      peep,
    }: {
      stage: { width: number; height: number };
      peep: Peep;
    }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const scale = peep.baseScale * randomRange(0.92, 1.06);
      peep.setScale(scale);

      // Preserves Code A's signature `power2.in` multi-row crowd depth while
      // keeping every student's extended lower body anchored past the bottom edge.
      const depth = gsap.parseEase("power2.in")(Math.random());
      const offsetY = stage.width < 768
        ? 24 * (1 - depth)
        : src
          ? 100 - 250 * depth
          : (205 - 188 * depth) * scale;

      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY + peep.height;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({
      peep,
      props,
    }: {
      peep: Peep;
      props: { startX: number; startY: number; endX: number };
    }) => {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10 * peep.baseScale,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
      logicalW,
      logicalH,
    }: {
      image: HTMLImageElement;
      rect: number[];
      logicalW: number;
      logicalH: number;
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        naturalW: logicalW,
        naturalH: logicalH,
        width: logicalW,
        height: logicalH,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        baseScale: 1,
        walk: null,
        setRect: (nextRect: number[]) => {
          peep.rect = nextRect;
          peep.drawArgs = [
            peep.image,
            ...nextRect,
            0,
            0,
            peep.width,
            peep.height,
          ];
        },
        setScale: (scale: number) => {
          peep.width = peep.naturalW * scale;
          peep.height = peep.naturalH * scale;
        },
        render: (renderCtx: CanvasRenderingContext2D) => {
          renderCtx.save();
          renderCtx.translate(peep.x, peep.y);
          renderCtx.scale(peep.scaleX, 1);
          renderCtx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          renderCtx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
      dpr: 1,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows: sheetCols, cols: sheetRows } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = sheetCols * sheetRows;
      const rectWidth = width / sheetCols;
      const rectHeight = height / sheetRows;
      const logicalW = src ? rectWidth : PEEP_W;
      const logicalH = src ? rectHeight : PEEP_H;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % sheetCols) * rectWidth,
              ((i / sheetCols) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
            logicalW,
            logicalH,
          }),
        );
      }
    };

    const initCrowd = () => {
      // Cap the number of peeps on stage so the crowd stays sparse
      const stageLimit = Math.min(
        config.maxOnStage,
        stage.width < 768 ? (isLowEnd ? 2 : 4) : config.maxOnStage,
      );
      while (availablePeeps.length && crowd.length < stageLimit) {
        const peep = addPeepToCrowd();
        peep.walk?.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    // SPEECH BUBBLES (from Code B)
    // Fraction of the sprite height (from its top) where the bubble tail points.
    const BUBBLE_HEAD_OFFSET = src ? 0.1 : 0.06;

    const BUBBLE_CSS =
      "position:relative;white-space:nowrap;padding:0.3em 0.8em 0.2em;" +
      "background:#fff;color:#000;border:2px solid #000;" +
      "border-radius:18px 22px 16px 24px / 22px 16px 24px 18px;" +
      "box-shadow:3px 3px 0 #000;font-size:clamp(13px,1.3vw,19px);" +
      "letter-spacing:0.04em;line-height:1.2;";

    const TAIL_SVG =
      '<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true" ' +
      'style="position:absolute;left:50%;bottom:-12px;margin-left:-9px;overflow:visible">' +
      '<path d="M2 0 C5 6 8 10 9 13 C11 9 14 5 16 0" fill="#fff" stroke="#000" ' +
      'stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';

    const bubbles: Bubble[] = [];
    let bag: string[] = [];
    let speakTimer: gsap.core.Tween | null = null;

    // Shuffle-bag: every message is used once before any repeats
    const nextMessage = () => {
      if (!bag.length) bag = [...config.messages];
      return removeRandomFromArray(bag);
    };

    // Horizontal center of a peep (accounts for the flipped sprite)
    const peepCenterX = (peep: Peep) =>
      peep.x + (peep.scaleX * peep.width) / 2;

    const placeBubble = (b: Bubble) => {
      const halfWidth = b.root.offsetWidth / 2;
      const x = Math.round(
        Math.max(halfWidth + 4, Math.min(stage.width - halfWidth - 4, peepCenterX(b.peep))),
      );
      const y = Math.round(
        Math.max(
          b.root.offsetHeight + 4,
          b.peep.y + b.peep.height * BUBBLE_HEAD_OFFSET,
        ),
      );
      b.root.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
    };

    const removeBubble = (b: Bubble) => {
      b.tl?.kill();
      gsap.killTweensOf(b.pop);
      b.root.remove();
      const i = bubbles.indexOf(b);
      if (i > -1) bubbles.splice(i, 1);
    };

    // Early exit (peep left the screen or was recycled): freeze in place and pop out
    const dismissBubble = (b: Bubble) => {
      if (b.frozen) return;
      b.frozen = true;
      b.tl?.kill();
      gsap.to(b.pop, {
        scale: reduceMotion ? 1 : 0,
        opacity: 0,
        duration: 0.2,
        ease: "back.in(2)",
        onComplete: () => removeBubble(b),
      });
    };

    const clearBubbles = () => {
      [...bubbles].forEach(removeBubble);
    };

    const createBubble = (peep: Peep) => {
      if (!layer) return;
      const rot = randomRange(-4, 4);

      const root = document.createElement("div");
      root.style.cssText =
        "position:absolute;left:0;top:0;will-change:transform;";

      const pop = document.createElement("div");
      pop.style.cssText = "padding-bottom:12px;transform-origin:50% 100%;";

      const bubbleEl = document.createElement("div");
      bubbleEl.style.cssText = BUBBLE_CSS;
      bubbleEl.textContent = nextMessage();
      bubbleEl.insertAdjacentHTML("beforeend", TAIL_SVG);

      pop.appendChild(bubbleEl);
      root.appendChild(pop);
      layer.appendChild(root);

      const b: Bubble = {
        peep,
        walk: peep.walk,
        root,
        pop,
        tl: null,
        frozen: false,
      };
      bubbles.push(b);
      placeBubble(b);

      const hold = randomRange(2.4, 3.6);
      const tl = gsap.timeline({ onComplete: () => removeBubble(b) });

      if (reduceMotion) {
        tl.fromTo(pop, { opacity: 0 }, { opacity: 1, duration: 0.2 }).to(
          pop,
          { opacity: 0, duration: 0.2 },
          `+=${hold}`,
        );
      } else {
        tl.fromTo(
          pop,
          { scale: 0, rotation: rot - 8, opacity: 0 },
          {
            scale: 1,
            rotation: rot,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(2.2)",
            transformOrigin: "50% 100%",
          },
        ).to(
          pop,
          {
            scale: 0,
            rotation: rot + 6,
            opacity: 0,
            duration: 0.25,
            ease: "back.in(2)",
          },
          `+=${hold}`,
        );
      }

      b.tl = tl;
    };

    // Every ~1.2-2.4s, pick a walking student well inside the screen
    // and not close to another active bubble, and let them speak.
    const speak = () => {
      if (disposed) return;

      const limit = stage.width < 768
        ? Math.min(config.maxBubbles, 1)
        : config.maxBubbles;

      if (bubbles.length < limit && config.messages.length > 0) {
        const margin = Math.min(120, stage.width * 0.2);
        const gap = Math.min(200, stage.width * 0.35);

        const candidates = crowd.filter((p) => {
          const cx = peepCenterX(p);
          const progress = p.walk ? p.walk.progress() : 1;
          return (
            progress > 0.05 &&
            progress < 0.6 &&
            cx > margin &&
            cx < stage.width - margin &&
            !bubbles.some(
              (b) => b.peep === p || Math.abs(peepCenterX(b.peep) - cx) < gap,
            )
          );
        });

        if (candidates.length) createBubble(getRandomFromArray(candidates));
      }

      speakTimer = gsap.delayedCall(randomRange(1.2, 2.4), speak);
    };

    // Runs every frame: keep each bubble attached to its walking speaker
    const updateBubbles = () => {
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (b.frozen) continue;

        const cx = peepCenterX(b.peep);
        const stillWalking = crowd.includes(b.peep) && b.peep.walk === b.walk;

        if (!stillWalking || cx < 60 || cx > stage.width - 60) {
          dismissBubble(b);
          continue;
        }
        placeBubble(b);
      }
    };

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(stage.dpr, stage.dpr);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
      updateBubbles();
    };

    const resize = () => {
      if (!canvas) return;
      clearBubbles();

      stage.dpr = Math.min(isLowEnd ? 1 : 2, window.devicePixelRatio || 1);
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * stage.dpr;
      canvas.height = stage.height * stage.dpr;

      // Responsive student sizing on phones vs desktop
      const baseScale = stage.width < 768
        ? Math.min(
            (stage.height * 0.64) / PEEP_H,
            (stage.width * 0.46) / PEEP_W,
            0.95,
          )
        : 1;
      allPeeps.forEach((peep) => {
        peep.baseScale = baseScale;
        peep.setScale(baseScale);
      });

      crowd.forEach((peep) => {
        peep.walk?.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      if (disposed) return;
      createPeeps();
      resize();
      gsap.ticker.add(render);
      speakTimer = gsap.delayedCall(0.7, speak);
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => {
      if (allPeeps.length > 0) resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      img.onload = null;
      speakTimer?.kill();
      clearBubbles();
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols, maxOnStage, messages, maxBubbles]);

  return (
    <div className="absolute inset-0 w-full">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-x-clip"
      />
    </div>
  );
};

const Skiper39 = () => {
  return (
    <div className="relative h-full w-full bg-white text-black">
      <div className="top-22 absolute left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
          Crowd Canvas
        </span>
      </div>
      <div className="absolute bottom-0 h-full w-screen">
        <CrowdCanvas rows={15} cols={7} maxOnStage={30} maxBubbles={3} />
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };
export default Skiper39;
