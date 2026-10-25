"use client"

import * as React from "react"

export type ArtPreset = "aurora" | "ember" | "dusk" | "glacier" | "verdant"
export type FolderFile = { name: string; meta?: string; art?: ArtPreset; image?: string; href?: string }
export type FolderMenuItem = { label: string; onSelect?: () => void; danger?: boolean }
export type GlassFolderProps = {
  label?: string; meta?: string; tone?: "light" | "dark"; art?: ArtPreset | "none"; files?: FolderFile[]
  action?: "add" | "more" | "none"; onAdd?: (files: FolderFile[]) => FolderFile | void
  menu?: FolderMenuItem[]; labelPlacement?: "bottom-left" | "top-left" | "top-right"; defaultOpen?: boolean
  onFileSelect?: (file: FolderFile, index: number) => void; width?: number; className?: string
}

const ART: Record<ArtPreset, string> = {
  aurora: "linear-gradient(135deg,#f4efe9,#c2433f 42%,#22395e 78%,#e5edf4)",
  ember: "linear-gradient(125deg,#07090c,#3d5f68 35%,#ef4a2b 72%,#ff8a5c)",
  dusk: "linear-gradient(135deg,#120c18,#8f6c9c 38%,#b3502f 70%,#fbe7d2)",
  glacier: "linear-gradient(125deg,#fff,#9fb4c7 45%,#e8edf2 75%,#bccbd8)",
  verdant: "linear-gradient(135deg,#070b08,#4f7a5a 42%,#a7843a 72%,#fbf3d6)",
}
const DEFAULT_FILES: FolderFile[] = [{ name: "Cover — final", meta: "PNG · 4.8 MB", art: "ember" }, { name: "Moodboard", meta: "24 images", art: "dusk" }, { name: "Brief.pdf", meta: "PDF · 1.2 MB" }]

export default function GlassFolder({ label = "My Files", meta, tone = "light", art = "aurora", files: input = DEFAULT_FILES, action = "add", onAdd, menu = [], labelPlacement = "bottom-left", defaultOpen = false, onFileSelect, width = 340, className }: GlassFolderProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [files, setFiles] = React.useState(input)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const add = () => { const file = onAdd?.(files) ?? { name: `Untitled ${files.length + 1}`, meta: "Just now" }; setFiles((current) => [...current, file]) }
  const scale = width / 340
  const visible = files.slice(-4)
  return <div className={`gf-root ${tone === "dark" ? "gf-dark" : ""} ${open ? "gf-open" : ""} ${className ?? ""}`} style={{ width, height: 326 * scale }}>
    <div className="gf-stage" style={{ transform: `scale(${scale})` }}>
      <div className="gf-shadow" />
      <div className="gf-back" style={{ background: art === "none" ? undefined : ART[art] }} />
      <div className="gf-files" aria-label={`${label} contents`}>
        {visible.map((file, index) => <button key={`${file.name}-${index}`} className="gf-sheet" style={{ "--slot": visible.length === 1 ? 0 : index / (visible.length - 1) * 2 - 1, "--depth": visible.length - 1 - index } as React.CSSProperties} onClick={() => onFileSelect?.(file, files.indexOf(file))}>
          {file.image ? <img src={file.image} alt="" /> : file.art ? <span className="gf-art" style={{ background: ART[file.art] }} /> : <span className="gf-lines"><i /><i /><i /><i /></span>}
          <span className="gf-sheet-title">{file.name}</span><span className="gf-sheet-meta">{file.meta}</span>
        </button>)}
      </div>
      <div className="gf-front"><button className="gf-hit" aria-label={`${open ? "Close" : "Open"} ${label}`} aria-expanded={open} onClick={() => { setOpen(!open); setMenuOpen(false) }} /><div className={`gf-label ${labelPlacement}`}><strong>{label}</strong><small>{meta ?? `${files.length} ${files.length === 1 ? "item" : "items"}`}</small></div></div>
      {action !== "none" && <button className="gf-key" aria-label={action === "add" ? "Add a file" : "More options"} onClick={() => action === "add" ? add() : setMenuOpen(!menuOpen)}>{action === "add" ? "+" : "···"}</button>}
      {action === "more" && menuOpen && <div className="gf-menu" role="menu"><button onClick={() => { setOpen(!open); setMenuOpen(false) }}>{open ? "Close folder" : "Open folder"}</button>{menu.map((item) => <button key={item.label} className={item.danger ? "danger" : ""} onClick={() => { item.onSelect?.(); setMenuOpen(false) }}>{item.label}</button>)}</div>}
    </div>
    <style>{CSS}</style>
  </div>
}

