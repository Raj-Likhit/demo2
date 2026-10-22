"use client";

import React, { useEffect, useRef, useState } from "react";

type TimelineContentProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof React.JSX.IntrinsicElements;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: unknown;
};

export function TimelineContent({ as: Tag = "div", animationNum = 0, timelineRef: _timelineRef, children, className = "", style, ...props }: TimelineContentProps) {
  void _timelineRef;
  const localRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = localRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return React.createElement(Tag, { ...props, ref: localRef, className: `${className} timeline-content ${visible ? "timeline-content-visible" : ""}`, style: { animationDelay: `${animationNum * 120}ms`, ...style } }, children);
}
