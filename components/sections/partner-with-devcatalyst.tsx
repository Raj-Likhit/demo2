import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SiteNav from "@/components/sections/site-nav";
import SiteFooter from "@/components/sections/site-footer";

const collaborationWays = [
  {
    title: "Co-host an event or workshop",
    detail: "Plan a session around a shared student interest, from a hands-on workshop to a larger event.",
  },
  {
    title: "Share a speaker or mentor",
    detail: "Give students a chance to learn directly from people doing the work and ask practical questions.",
  },
  {
    title: "Bring an industry challenge",
    detail: "Bring a real problem for students to explore, prototype, and discuss with your team.",
  },
];

const collaborations = [
  {
    partner: "FreshGradPrep Community",
    event: "FreshGradPrep's first event",
    detail: "DevCatalyst volunteers supported planning, coordination, and event-day operations alongside the host team.",
  },
  {
    partner: "Centle India",
    event: "SummerSaaS AI Hackathon 2026",
    detail: "The team supported an event with a 36-hour onsite round at BITS Pilani, Hyderabad Campus.",
  },
  {
    partner: "Beacon Technologies",
    event: "Beacon's AI Foundry",
    detail: "DevCatalyst partnered on a 24-hour Agentic AI hackathon at IIT Hyderabad in June 2026.",
  },
];

export default function PartnerWithDevCatalyst() {
  return (
    <main className="min-h-screen overflow-hidden bg-catalyst-paper text-catalyst-ink">
      <SiteNav />

      <section className="px-6 pb-24 pt-32 sm:pb-28 sm:pt-36 lg:px-10 lg:pb-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,.7fr)] lg:items-end lg:gap-20">
          <div>
            <h1 className="max-w-5xl text-[clamp(2.8rem,6vw,5.75rem)] font-semibold leading-[.96] tracking-[-.04em]">
              Strong student communities grow through connection.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-catalyst-muted sm:text-lg sm:leading-8">
              DevCatalyst brings students together through technology, events, and shared learning. Companies and industry teams can help strengthen those relationships by exploring a collaboration with us.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/#contact" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-catalyst-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4">
                Start a conversation
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a href="#possibilities" className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-catalyst-ink underline decoration-catalyst-line underline-offset-4 transition hover:decoration-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4">
                Explore possibilities
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          <aside aria-label="Community connection" className="border-y border-catalyst-line py-5">
            <p className="text-sm leading-6 text-catalyst-muted">A shared space for</p>
            <p className="mt-3 text-2xl font-medium tracking-tight">Students</p>
            <div className="my-4 h-px w-full bg-catalyst-line" />
            <p className="text-2xl font-medium tracking-tight">Campus communities</p>
            <div className="my-4 h-px w-full bg-catalyst-line" />
            <p className="text-2xl font-medium tracking-tight">Industry teams</p>
          </aside>
        </div>
      </section>

      <section id="possibilities" aria-labelledby="possibilities-title" className="border-y border-catalyst-line bg-catalyst-white px-6 py-20 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div>
            <h2 id="possibilities-title" className="max-w-md text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl">
              Ways to strengthen student connection
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-catalyst-muted">
              These are starting points to explore together, not a fixed program or a promise of outcomes.
            </p>
          </div>

          <ol className="border-t border-catalyst-line">
            {collaborationWays.map((way, index) => (
              <li key={way.title} className="grid gap-3 border-b border-catalyst-line py-6 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-5 sm:py-7">
                <span className="font-mono text-xs text-catalyst-muted">0{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{way.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-catalyst-muted">{way.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="student-value-title" className="px-6 py-20 sm:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[.9fr_1.1fr] md:items-start md:gap-16">
          <h2 id="student-value-title" className="max-w-lg text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl">
            Keep the student experience at the center.
          </h2>
          <div className="border-t border-catalyst-line pt-5">
            <p className="max-w-2xl text-base leading-7 text-catalyst-muted sm:text-lg sm:leading-8">
              Shape the format around what students need and what a partner can genuinely contribute. Shared events can create room to learn, make connections, and try ideas together.
            </p>
          </div>
        </div>
      </section>

      <section data-nav-theme="dark" aria-labelledby="partner-story-title" className="bg-catalyst-forest px-6 py-20 text-white sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 id="partner-story-title" className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl">
            Built alongside other communities.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
            A few collaborations shared by the people who worked with the DevCatalyst team.
          </p>
          <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {collaborations.map((item) => (
              <li key={item.partner} className="border-t border-white/30 py-5">
                <p className="text-xl font-semibold">{item.partner}</p>
                <p className="mt-2 text-sm font-medium text-white/85">{item.event}</p>
                <p className="mt-3 text-sm leading-6 text-white/70">{item.detail}</p>
              </li>
            ))}
          </ul>
          <Link href="/#testimonials" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-medium underline underline-offset-4 hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-catalyst-forest">
            Read partner testimonials <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-catalyst-line pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Start with a conversation.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-catalyst-muted">Share what your team hopes to explore, and we can discuss a student-centered starting point.</p>
          </div>
          <Link href="/#contact" className="group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-catalyst-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4">
            Contact DevCatalyst
            <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
