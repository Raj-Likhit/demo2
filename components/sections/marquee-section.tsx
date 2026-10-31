import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";

const collaborators = [
  { name: "Featherless AI", file: "featherless.png", width: 588, height: 309, crop: [73, 90, 434, 101] },
  { name: "Mobbin", file: "mobbin.png", width: 516, height: 387, crop: [107, 167, 302, 53] },
  { name: "InterviewBuddy", file: "interviewbuddy.jpeg", width: 200, height: 200, crop: [3, 68, 195, 65] },
  { name: "Replit", file: "replit.jpeg", width: 554, height: 554, crop: [68, 214, 418, 124] },
  { name: "JetBrains", file: "jetbrains.jpeg", width: 447, height: 447, crop: [34, 33, 381, 380] },
  { name: "MongoDB", file: "mongodb.png", width: 512, height: 512, crop: [12, 9, 487, 495] },
  { name: "CodeCrafters", file: "codecrafters.jpeg", width: 200, height: 200, crop: [21, 43, 158, 114] },
  { name: "n8n", file: "n8n.png", width: 588, height: 234, crop: [37, 37, 529, 148] },
  { name: "Eleven Labs", file: "elevenlabs.png", width: 544, height: 367, crop: [63, 153, 418, 61] },
  { name: "Uptoskills", file: "uptoskills.png", width: 554, height: 554, crop: [5, 191, 512, 120] },
];

export default function MarqueeSection() {
  return (
    <section
      id="collaborators"
      className="w-full overflow-hidden border-y border-catalyst-line bg-catalyst-paper py-12"
      aria-labelledby="collaborators-title"
    >
      {/* Remove the supplied files' flat backdrops at render time, preserving logo colours. */}
      <svg aria-hidden="true" focusable="false" width="0" height="0" className="pointer-events-none absolute">
        <defs>
          <filter id="collaborator-light-background" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 -4 -4 0 10" result="mask" />
            <feComposite in="SourceGraphic" in2="mask" operator="in" />
          </filter>
          <filter id="collaborator-featherless-background" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feFlood floodColor="#fcf491" result="background" />
            <feBlend in="SourceGraphic" in2="background" mode="difference" result="difference" />
            <feColorMatrix in="difference" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  12 12 12 0 -0.5" result="mask" />
            <feComposite in="SourceGraphic" in2="mask" operator="in" />
          </filter>
          <filter id="collaborator-codecrafters-background" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 1.5 1.5 0 -0.6" result="mask" />
            <feFlood floodColor="#122931" result="brandColour" />
            <feComposite in="brandColour" in2="mask" operator="in" />
          </filter>
        </defs>
      </svg>
      <h2
        id="collaborators-title"
        className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-catalyst-ink"
      >
        Our collaborators
      </h2>
      <p className="mx-auto mb-5 max-w-xl px-6 text-center text-sm text-catalyst-muted">
        Organizations and communities we have connected with through events and shared learning.
      </p>
      <Marquee pauseOnHover speed={48} aria-label="Collaborator logos">
        <div className="flex items-center gap-10 px-5 sm:gap-16 sm:px-8">
          {collaborators.map((logo) => {
            // Crop the supplied files' uneven padding in CSS, keeping originals intact.
            const [left, top, width, height] = logo.crop;
            const scale = Math.min(168 / width, 64 / height);
            return (
              <div key={logo.name} className="flex h-20 w-44 shrink-0 items-center justify-center">
                <span className="relative block overflow-hidden" style={{ width: width * scale, height: height * scale }}>
                  <Image
                    src={`/collaborators/${logo.file}`}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                    className="absolute max-w-none"
                    style={{
                      width: logo.width * scale,
                      height: logo.height * scale,
                      left: -left * scale,
                      top: -top * scale,
                      filter: `url(#collaborator-${logo.name === "CodeCrafters" ? "codecrafters" : logo.name === "Featherless AI" ? "featherless" : "light"}-background)`,
                    }}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </Marquee>
    </section>
  );
}
