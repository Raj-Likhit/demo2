"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { useRef } from "react";

const testimonials = [
  ["Hypersphere has been a game-changer for us. Their service is top-notch and their team is incredibly responsive.", "Guillermo Rauch", "CEO of Enigma", "#c9ff75"],
  ["We've seen incredible results with Hypersphere. Their expertise and dedication have transformed our workflow.", "Rika Shinoda", "CEO of Kintsugi", "#2563eb"],
  ["Their team is highly professional, and their innovative solutions have truly transformed the way we operate.", "Reacher", "CEO of OdeaoLabs", "#111111"],
  ["We're extremely satisfied with Hypersphere. Their expertise and dedication have exceeded our expectations.", "John", "CEO of Labsbo", "#111111"],
  ["Their customer support is absolutely exceptional. They are always available and incredibly helpful.", "Steven Sunny", "CEO of boxefi", "#111111"],
  ["Hypersphere has been a key partner in our growth journey.", "Guillermo Rauch", "CEO of OdeaoLabs", "#2563eb"],
  ["Hypersphere has been a true game-changer for us. Their exceptional service and commitment to excellence made a significant impact.", "Paul Brauch", "CTO of Spectrum", "#c9ff75"],
] as const;

function TestimonialCard({ item, index }: { item: (typeof testimonials)[number]; index: number }) {
  const [quote, name, role, color] = item;
  const dark = color === "#111111";
  return <TimelineContent animationNum={index} className="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-black/10 p-6" style={{ backgroundColor: color, color: dark || color === "#2563eb" ? "white" : "#15251a" }}><div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(to right,#fff3 1px,transparent 1px),linear-gradient(to bottom,#fff3 1px,transparent 1px)", backgroundSize: "42px 42px" }} /><article className="relative mt-auto"><p className="text-sm leading-6">“{quote}”</p><div className="flex items-end justify-between gap-4 pt-5"><div><h3 className="font-semibold">{name}</h3><p className="text-sm opacity-70">{role}</p></div><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/20 text-lg font-semibold">{name[0]}</div></div></article></TimelineContent>;
}

export default function ClientFeedback() {
  const testimonialRef = useRef<HTMLDivElement>(null);
  return <main ref={testimonialRef} className="w-full bg-white py-20 text-black"><section className="container mx-auto max-w-6xl px-4"><div className="mx-auto max-w-screen-md space-y-2 text-center"><TimelineContent as="h2" animationNum={0} timelineRef={testimonialRef} className="text-3xl font-medium xl:text-4xl">Trusted by startups and the world&apos;s largest companies</TimelineContent><TimelineContent as="p" animationNum={1} timelineRef={testimonialRef} className="text-gray-500">Let&apos;s hear how ambitious teams feel about their service.</TimelineContent></div><div className="mt-10 grid gap-3 lg:grid-cols-3">{testimonials.map((item, index) => <TestimonialCard key={`${item[1]}-${index}`} item={item} index={index} />)}</div></section></main>;
}
