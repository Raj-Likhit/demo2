import { Marquee } from "@/components/ui/marquee";

const tools = ["Next.js", "TypeScript", "Tailwind", "React", "GSAP", "Three.js"];

export default function MarqueeSection() {
  return <section id="stack" className="overflow-hidden border-y border-slate-200 bg-[#f8f7f4] py-12" aria-label="Technology stack"><div className="mx-auto max-w-7xl px-6"><p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#65a51f]">Made to move with you</p><p className="mx-auto mb-5 max-w-xl text-center text-sm text-slate-500">A flexible stack for thoughtful teams who want less ceremony and more momentum.</p><Marquee pauseOnHover speed={32}><div className="flex items-center gap-14 px-7 sm:gap-24">{tools.map((tool) => <span key={tool} className="whitespace-nowrap text-2xl font-semibold tracking-[-0.04em] text-[#15251a]/70 sm:text-3xl">{tool}</span>)}</div></Marquee></div></section>;
}
