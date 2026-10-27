import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SiteNav from "@/components/sections/site-nav";
import SiteFooter from "@/components/sections/site-footer";

const collaborationWays = [
  {
    title: "Co-host an event or workshop",
    detail: "[Replace with a confirmed event format, topic, and intended student audience.]",
  },
  {
    title: "Share a speaker or mentor",
    detail: "[Add approved expertise, participation details, and the student benefit.]",
  },
  {
    title: "Bring an industry challenge",
    detail: "[Describe a suitable challenge and how students could explore it.]",
  },
];

const placeholders = [
  { title: "Partner", value: "[ADD VERIFIED PARTNER NAME]" },
  { title: "Collaboration", value: "[ADD CONFIRMED EVENT OR ACTIVITY]" },
  { title: "Student value", value: "[ADD VERIFIED OUTCOME]" },
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
              The best collaboration starts with what students need and what a partner can genuinely contribute. Shape the format together, then describe the expected benefit in clear, verifiable terms.
            </p>
            <p className="mt-6 border-t border-catalyst-line pt-4 text-sm leading-6 text-catalyst-muted">
              Team placeholder: add the specific student benefit this partnership would support.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="partner-story-title" className="bg-catalyst-forest px-6 py-20 text-white sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 id="partner-story-title" className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl">
            Replace this with a real collaboration story.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
            Editable placeholders for the DevCatalyst team. Add only details and quotes approved for publication.
          </p>
          <dl className="mt-12 grid gap-x-10 sm:grid-cols-3">
            {placeholders.map((item) => (
              <div key={item.title} className="border-t border-white/30 py-5">
                <dt className="text-xs font-semibold uppercase tracking-[.14em] text-white/65">{item.title}</dt>
                <dd className="mt-3 text-base font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="mt-8 border-t border-white/30 pt-6 text-lg leading-relaxed sm:text-xl">
            [ADD VERIFIED AND APPROVED STUDENT OR PARTNER TESTIMONIAL]
            <footer className="mt-4 text-sm text-white/70">[ADD APPROVED NAME, ROLE, AND ORGANIZATION]</footer>
          </blockquote>
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
