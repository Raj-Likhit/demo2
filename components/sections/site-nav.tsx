
"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "What we do", href: "#workflow" },
  { label: "Projects", href: "#gallery" },
  { label: "Events", href: "#testimonials" },
  { label: "Team", href: "#about" },
];

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-4 top-4 z-50 sm:inset-x-6 sm:top-5"
    >
      <div className="mx-auto w-full max-w-[1060px]">
        <div
          className={`relative flex min-h-[60px] items-center justify-between gap-3 rounded-full border px-3 py-2 shadow-[0_5px_24px_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-150 transition-[background-color,box-shadow,border-color] duration-300 supports-[backdrop-filter]:bg-white/55 ${scrolled ? "border-black/[0.12] bg-white/85 shadow-[0_10px_35px_rgba(0,0,0,0.10)]" : "border-black/[0.09] bg-white/70"}`}
        >
          {/* Brand */}
          <a
            href="#home"
            onClick={closeMobileMenu}
            aria-label="DevCatalyst home"
            className="group flex min-w-0 shrink-0 items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <span className="relative grid size-9 shrink-0 place-items-center">
              <img
                src="/logo-mark.svg"
                alt=""
                aria-hidden="true"
                className="size-9 object-contain"
              />
            </span>

            <span className="text-[16px] font-semibold tracking-[-0.045em] text-black sm:text-[18px]">
              DevCatalyst
            </span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-full px-1 py-2 text-[13px] font-medium text-neutral-800 transition-colors duration-200 hover:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop primary CTA */}
          <a
            href="#about"
            className="group hidden shrink-0 items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-[12px] font-medium text-white transition-colors duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 lg:inline-flex"
          >
            Join the club
            <ArrowUpRight
              size={15}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="grid size-10 shrink-0 place-items-center text-black transition-colors hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 lg:hidden"
          >
            {mobileOpen ? (
              <X size={19} strokeWidth={1.8} />
            ) : (
              <Menu size={19} strokeWidth={1.8} />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            id="mobile-navigation"
            className={[
              "absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-3rem))] rounded-[24px] border border-black/10 bg-white/80 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/70",
              "animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden",
            ].join(" ")}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-black/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  {link.label}
                </a>
              ))}

              <a
                href="#about"
                onClick={closeMobileMenu}
                className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Join the club
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
