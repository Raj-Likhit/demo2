"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as d3 from "d3";
import { feature } from "topojson-client";
import { useEffect, useRef, useState } from "react";

type GlobeProps = { className?: string; autoRotate?: boolean; autoRotateSpeed?: number; strokeWidth?: number; graticuleOpacity?: number; variant?: "wireframe" | "wireframesolid" | "solid"; enableInteraction?: boolean };

export default function GlobeWireframe({ className = "aspect-square w-full", autoRotate = true, autoRotateSpeed = .5, strokeWidth = 1, graticuleOpacity = .2, variant = "wireframe", enableInteraction = true }: GlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(320);
  const rotation = useRef<[number, number]>([0, 0]);
  const dragging = useRef(false);
  const pointer = useRef<[number, number]>([0, 0]);
  const [world, setWorld] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((response) => response.json()).then((data) => { const countries = feature(data as any, data.objects.countries as any) as any; setWorld(countries.features ?? []); }).catch(() => setWorld([]));
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const resize = () => setSize(Math.max(240, node.clientWidth || 320));
    resize(); const observer = new ResizeObserver(resize); observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const tick = () => { if (autoRotate && !dragging.current) { rotation.current = [(rotation.current[0] + autoRotateSpeed) % 360, rotation.current[1]]; draw(); } frame = requestAnimationFrame(tick); };
    const draw = () => {
      const svg = svgRef.current; if (!svg) return;
      const root = d3.select(svg); root.selectAll("*").remove();
      const radius = size * .43;
      const projection = d3.geoOrthographic().scale(radius).translate([size / 2, size / 2]).rotate([-rotation.current[0], -rotation.current[1]]).clipAngle(90).precision(.2);
      const path = d3.geoPath(projection);
      root.append("circle").attr("cx", size / 2).attr("cy", size / 2).attr("r", radius).attr("fill", variant === "solid" ? "#111" : "#fafafa").attr("stroke", "currentColor").attr("stroke-width", 1.5);
      if (variant !== "wireframesolid") root.append("path").datum(d3.geoGraticule()()).attr("d", path as any).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-opacity", graticuleOpacity).attr("stroke-width", .7);
      root.selectAll(".country").data(world).enter().append("path").attr("class", "country").attr("d", (feature: any) => path(feature) || "").attr("fill", variant === "solid" ? "currentColor" : "none").attr("fill-opacity", variant === "solid" ? .22 : 0).attr("stroke", "currentColor").attr("stroke-opacity", variant === "solid" ? .35 : .7).attr("stroke-width", strokeWidth);
      root.append("path").datum({ type: "Sphere" }).attr("d", path as any).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 1.5);
    };
    draw(); frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [size, world, autoRotate, autoRotateSpeed, strokeWidth, graticuleOpacity, variant]);

  const point = (event: React.PointerEvent) => { const rect = svgRef.current?.getBoundingClientRect(); if (rect) pointer.current = [event.clientX - rect.left, event.clientY - rect.top]; };
  return <div ref={wrapRef} className={`relative ${className}`}><svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className="h-full w-full" onPointerDown={(event) => { if (!enableInteraction) return; dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); point(event); }} onPointerMove={(event) => { if (!dragging.current) return; const rect = svgRef.current?.getBoundingClientRect(); if (!rect) return; const next: [number, number] = [event.clientX - rect.left, event.clientY - rect.top]; rotation.current = [rotation.current[0] - (next[0] - pointer.current[0]) * .45, Math.max(-80, Math.min(80, rotation.current[1] + (next[1] - pointer.current[1]) * .45))]; pointer.current = next; }} onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }} role="img" aria-label="Interactive wireframe globe" /></div>;
}
