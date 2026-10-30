import { Marquee } from "@/components/ui/marquee";

const collaborators = [
  "Featherless AI",
  "Mobbin",
  "InterviewBuddy",
  "Replit",
  "JetBrains",
  "MongoDB",
  "CodeCrafters",
  "n8n",
  "Oppo",
  "Eleven Labs",
  "Uptoskills",
];

export default function MarqueeSection() {
  return (
    <section
      id="collaborators"
      className="w-full overflow-hidden border-y border-catalyst-line bg-catalyst-paper py-12"
      aria-labelledby="collaborators-title"
    >
      <h2
        id="collaborators-title"
        className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-catalyst-ink"
      >
        Our collaborators
      </h2>
      <p className="mx-auto mb-5 max-w-xl px-6 text-center text-sm text-catalyst-muted">
        Organizations and communities we have connected with through events and shared learning.
      </p>
      <Marquee pauseOnHover speed={48} aria-label="Collaborator names">
        <div className="flex items-center gap-14 px-8 sm:gap-24">
          {collaborators.map((name) => (
            <span
              key={name}
              className="whitespace-nowrap text-2xl font-semibold tracking-[-0.04em] text-catalyst-ink/75 sm:text-3xl"
            >
              {name}
            </span>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
