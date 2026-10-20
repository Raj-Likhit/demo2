"use client"

import React from "react"

export type FaqItem = { id: string; question: string; answer: string }
export type FaqRow = { id: string; speed?: string; direction?: "left" | "right"; faqItems: FaqItem[] }
export type FaqData = { mainTitle: string; mainSubtitle: string; rows: FaqRow[] }

export const FaqCard = ({ question, answer }: Omit<FaqItem, "id">) => (
  <article className="faq-card flex w-96 shrink-0 flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-lg">
    <h3 className="faq-title text-xl font-bold text-black">{question}</h3>
    <p className="faq-answer text-base leading-7 text-gray-700">{answer}</p>
  </article>
)

export function HorizontalScroller({ children, speed = "40s", direction = "left" }: { children: React.ReactNode; speed?: string; direction?: "left" | "right" }) {
  const style = { "--scroll-duration": speed } as React.CSSProperties
  const animation = direction === "right" ? "animate-scroll-horizontal-reverse" : "animate-scroll-horizontal"
  return <div className="scroller-mask group relative w-full overflow-hidden"><div className={`flex ${animation} w-max`} style={style}><div className="flex shrink-0 items-stretch justify-center gap-6 px-4">{children}</div><div className="flex shrink-0 items-stretch justify-center gap-6 px-4" aria-hidden="true">{children}</div></div></div>
}

export default function FaqSection({ data }: { data: FaqData }) {
  return <section className="relative flex w-full max-w-6xl flex-col items-center gap-12 p-6 sm:p-10"><div className="z-10 flex max-w-2xl flex-col items-center gap-5 text-center"><h2 className="animate-fade-in-up text-4xl font-semibold leading-tight tracking-[-0.05em] text-[#15251a] sm:text-6xl">{data.mainTitle}</h2><p className="animate-fade-in-up text-base leading-7 text-slate-600 [animation-delay:180ms] sm:text-lg">{data.mainSubtitle}</p></div><div className="z-10 flex w-full flex-col gap-8">{data.rows.map((row) => <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>{row.faqItems.map((item) => <FaqCard key={item.id} question={item.question} answer={item.answer} />)}</HorizontalScroller>)}</div></section>
}
