"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ArcGalleryHeroProps = {
  images: string[];
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
};

export function ArcGalleryHero({
  images, startAngle = 20, endAngle = 160, radiusLg = 480, radiusMd = 360,
  radiusSm = 260, cardSizeLg = 120, cardSizeMd = 100, cardSizeSm = 80, className = "",
}: ArcGalleryHeroProps) {
  const [dimensions, setDimensions] = useState({ radius: radiusLg, cardSize: cardSizeLg });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDimensions(width < 640 ? { radius: radiusSm, cardSize: cardSizeSm } : width < 1024 ? { radius: radiusMd, cardSize: cardSizeMd } : { radius: radiusLg, cardSize: cardSizeLg });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section className={`relative flex min-h-screen flex-col overflow-hidden bg-[#f8f7f4] text-[#15251a] ${className}`}>
      <div className="relative mx-auto w-full" style={{ height: dimensions.radius * 1.2 }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {images.map((src, i) => {
            const angle = startAngle + step * i;
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * dimensions.radius;
            const y = Math.sin(radians) * dimensions.radius;
            return <div key={src} className="absolute animate-arc-in opacity-0" style={{ width: dimensions.cardSize, height: dimensions.cardSize, left: `calc(50% + ${x}px)`, bottom: `${y}px`, transform: "translate(-50%, 50%)", animationDelay: `${i * 100}ms`, animationFillMode: "forwards", zIndex: count - i }}>
              <div className="size-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-[#d9dfd3] transition-transform duration-300 hover:scale-105" style={{ transform: `rotate(${angle / 4}deg)` }}>
                <img src={src} alt={`DevCatalyst team moment ${i + 1}`} className="block size-full object-cover" draggable={false} onError={(event) => { event.currentTarget.src = "https://cdn.21st.dev/assets/mirror/43/43787263c53801c9064e1f3209488a5f4bd83986c0bb01223176c57bb99f959b.svg"; }} />
              </div>
            </div>;
          })}
        </div>
      </div>
      <div className="relative z-10 -mt-40 flex flex-1 items-center justify-center px-6 md:-mt-52 lg:-mt-64">
        <div className="animate-content-in max-w-2xl px-6 text-center opacity-0" style={{ animationDelay: "800ms", animationFillMode: "forwards" }}>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#65a51f]">Our story</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">A better way to make things together.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">DevCatalyst began with a small belief: productive software should make room for the messy, brilliant human work behind every release.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/" className="w-full rounded-full bg-[#15251a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#28402f] sm:w-auto">Meet the product</Link><a href="mailto:hello@devcatalyst.com" className="w-full rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium transition hover:bg-slate-100 sm:w-auto">Join our journey</a></div>
        </div>
      </div>
      <style>{`
        @keyframes arc-in { from { opacity: 0; transform: translate(-50%, 60%); } to { opacity: 1; transform: translate(-50%, 50%); } }
        @keyframes content-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-arc-in { animation: arc-in .8s ease-out; }
        .animate-content-in { animation: content-in .8s ease-out; }
      `}</style>
    </section>
  );
}
