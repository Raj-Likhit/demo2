"use client";

/**
 * AboutSection — DevCatalyst
 *
 * Scroll-driven "inversion circle" section, converted from
 * components/ui/inversion-circle-scroll-animation.tsx and restyled to the
 * site palette (cream #F8F6F0 / forest #0D2117).
 *
 * How it works:
 *   - A 300vh <section> is the scroll track. A sticky 100vh stage inside
 *     it stays pinned while the page scrolls past (uses window scroll,
 *     so it works as a normal section in the page flow).
 *   - Phase 1 (first viewport of the track): the forest circle rises from
 *     below the screen to dead-centre — Power4 InOut easing.
 *   - Phase 2 (second viewport): the circle expands — ease-in² — until it
 *     fills the screen.
 *   - A clip-path circle mirrors the ball exactly, revealing cream text
 *     inside the circle → colour-inversion effect.
 *   - After the track, a reveal section fades forest → cream once 35% of
 *     it enters the viewport.
 *
 * Note: ancestors must not set overflow-x:hidden (it breaks position:sticky).
 */

import { useEffect, useRef, useState } from "react";

// ─── constants ────────────────────────────────────────────────────────────────
const BALL_SIZE = 380; // px — fixed diameter during Phase 1 travel
const clamp = (v: number) => Math.min(1, Math.max(0, v));

// ─── root export ──────────────────────────────────────────────────────────────
export default function AboutSection() {
  return (
    <>
      <Styles />
      <CircleTrack />
      <RevealSection />
    </>
  );
}

// ─── CircleTrack (inversion animation) ────────────────────────────────────────
function CircleTrack() {
  const trackRef = useRef<HTMLElement>(null);
  const ballRef  = useRef<HTMLDivElement>(null);
  const clipRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const main = track.closest("main");
    const previousOverflow = main?.style.overflow;
    if (main) main.style.overflow = "clip";

    let raf = 0;

    // Written straight to the DOM via refs (no setState) so the section
    // scrolls at 60fps without re-rendering the React tree.
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const vw = track.clientWidth;
      const rect = track.getBoundingClientRect();
      const progress = clamp(-rect.top / (vh * 2));
      const eased = progress * progress;
      const yOff = (1 - eased) * (vh / 2 + BALL_SIZE / 2);
      const size = BALL_SIZE + eased * (Math.max(vw, vh) * 2.8 - BALL_SIZE);

      if (ballRef.current) {
        ballRef.current.style.width = ballRef.current.style.height = `${size}px`;
        ballRef.current.style.transform = `translate(-50%, calc(-50% + ${yOff}px))`;
      }
      if (clipRef.current) {
        clipRef.current.style.clipPath = `circle(${size / 2}px at ${vw / 2}px ${vh / 2 + yOff}px)`;
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
    <section ref={trackRef} id="about" className="dcabout-track">
      <div className="dcabout-sticky">
        {/* expanding forest circle */}
        <div ref={ballRef} className="dcabout-ball" />

        {/* dark text — always visible */}
        <div className="dcabout-layer dcabout-dark">
          <Quote />
        </div>

        {/* light text — clipped to the circle (inversion) */}
        <div ref={clipRef} className="dcabout-layer dcabout-light">
          <Quote />
        </div>
      </div>
    </section>
  );
}

// shared content for both layers (colours switch via CSS descendants)
function Quote() {
  return (
    <>
      <span className="dcabout-label">About — DevCatalyst</span>
      <blockquote>
        Curious minds,<br /><em>real projects.</em>
      </blockquote>
    </>
  );
}

// ─── RevealSection (fade forest → cream at 35% visibility) ───────────────────
function RevealSection() {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setOn(true); },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`dcabout-next${on ? " on" : ""}`}>
      <div className="dcabout-inner">
        <span className="dcabout-label">WHAT WE BELIEVE</span>
        <h2>Build with intention.<br />Ship with confidence.</h2>
        <p>
          Workshops, build nights, hackathons and open source — every session
          moves you from a blank canvas to something remarkable, together.
        </p>
        {/* point this at your contact / join anchor */}
        <a className="dcabout-btn" href="#contact">Get started →</a>
      </div>
    </section>
  );
}

