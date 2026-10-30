"use client";

import * as d3 from "d3";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type GlobeProps = {
  className?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  strokeWidth?: number;
  graticuleOpacity?: number;
  variant?: "wireframe" | "wireframesolid" | "solid";
  enableInteraction?: boolean;
};

type DragState = {
  pointerId: number;
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function GlobeWireframe({
  className = "aspect-square w-full",
  autoRotate = true,
  autoRotateSpeed = 0.45,
  strokeWidth = 1,
  graticuleOpacity = 0.2,
  variant = "wireframe",
  enableInteraction = true,
}: GlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(320);
  const [world, setWorld] = useState<d3.GeoPermissibleObjects[]>([]);
  const rotation = useRef<[number, number]>([0, 0]);
  const targetRotation = useRef<[number, number]>([0, 0]);
  const drag = useRef<DragState | null>(null);
  const reducedMotion = useRef(false);
  const scheduleAnimation = useRef<() => void>(() => undefined);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Globe map data could not be loaded.");
        return response.json();
      })
      .then((data) => {
        const topology = data as Topology;
        const countries = feature(topology, topology.objects.countries as GeometryCollection);
        setWorld(countries.features);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setWorld([]);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const resize = () => {
      const nextSize = Math.max(240, node.clientWidth || 320);
      setSize((current) => (current === nextSize ? current : nextSize));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotion.current = media.matches;
      scheduleAnimation.current();
    };
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let frame = 0;
    let previousTime = 0;

    const draw = () => {
      const root = d3.select(svg);
      root.selectAll("*").remove();
      const radius = size * 0.43;
      const projection = d3.geoOrthographic()
        .scale(radius)
        .translate([size / 2, size / 2])
        .rotate([-rotation.current[0], -rotation.current[1]])
        .clipAngle(90)
        .precision(0.2);
      const path = d3.geoPath(projection);

      root.append("circle")
        .attr("cx", size / 2)
        .attr("cy", size / 2)
        .attr("r", radius)
        .attr("fill", variant === "solid" ? "#111" : "#fafafa")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1.5);

      if (variant !== "wireframesolid") {
        root.append("path")
          .datum(d3.geoGraticule()())
          .attr("d", path as never)
          .attr("fill", "none")
          .attr("stroke", "currentColor")
          .attr("stroke-opacity", graticuleOpacity)
          .attr("stroke-width", 0.7);
      }

      root.selectAll(".country")
        .data(world)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", (country) => path(country) ?? "")
        .attr("fill", variant === "solid" ? "currentColor" : "none")
        .attr("fill-opacity", variant === "solid" ? 0.22 : 0)
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", variant === "solid" ? 0.35 : 0.7)
        .attr("stroke-width", strokeWidth);

      root.append("path")
        .datum({ type: "Sphere" } as d3.GeoSphere)
        .attr("d", path as never)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1.5);
    };

    const animate = (time: number) => {
      frame = 0;
      if (!previousTime) previousTime = time;
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const isDragging = drag.current !== null;
      if (autoRotate && !isDragging && !reducedMotion.current) {
        targetRotation.current[0] = (targetRotation.current[0] + autoRotateSpeed * 60 * delta) % 360;
      }

      const easing = reducedMotion.current ? 1 : 1 - Math.exp(-delta * 14);
      let horizontalDelta = targetRotation.current[0] - rotation.current[0];
      if (horizontalDelta > 180) horizontalDelta -= 360;
      if (horizontalDelta < -180) horizontalDelta += 360;
      const verticalDelta = targetRotation.current[1] - rotation.current[1];
      const changed = Math.abs(horizontalDelta) > 0.01 || Math.abs(verticalDelta) > 0.01;

      if (changed) {
        rotation.current = [
          (rotation.current[0] + horizontalDelta * easing + 360) % 360,
          rotation.current[1] + verticalDelta * easing,
        ];
        draw();
      }

      if ((autoRotate && !reducedMotion.current) || isDragging || changed) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    scheduleAnimation.current = schedule;
    draw();
    if (autoRotate && !reducedMotion.current) schedule();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      scheduleAnimation.current = () => undefined;
    };
  }, [autoRotate, autoRotateSpeed, graticuleOpacity, size, strokeWidth, variant, world]);

  useEffect(() => {
    const cancelDrag = () => {
      if (!drag.current) return;
      drag.current = null;
      scheduleAnimation.current();
    };
    window.addEventListener("blur", cancelDrag);
    return () => window.removeEventListener("blur", cancelDrag);
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!enableInteraction || event.button !== 0 || drag.current) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    scheduleAnimation.current();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - current.x;
    const deltaY = event.clientY - current.y;
    targetRotation.current = [
      (targetRotation.current[0] - deltaX * 0.45 + 360) % 360,
      clamp(targetRotation.current[1] + deltaY * 0.45, -80, 80),
    ];
    current.x = event.clientX;
    current.y = event.clientY;
    scheduleAnimation.current();
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    scheduleAnimation.current();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!enableInteraction) return;
    const step = event.shiftKey ? 20 : 10;
    switch (event.key) {
      case "ArrowLeft":
        targetRotation.current[0] = (targetRotation.current[0] - step + 360) % 360;
        break;
      case "ArrowRight":
        targetRotation.current[0] = (targetRotation.current[0] + step) % 360;
        break;
      case "ArrowUp":
        targetRotation.current[1] = clamp(targetRotation.current[1] - step, -80, 80);
        break;
      case "ArrowDown":
        targetRotation.current[1] = clamp(targetRotation.current[1] + step, -80, 80);
        break;
      default:
        return;
    }
    event.preventDefault();
    scheduleAnimation.current();
  };

  return (
    <div
      ref={wrapRef}
      className={`relative ${className} ${enableInteraction ? "cursor-grab active:cursor-grabbing" : ""}`}
      role={enableInteraction ? "group" : undefined}
      aria-label={enableInteraction ? "Interactive globe. Drag or use the arrow keys to rotate." : undefined}
      tabIndex={enableInteraction ? 0 : undefined}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      style={{ touchAction: "pan-y" }}
    >
      <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
