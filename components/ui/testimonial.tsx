const testimonialPlaceholders = [
  { kind: "Student voice", name: "[ADD APPROVED STUDENT NAME]", role: "[ADD APPROVED ROLE OR YEAR]" },
  { kind: "Partner voice", name: "[ADD APPROVED PARTNER NAME]", role: "[ADD APPROVED ORGANIZATION AND ROLE]" },
  { kind: "Event moment", name: "[ADD EVENT OR COLLABORATION]", role: "[ADD VERIFIED DATE OR CONTEXT]" },
];

export default function ClientFeedback() {
  return (
    <section className="w-full bg-catalyst-paper py-20 text-catalyst-ink" aria-labelledby="stories-title">
      <header className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <h2 id="stories-title" className="text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
          The community is built by the people in it.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-catalyst-muted sm:text-lg">
          Replace these clearly marked slots with approved student and partner stories before publishing.
        </p>
      </header>

      <ul className="mx-auto mt-12 max-w-6xl px-5 sm:px-8 lg:px-10">
        {testimonialPlaceholders.map((item) => (
          <li key={item.kind} className="grid gap-5 border-t border-catalyst-line py-7 sm:grid-cols-[180px_minmax(0,1fr)_250px] sm:items-start sm:gap-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-catalyst-muted">{item.kind}</p>
            <blockquote className="text-lg leading-relaxed sm:text-xl">“[ADD VERIFIED, APPROVED TESTIMONIAL]”</blockquote>
            <div className="text-sm text-catalyst-muted">
              <p className="font-semibold text-catalyst-ink">{item.name}</p>
              <p className="mt-1">{item.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