// ─── styles (scoped: every rule lives under a dcabout- class) ─────────────────
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

      .dcabout-track, .dcabout-next {
        --dc-cream:#F8F6F0; --dc-ink:#12150F; --dc-forest:#0D2117;
        --dc-forest2:#152E20; --dc-lime:#7FA03C;
        font-family: Inter, system-ui, sans-serif;
      }
      .dcabout-track, .dcabout-track *, .dcabout-next, .dcabout-next * {
        box-sizing: border-box; margin: 0; padding: 0;
      }

      /* ── scroll track + pinned stage ── */
      .dcabout-track  { height: 300vh; background: var(--dc-cream); }
      .dcabout-sticky {
        position: sticky; top: 0; height: 100vh; overflow: hidden;
        background: var(--dc-cream); color: var(--dc-ink);
      }

      /* circle */
      .dcabout-ball {
        position: absolute; top: 50%; left: 50%;
        width: 380px; height: 380px; border-radius: 50%;
        background: var(--dc-forest);
        will-change: transform, width, height;
      }

      /* text layers */
      .dcabout-layer {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        text-align: center; padding: 0 1.5rem; pointer-events: none;
      }
      .dcabout-dark  { color: var(--dc-forest); z-index: 2; }
      .dcabout-light { color: var(--dc-cream);  z-index: 3; will-change: clip-path; }

      .dcabout-layer .dcabout-label { margin-bottom: 1.2rem; }
      .dcabout-label {
        font-size: .68rem; font-weight: 700; letter-spacing: .18em;
        text-transform: uppercase; color: var(--dc-lime);
      }
      .dcabout-light .dcabout-label { color: #A8C686; }

      .dcabout-layer blockquote {
        max-width: 900px; font-size: clamp(2rem, 5.4vw, 4.4rem);
        line-height: 1.04; letter-spacing: -.045em; font-weight: 750;
      }
      .dcabout-layer blockquote em { font-style: normal; color: #9A9C94; }
      .dcabout-light blockquote em { color: #B9D18F; }

      .dcabout-layer p {
        max-width: 560px; margin-top: 1.3rem;
        font-size: clamp(.9rem, 1.6vw, 1.05rem); line-height: 1.7; opacity: .72;
      }
      .dcabout-layer small {
        margin-top: 1.6rem; font-size: .62rem; letter-spacing: .2em;
        text-transform: uppercase; opacity: .5;
      }

      /* ── reveal section ── */
      .dcabout-next {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        text-align: center; padding: 7rem 2rem;
        background: var(--dc-forest); color: #fff;
        transition: background 2.4s cubic-bezier(.25,0,.1,1),
                    color      2.4s cubic-bezier(.25,0,.1,1);
      }
      .dcabout-next.on { background: var(--dc-cream); color: var(--dc-ink); }

      .dcabout-inner {
        max-width: 720px; display: flex; flex-direction: column;
        align-items: center; gap: 1.6rem;
      }
      .dcabout-inner > * {
        opacity: 0; transform: translateY(24px);
        transition: opacity .7s ease, transform .7s ease;
      }
      .dcabout-next.on .dcabout-inner > * { opacity: 1; transform: none; }
      .dcabout-next.on .dcabout-inner > *:nth-child(2) { transition-delay: .14s; }
      .dcabout-next.on .dcabout-inner > *:nth-child(3) { transition-delay: .28s; }
      .dcabout-next.on .dcabout-inner > *:nth-child(4) { transition-delay: .42s; }

      .dcabout-inner h2 {
        font-size: clamp(2rem, 5.5vw, 3.8rem);
        letter-spacing: -.045em; line-height: 1.05;
      }
      .dcabout-inner p { line-height: 1.75; opacity: .65; max-width: 560px; }

      .dcabout-btn {
        display: inline-flex; gap: .5rem; align-items: center;
        padding: .72rem 1.25rem; border-radius: 999px;
        font-size: .82rem; font-weight: 600; white-space: nowrap;
        background: var(--dc-ink); color: #fff;
        border: 1px solid var(--dc-ink); text-decoration: none; transition: .25s;
      }
      .dcabout-btn:hover { background: var(--dc-forest2); transform: translateY(-2px); }
    `}</style>
  );
}
