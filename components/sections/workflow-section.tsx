const connectionWays = [
  {
    title: "Meet through events",
    copy: "Create a reason for students to gather around a shared interest.",
  },
  {
    title: "Learn side by side",
    copy: "Bring students and practitioners into the same conversation.",
  },
  {
    title: "Build relationships",
    copy: "Let shared experiences grow into lasting connections across campus.",
  },
];

export default function WorkflowSection() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="bg-catalyst-forest px-6 py-24 text-white lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <h2 id="workflow-title" className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            Community grows when people make space for one another.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Events and shared learning give students, campus communities, and industry teams a place to meet and explore ideas together.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-10 sm:grid-cols-3">
          {connectionWays.map((way) => (
            <li key={way.title} className="border-t border-white/30 py-6">
              <h3 className="text-lg font-semibold">{way.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">{way.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
