"use client"

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"

type Stop = { offset: number; color: string }
const VBW = 1271, VBH = 599
const DEFAULT_STOPS: Stop[] = [
  { offset: 0, color: "#340B05" }, { offset: .1827, color: "#0358F7" }, { offset: .2837, color: "#5092C7" },
  { offset: .4135, color: "#E1ECFE" }, { offset: .5866, color: "#FFD400" }, { offset: .6827, color: "#FA3D1D" },
  { offset: .8029, color: "#FD02F5" }, { offset: 1, color: "#FFC0FD00" },
]
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const bellHeights = (count: number, peak: number, valley: number) => Array.from({ length: count }, (_, i) => {
  const mid = (count - 1) / 2
  const t = mid === 0 ? 0 : Math.abs(i - mid) / mid
  return peak * VBH * (valley + (1 - valley) * (1 - Math.pow(t, 1.24)))
})

export interface RuixenGradientFooterProps {
  children?: ReactNode; gradientHeight?: string; minReveal?: number; bars?: number; blur?: number; peak?: number; valley?: number; stops?: Stop[]; className?: string; style?: CSSProperties
}

export function RuixenGradientFooter({ children, gradientHeight = "65vh", minReveal = .045, bars = 9, blur = 15, peak = .98, valley = .55, stops = DEFAULT_STOPS, className, style }: RuixenGradientFooterProps) {
  const uid = useId().replace(/:/g, "")
  const bandRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(minReveal)
  useEffect(() => {
    const element = bandRef.current
    if (!element) return
    const doc = element.ownerDocument, win = doc.defaultView ?? window
    const measure = () => {
      const height = element.offsetHeight || 1
      const left = doc.documentElement.scrollHeight - win.innerHeight - win.scrollY
      setProgress(minReveal + (1 - minReveal) * clamp((height - left) / height))
    }
    measure(); win.addEventListener("scroll", measure, { passive: true }); win.addEventListener("resize", measure, { passive: true })
    return () => { win.removeEventListener("scroll", measure); win.removeEventListener("resize", measure) }
  }, [minReveal])
  const colWidth = VBW / bars
  return <footer className={className} style={{ paddingBottom: gradientHeight, ...style }}>{children}<div ref={bandRef} aria-hidden style={{ position: "fixed", left: 0, right: 0, bottom: 0, height: gradientHeight, pointerEvents: "none", transformOrigin: "bottom", transform: `scaleY(${progress})`, willChange: "transform" }}><svg style={{ height: "100%", width: "100%", display: "block" }} viewBox={`0 0 ${VBW} ${VBH}`} preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id={`grad-${uid}`} x1="0" y1="1" x2="0" y2="0">{stops.map((stop, i) => <stop key={i} offset={stop.offset} stopColor={stop.color} />)}</linearGradient><filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={blur} /></filter></defs>{bellHeights(bars, peak, valley).map((height, i) => <g key={i} filter={`url(#blur-${uid})`}><rect x={i * colWidth} y={VBH - height} width={colWidth * 1.23} height={height} fill={`url(#grad-${uid})`} /></g>)}</svg></div></footer>
}
