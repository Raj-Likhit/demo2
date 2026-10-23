"use client";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  category: string;
  initial: string;
};

const testimonials: Testimonial[] = [
  { quote: "DevCatalyst gave me the confidence to ship my first real product. The feedback is honest, practical, and always encouraging.", name: "Aarav Mehta", role: "Core Maintainer", category: "Open Source", initial: "A" },
  { quote: "You arrive with a half-built idea and leave with a deployed link. There is no gatekeeping, just people who want to help you build.", name: "Riya Sen", role: "Frontend Developer", category: "Build Nights", initial: "R" },
  { quote: "When my backend crashed before demo night, four people pulled up chairs and helped me fix it. That kind of community is rare.", name: "Kabir Verma", role: "Systems Lead", category: "Hackathons", initial: "K" },
  { quote: "I learned more from debugging real projects here than from semesters of theory. Every session leaves me with something I can use.", name: "Naina Rao", role: "Hackathon Finalist", category: "Build Nights", initial: "N" },
  { quote: "People celebrate your smallest pull request like it matters. That made contributing feel approachable from day one.", name: "Devansh Joshi", role: "Open Source Contributor", category: "Open Source", initial: "D" },
  { quote: "The best part is the energy: curious people, thoughtful projects, and enough room to experiment without pretending to have it all figured out.", name: "Zoya Khan", role: "Creative Technologist", category: "Hackathons", initial: "Z" },
];

export default function ClientFeedback() {
  return (
    <section className="bg-white px-5 py-20 text-black sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Community feedback</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Built by curious minds.
            <span className="block text-neutral-400">Backed by the community.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
            Real people, real projects, and a little more confidence after every session.
          </p>
        </header>

        <div className="mt-12 overflow-hidden pb-6">
          <div className="testimonial-marquee flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-5 pr-5" aria-hidden={copy === 1}>
                {testimonials.map((item, index) => (
                  <article
                    key={`${copy}-${item.name}`}
                    className="flex min-h-[250px] w-[min(82vw,360px)] flex-col justify-between rounded-2xl border border-black bg-white p-6"
                    style={{
                      backgroundImage: "linear-gradient(rgba(0,0,0,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.045) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  >
                    <div>
                      <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                        <span>{item.category}</span>
                        <span>{String(index + 1).padStart(2, "0")} / 06</span>
                      </div>
                      <p className="text-lg leading-relaxed tracking-[-0.015em]">“{item.quote}”</p>
                    </div>
                    <footer className="mt-10 flex items-center justify-between gap-4 border-t border-black/15 pt-4">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-neutral-500">{item.role}</p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-black bg-black text-sm font-semibold text-white">{item.initial}</span>
                    </footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Community / in motion</p>
      </div>
      <style>{`
        .testimonial-marquee { animation: testimonial-scroll 42s linear infinite; }
        @keyframes testimonial-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .testimonial-marquee { animation-play-state: paused; } }
      `}</style>
    </section>
  );
}
