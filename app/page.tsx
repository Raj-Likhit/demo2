"use client";

import { useEffect, useRef, useState } from "react";
import ChromeStar from "@/components/ChromeStar";
import gsap from "gsap";

export default function HomePage() {
  const root = useRef<HTMLElement>(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem("devcatalyst-intro-played") === "true";

    if (reducedMotion || alreadyPlayed) {
      setIntroDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          sessionStorage.setItem("devcatalyst-intro-played", "true");
          setIntroDone(true);
        }
      });

      timeline
        .fromTo(".intro-tagline", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.15)
        .fromTo(".intro-star-wrap", { autoAlpha: 0, scale: 0.72, rotate: -10 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.85, ease: "back.out(1.2)" }, 0.7)
        .to(".intro-tagline", { autoAlpha: 0, y: -8, duration: 0.25 }, 1.25)
        .to(".intro-screen", { autoAlpha: 0, duration: 0.65, ease: "power2.inOut" }, 1.95)
        .fromTo(".eyebrow", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.12)
        .fromTo(".headline-line", { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.16, ease: "power4.out" }, 2.15)
        .fromTo(".hero-description", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 2.6)
        .fromTo(".hero-actions", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.78)
        .fromTo(".hero-art", { autoAlpha: 0, scale: 0.88, y: 18 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }, 2.05)
        .fromTo(".site-nav", { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 2.25);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="site-shell">
      {!introDone && (
        <div className="intro-screen" aria-label="DevCatalyst introduction">
          <p className="intro-tagline">An idea becomes impact.</p>
          <div className="intro-star-wrap">
            <ChromeStar mode="intro" />
          </div>
          <div className="intro-progress"><span /></div>
        </div>
      )}

      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="#" aria-label="DevCatalyst home">
          <span className="brand-mark"><ChromeStar mode="logo" /></span>
          <span>DevCatalyst</span>
        </a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#projects">Projects</a>
          <a href="#community">Community</a>
          <a className="nav-cta" href="#community">Join us <span aria-hidden="true">↗</span></a>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Student technology club · Matrusri Engineering College</p>
          <h1>
            <span className="headline-mask"><span className="headline-line">Build. Learn.</span></span>
            <span className="headline-mask"><span className="headline-line">Grow Together.</span></span>
          </h1>
          <p className="hero-description">
            A community of builders, learners and doers. We bring ideas to life
            through projects, events and collaboration across emerging technologies.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#events">Explore events <span>↗</span></a>
            <a className="button button-outline" href="#community">About us <span>→</span></a>
          </div>
        </div>

        <div className="hero-art" aria-label="Reflective chrome star artwork">
          <div className="art-caption art-caption-top">IDEAS<br />IN MOTION</div>
          <ChromeStar mode="hero" />
          <div className="art-caption art-caption-bottom">LEARN<br />BUILD<br />SHIP</div>
        </div>
      </section>

      <section id="events" className="below-fold">
        <p className="section-kicker">WHAT WE DO</p>
        <h2>Curiosity into creation.</h2>
        <div className="feature-grid">
          <article><span>01</span><h3>Build together</h3><p>Turn ideas into projects with a community of makers.</p></article>
          <article><span>02</span><h3>Learn by doing</h3><p>Workshops, sprints and hands-on experiences across tech.</p></article>
          <article id="projects"><span>03</span><h3>Share what ships</h3><p>Showcase your work, collaborate and grow in public.</p></article>
        </div>
      </section>

      <footer id="community" className="site-footer">
        <span>DevCatalyst</span>
        <span>Made by builders, for builders.</span>
      </footer>
    </main>
  );
}
