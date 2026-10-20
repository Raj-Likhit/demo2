"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

interface CrowdCanvasProps { src: string; rows?: number; cols?: number; className?: string; }

type Peep = {
  image: HTMLImageElement; rect: number[]; width: number; height: number;
  x: number; y: number; anchorY: number; scaleX: number; walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void; render: (ctx: CanvasRenderingContext2D) => void;
};

export function CrowdCanvas({ src, rows = 15, cols = 7, className }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [], availablePeeps: Peep[] = [], crowd: Peep[] = [];
    const random = (min: number, max: number) => min + Math.random() * (max - min);
    const take = <T,>(list: T[]) => list.splice((Math.random() * list.length) | 0, 1)[0];

    const createPeep = (image: HTMLImageElement, rect: number[]): Peep => {
      const peep = {} as Peep;
      Object.assign(peep, {
        image, rect: [], width: 0, height: 0, x: 0, y: 0, anchorY: 0, scaleX: 1, walk: null,
        setRect(nextRect: number[]) { peep.rect = nextRect; peep.width = nextRect[2]; peep.height = nextRect[3]; },
        render(context: CanvasRenderingContext2D) {
          context.save(); context.translate(peep.x, peep.y); context.scale(peep.scaleX, 1);
          context.drawImage(peep.image, peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3], 0, 0, peep.width, peep.height);
          context.restore();
        },
      });
      peep.setRect(rect); return peep;
    };
    const reset = (peep: Peep) => {
      const right = Math.random() > 0.5;
      const y = stage.height - peep.height + 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      peep.scaleX = right ? 1 : -1; peep.x = right ? -peep.width : stage.width + peep.width; peep.y = y; peep.anchorY = y;
      return { x: right ? stage.width : 0, y };
    };
    const addPeep = () => {
      const peep = take(availablePeeps); if (!peep) return;
      const target = reset(peep);
      peep.walk = gsap.timeline({ onComplete: () => { const i = crowd.indexOf(peep); if (i >= 0) crowd.splice(i, 1); availablePeeps.push(peep); addPeep(); } })
        .timeScale(random(0.5, 1.45))
        .to(peep, { duration: 10, x: target.x, ease: "none" }, 0)
        .to(peep, { duration: 0.25, repeat: 40, yoyo: true, y: target.y - 10 }, 0);
      crowd.push(peep); crowd.sort((a, b) => a.anchorY - b.anchorY);
    };
    const render = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.save(); ctx.scale(devicePixelRatio, devicePixelRatio); crowd.forEach((peep) => peep.render(ctx)); ctx.restore(); };
    const resize = () => {
      stage.width = canvas.clientWidth; stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio; canvas.height = stage.height * devicePixelRatio;
      crowd.forEach((peep) => peep.walk?.kill()); crowd.length = 0; availablePeeps.length = 0; availablePeeps.push(...allPeeps);
      while (availablePeeps.length) addPeep();
    };
    const image = document.createElement("img");
    image.onload = () => {
      const width = image.naturalWidth / rows, height = image.naturalHeight / cols;
      for (let i = 0; i < rows * cols; i++) allPeeps.push(createPeep(image, [(i % rows) * width, ((i / rows) | 0) * height, width, height]));
      resize(); gsap.ticker.add(render);
    };
    image.src = src;
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); gsap.ticker.remove(render); crowd.forEach((peep) => peep.walk?.kill()); };
  }, [src, rows, cols]);

  return <canvas aria-hidden="true" ref={canvasRef} className={className ?? "absolute bottom-0 h-[90vh] w-full"} />;
}

export default function Skiper39() {
  return <div className="relative h-full w-full"><CrowdCanvas src="https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png" rows={15} cols={7} /></div>;
}
