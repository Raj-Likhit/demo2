"use client";

import { useEffect, useRef } from "react";
import { faqSvgMarkup } from "@/components/sections/faq-art";
import { installFaqCatAnimation } from "@/components/sections/faq-cat-animation";

export default function FaqCatBoard() {
  const svgHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgHost.current?.querySelector("svg");
    return svg ? installFaqCatAnimation(svg) : undefined;
  }, []);

  return (
    <aside className="dc-faq-visual-col" aria-label="Illustrated FAQ board with two playful cats">
      <div ref={svgHost} className="dc-faq-svg-host" dangerouslySetInnerHTML={{ __html: faqSvgMarkup }} />
    </aside>
  );
}
