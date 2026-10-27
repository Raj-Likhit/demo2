
"use client";

import { useEffect, useRef } from "react";

const BALL_SIZE = 380;

function AboutInversion() {
  const trackRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const main = track.closest("main");
    const previousOverflow = main?.style.overflow;
    if (main) main.style.overflow = "clip";

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const vw = track.clientWidth;
      const progress = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / (vh * 2)));
      const centerProgress = Math.min(1, progress * 2);
      const expandProgress = Math.max(0, (progress - 0.5) * 2);
      const yOffset = (1 - centerProgress * centerProgress) * (vh / 2 + BALL_SIZE / 2);
      const size = BALL_SIZE + expandProgress * expandProgress * (Math.max(vw, vh) * 2.8 - BALL_SIZE);

      if (ballRef.current) {
        ballRef.current.style.width = ballRef.current.style.height = `${size}px`;
        ballRef.current.style.transform = `translate(-50%, calc(-50% + ${yOffset}px))`;
      }
      if (clipRef.current) {
        clipRef.current.style.clipPath = `circle(${size / 2}px at ${vw / 2}px ${vh / 2 + yOffset}px)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (main) main.style.overflow = previousOverflow ?? "";
    };
  }, []);

  return (
    <section ref={trackRef} aria-label="About DevCatalyst" className="h-[300vh] bg-catalyst-paper">
      <div className="sticky top-0 h-screen overflow-hidden bg-catalyst-paper text-center">
        <div ref={ballRef} aria-hidden="true" className="absolute left-1/2 top-1/2 rounded-full bg-catalyst-forest will-change-[width,height,transform]" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-catalyst-forest">
          <p className="font-mono text-xs uppercase tracking-[0.2em]">About — DevCatalyst</p>
          <p className="mt-5 text-[clamp(2.75rem,6vw,5.75rem)] font-semibold leading-[.98] tracking-[-.065em]">Curious minds,<br /><span className="text-catalyst-muted">real projects.</span></p>
        </div>
        <div ref={clipRef} aria-hidden="true" className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-catalyst-paper">
          <p className="font-mono text-xs uppercase tracking-[0.2em]">About — DevCatalyst</p>
          <p className="mt-5 text-[clamp(2.75rem,6vw,5.75rem)] font-semibold leading-[.98] tracking-[-.065em]">Curious minds,<br /><span className="text-catalyst-lime">real projects.</span></p>
        </div>
      </div>
    </section>
  );
}

export default function AboutSection() {
  return (
    <>
      <AboutInversion />
      <section id="about" aria-labelledby="about-title" className="flex min-h-screen items-center justify-center bg-[#f5f4ee] px-6 py-24 text-[#151610]">
        <div className="w-full max-w-[720px] text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8eaa75]">What we believe</p>
          <h2 id="about-title" className="mt-8 text-[clamp(1.7rem,3.8vw,1.9rem)] font-bold leading-[1.34] tracking-[-0.035em]">“A Place where curious minds turn ideas into real projects — a tech community that learns in public, builds together, and grows beyond the syllabus.”</h2>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em]">— The DevCatalyst Community</p>
          <div className="mt-10 flex justify-center">
            <a href="#about" className="inline-flex min-h-12 items-center rounded-full bg-[#151610] px-6 py-3 text-base font-semibold text-white transition hover:bg-catalyst-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4">Join the Community</a>
          </div>
        </div>
      </section>
    </>
  );
}