const CSS = `
.gf-root{position:relative;display:inline-block;vertical-align:top;font-family:ui-sans-serif,system-ui;isolation:isolate;--hinge:0deg;--lift:42px;--spread:0px;--fan:0deg;--stack:15px}.gf-stage{position:absolute;inset:0;width:340px;height:272px;transform-origin:0 0;transition:transform .8s cubic-bezier(.2,.8,.2,1)}.gf-root:hover,.gf-root:focus-within{--hinge:-11deg;--lift:-34px;--spread:8px;--fan:1.4deg;--stack:10px}.gf-open{--hinge:-24deg;--lift:-96px;--spread:40px;--fan:5deg;--stack:30px}.gf-shadow{position:absolute;inset:220px 18px -6px;border-radius:50%;background:#10121855;filter:blur(22px)}.gf-back{position:absolute;inset:0;border-radius:22px;background:#e3e3e6;overflow:hidden}.gf-back:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#fff5,transparent 35%)}.gf-files{position:absolute;inset:0;z-index:5;clip-path:inset(-300px -300px 10px)}.gf-sheet{all:unset;box-sizing:border-box;position:absolute;left:34px;top:96px;width:272px;height:184px;border-radius:16px;overflow:hidden;cursor:pointer;background:linear-gradient(#fff,#f2f2f0);box-shadow:0 10px 26px -8px #0a0c143d,inset 0 1px #fff;transform-origin:50% 100%;transform:translate(calc(var(--slot) * var(--spread)),calc(var(--lift) + var(--depth) * var(--stack) * -1)) rotate(calc(var(--slot) * var(--fan)));transition:transform .75s cubic-bezier(.34,1.36,.5,1) calc(var(--depth) * 40ms)}.gf-sheet:hover{outline:2px solid #65a51f}.gf-sheet img,.gf-art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.gf-sheet-title,.gf-sheet-meta{position:absolute;z-index:2;left:14px;right:14px;top:11px;color:#18181b;text-align:left}.gf-sheet-title{font-size:12.5px;font-weight:600}.gf-sheet-meta{top:30px;font:10px ui-monospace;color:#18181b88}.gf-lines{position:absolute;inset:48px 14px}.gf-lines i{display:block;height:6px;margin:11px 0;border-radius:4px;background:#18181b14}.gf-front{position:absolute;inset:74px 0 0;z-index:10;border-radius:22px;overflow:hidden;transform-origin:50% 100%;transform:perspective(760px) rotateX(var(--hinge));transition:transform .8s cubic-bezier(.34,1.36,.5,1);backdrop-filter:blur(22px) saturate(1.5);background:linear-gradient(#fff3,#fff8 45%,#fcfcfcee)}.gf-dark .gf-front{background:linear-gradient(#12121433,#0e0e10aa 46%,#08080af0);color:#f5f5f7}.gf-hit{all:unset;position:absolute;inset:0;cursor:pointer}.gf-label{position:absolute;left:28px;bottom:32px;display:flex;flex-direction:column;gap:4px;pointer-events:none}.gf-label.top-left{top:34px;bottom:auto}.gf-label.top-right{left:auto;right:32px;top:52px;bottom:auto}.gf-label strong{font-size:18px;font-weight:500}.gf-label small{font:12px ui-monospace;color:#1414168c}.gf-dark .gf-label small{color:#f5f5f799}.gf-key{all:unset;position:absolute;right:22px;bottom:22px;z-index:12;width:58px;height:58px;border-radius:18px;display:grid;place-items:center;cursor:pointer;background:#121214;color:#fff;font-size:26px;box-shadow:0 14px 22px -8px #0009}.gf-menu{position:absolute;right:22px;bottom:90px;z-index:20;display:flex;flex-direction:column;padding:6px;min-width:176px;border-radius:16px;background:#fcfcfdbd;backdrop-filter:blur(24px);box-shadow:0 24px 48px -16px #0a0c1466}.gf-menu button{all:unset;padding:9px 12px;border-radius:10px;font-size:13px;cursor:pointer}.gf-menu button:hover{background:#18181b12}.gf-menu .danger{color:#d92d20}@media(prefers-reduced-motion:reduce){.gf-root *{transition-duration:0s!important}}
`
