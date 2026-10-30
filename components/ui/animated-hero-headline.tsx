"use client";

import { useEffect, useState } from "react";
import styles from "./animated-hero-headline.module.css";

const opening = "Build beyond";
const words = ["syllabus.", "classroom.", "tutorials.", "just theory."];
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}";

export default function AnimatedHeroHeadline() {
  const [headline, setHeadline] = useState(opening);
  const [wordIndex, setWordIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let startTimer: ReturnType<typeof setTimeout>;
    let swapTimer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const stop = () => {
      cancelAnimationFrame(frameId);
      clearTimeout(startTimer);
      clearTimeout(swapTimer);
      clearInterval(interval);
      setHeadline(opening);
      setWordIndex(0);
      setExiting(false);
    };

    const start = () => {
      stop();
      if (preference.matches) return;
      let frame = 0;
      const scramble = () => {
        setHeadline([...opening].map((char, index) =>
          char === " " || frame >= index * 1.5
            ? char
            : characters[Math.floor(Math.random() * characters.length)]
        ).join(""));
        frame += 1;
        if (frame <= 28) frameId = requestAnimationFrame(scramble);
        else setHeadline(opening);
      };
      startTimer = setTimeout(() => { frameId = requestAnimationFrame(scramble); }, 350);
      interval = setInterval(() => {
        setExiting(true);
        swapTimer = setTimeout(() => {
          setWordIndex((index) => (index + 1) % words.length);
          setExiting(false);
        }, 280);
      }, 2600);
    };

    start();
    preference.addEventListener("change", start);
    return () => {
      stop();
      preference.removeEventListener("change", start);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 id="hero-title" data-hero-title className={styles.headline}>
        <span className="sr-only">Build beyond the syllabus.</span>
        <span aria-hidden="true">
          <span className={styles.line}>
            <span className={styles.scramble}>
              <span className={styles.measure}>{opening}</span>
              <span className={styles.scrambled}>{headline}</span>
            </span>
          </span>
          <span className={`${styles.line} ${styles.muted}`}>
            the{" "}<span className={styles.rotatingWrap}>
              <span className={styles.measure}>just theory.</span>
              <span
                key={wordIndex}
                className={`${styles.rotating} ${exiting ? styles.out : styles.reveal}`}
              >
                {words[wordIndex]}
                <span className={styles.underline} />
              </span>
            </span>
          </span>
        </span>
      </h1>
    </div>
  );
}
