"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { EVENTS, photoSource } from "./event-folder-data";
import styles from "./event-folder-gallery.module.css";

const cx = (...names: string[]) => names.map((name) => styles[name]).join(" ");

export default function EventFolderGallery() {
  const [active, setActive] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const event = active === null ? null : EVENTS[active];

  useEffect(() => {
    if (active === null) return;
    const modal = dialog.current;
    if (!modal) return;
    const overflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [active]);

  useEffect(() => {
    if (active !== null) dialog.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  }, [active, index]);

  function tilt(pointer: PointerEvent<HTMLButtonElement>) {
    if (pointer.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const button = pointer.currentTarget;
    const rect = button.parentElement!.getBoundingClientRect();
    const x = (pointer.clientX - rect.left) / rect.width * 2 - 1;
    const y = (pointer.clientY - rect.top) / rect.height * 2 - 1;
    button.style.transform = `rotate(var(--base-tilt)) rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`;
    button.style.setProperty("--front-rx", `${-14 - (1 - y) * 8}deg`);
    button.style.setProperty("--sh-x", `${10 - x * 14}px`);
    button.style.setProperty("--sh-y", `${10 - y * 12}px`);
    button.style.setProperty("--mag-x", `${x * 8}px`);
    button.style.setProperty("--mag-y", `${y * 8}px`);
  }

  function resetTilt(pointer: PointerEvent<HTMLButtonElement>) {
    const button = pointer.currentTarget;
    button.style.removeProperty("transform");
    ["--front-rx", "--sh-x", "--sh-y", "--mag-x", "--mag-y"].forEach((property) => button.style.removeProperty(property));
  }

  function navigate(direction: number) {
    if (event) setIndex((current) => (current + direction + event.photos.length) % event.photos.length);
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.grid}>
        {EVENTS.map((item, itemIndex) => (
          <div className={styles["folder-wrap"]} key={item.id}>
            <button type="button" className={cx("folder", ...(active === itemIndex ? ["is-open"] : []))}
              style={{ "--base-tilt": `${item.tilt}deg` } as CSSProperties}
              aria-haspopup="dialog" aria-label={`${item.title}, ${item.photos.length} prints`}
              onPointerMove={tilt} onPointerLeave={resetTilt}
              onClick={(click) => { opener.current = click.currentTarget; setIndex(0); setActive(itemIndex); }}>
              <span className={styles.folder__shadow} />
              <span className={styles.folder__tab}>{item.tag}</span>
              <span className={styles.folder__back} />
              {item.photos.slice(0, 3).reverse().map((photo, photoIndex) => (
                <span className={cx("paper", `p${photoIndex + 1}`)} key={photo.caption}>
                  {/* Reference illustrations use inline SVG data URLs. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoSource(photo)} alt="" loading="lazy" />
                </span>
              ))}
              <span className={styles.folder__front}>
                <span className={styles.folder__badge}>{item.badge}</span>
                <span className={styles.folder__info}><strong>{item.title}</strong><em>{item.photos.length} prints · {item.date}</em></span>
                <span className={styles.folder__action}><ArrowUpRight aria-hidden="true" /></span>
              </span>
            </button>
          </div>
        ))}
      </div>
      <dialog ref={dialog} className={cx("gallery", "modal")} aria-labelledby="dossier-title"
        onCancel={() => setActive(null)}
        onClick={(click) => { if (click.target === click.currentTarget) setActive(null); }}
        onKeyDown={(key) => {
          if (key.key === "ArrowRight" || key.key === "ArrowLeft") { key.preventDefault(); navigate(key.key === "ArrowRight" ? 1 : -1); }
        }}>
        {event && <div className={styles.gal__dlg}>
          <header className={styles.gal__head}>
            <div><h3 id="dossier-title">{event.title}</h3><p>{event.date} · {event.photos.length} prints in archive</p></div>
            <button type="button" className={styles["sticker-btn"]} aria-label="Close dossier" onClick={() => setActive(null)} autoFocus><X aria-hidden="true" /></button>
          </header>
          <div className="relative">
            <button type="button" className={cx("sticker-btn", "nav-arrow", "prev")} aria-label="Previous print" onClick={() => navigate(-1)}><ChevronLeft aria-hidden="true" /></button>
            <figure className={styles.gal__viewport}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSource(event.photos[index])} alt={event.photos[index].caption} />
              <figcaption className={styles.gal__caption} aria-live="polite"><span>{event.photos[index].caption}</span><strong>{index + 1} / {event.photos.length}</strong></figcaption>
            </figure>
            <button type="button" className={cx("sticker-btn", "nav-arrow", "next")} aria-label="Next print" onClick={() => navigate(1)}><ChevronRight aria-hidden="true" /></button>
          </div>
          <div className={styles.gal__strip}>
            {event.photos.map((photo, photoIndex) => <button type="button" key={photo.caption} className={styles.thumb} aria-label={`Photo ${photoIndex + 1}: ${photo.caption}`} aria-current={index === photoIndex ? "true" : undefined} onClick={() => setIndex(photoIndex)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSource(photo)} alt="" />
            </button>)}
          </div>
        </div>}
      </dialog>
    </div>
  );
}
