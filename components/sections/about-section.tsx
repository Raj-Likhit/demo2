
const moments = [
  { image: "https://cdn.21st.dev/assets/mirror/70/706df1e921d12b172a0f531bd7e376496acadd61faff14d909d8a02c81330ff6.jpg", alt: "Students sharing ideas around a table" },
  { image: "https://cdn.21st.dev/assets/mirror/f2/f205346f850085c841beb3a7ca6115bb8aaf8268992606812b207a1993c5769f.jpg", alt: "A close look at a team project in progress" },
  { image: "https://cdn.21st.dev/assets/mirror/cf/cf273032d791a8a5d4c6579eae14a92438cdb4a0efb97ad3363d9a4e99b3cea2.jpg", alt: "Student builders working together" },
  { image: "https://cdn.21st.dev/assets/mirror/ab/ab5b8c7b79915a038d1eb60c3b67468cafa0be6ad4525baf1f4904223f2b2c5d.jpg", alt: "A moment from the DevCatalyst community" },
];

const principles = [
  { number: "01", title: "Learn by making", copy: "Workshops turn new tools into things you can put to use." },
  { number: "02", title: "Build in company", copy: "Find collaborators who make the hard parts feel possible." },
  { number: "03", title: "Ship with purpose", copy: "Take an idea from first sketch to something people can try." },
];

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-catalyst-paper px-6 py-24 text-catalyst-ink sm:py-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-catalyst-forest"><span aria-hidden="true" className="h-px w-8 bg-catalyst-forest" />A community for curious minds</p>
            <h2 id="about-title" className="max-w-3xl text-[clamp(2.75rem,6vw,5.75rem)] font-semibold leading-[.98] tracking-[-.065em]">Good ideas grow when we <span className="decoration-catalyst-lime decoration-[.14em] underline underline-offset-[.12em]">build together.</span></h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-catalyst-muted sm:text-lg">DevCatalyst is a student-led community for learning out loud, making useful things, and helping each other take the next step. Bring a question, a rough sketch, or a project you can&apos;t stop thinking about.</p>
            <a href="#contact" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-catalyst-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4">Find your people <span aria-hidden="true">↗</span></a>
          </div>
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            {moments.map((moment, index) => <figure key={moment.image} className={`overflow-hidden rounded-[1.4rem] border border-catalyst-line bg-catalyst-white p-2 shadow-[0_14px_40px_rgba(0,0,0,.08)] ${index === 1 ? "translate-y-7" : index === 2 ? "-translate-y-3" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={moment.image} alt={moment.alt} className="aspect-[1.28] w-full rounded-[.9rem] object-cover grayscale" loading="lazy" />
            </figure>)}
            <span aria-hidden="true" className="absolute -right-3 -top-5 -z-0 size-20 rounded-full bg-catalyst-lime/45 blur-2xl sm:-right-5 sm:-top-7 sm:size-28" />
          </div>
        </div>
        <div className="mt-24 grid gap-8 border-t border-catalyst-line pt-8 sm:grid-cols-3 sm:gap-6 lg:mt-32">
          {principles.map((principle) => <article key={principle.number} className="max-w-sm">
            <p className="font-mono text-xs tracking-[0.18em] text-catalyst-forest">{principle.number} / HOW WE GROW</p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{principle.title}</h3>
            <p className="mt-2 text-sm leading-6 text-catalyst-muted">{principle.copy}</p>
          </article>)}
        </div>
      </div>
    </section>
  );
}
