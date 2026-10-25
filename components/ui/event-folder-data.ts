  function createSyllabusIllustration(seed: number, title: string) {
    const chars = [
      // Character 1: Beanie + Round Glasses + Speech bubble
      `<g transform="translate(60, 40)">
        <path d="M120 380 C130 260, 270 260, 280 380 Z" fill="#0a0a0a"/>
        <path d="M170 260 L230 260 L230 290 L170 290 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="6"/>
        <circle cx="200" cy="200" r="70" fill="#ffffff" stroke="#0a0a0a" stroke-width="6"/>
        <!-- Beanie -->
        <path d="M135 180 C135 110, 265 110, 265 180 Z" fill="#0a0a0a"/>
        <path d="M125 175 L275 175 L275 195 L125 195 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="6"/>
        <!-- Glasses -->
        <circle cx="175" cy="205" r="22" fill="#fff" stroke="#0a0a0a" stroke-width="5"/>
        <circle cx="225" cy="205" r="22" fill="#fff" stroke="#0a0a0a" stroke-width="5"/>
        <path d="M197 205 L203 205" stroke="#0a0a0a" stroke-width="5"/>
        <!-- Eyes & Smile -->
        <circle cx="175" cy="205" r="5" fill="#0a0a0a"/>
        <circle cx="225" cy="205" r="5" fill="#0a0a0a"/>
        <path d="M190 245 Q200 255 210 245" fill="none" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>
        <!-- Bubble -->
        <path d="M260 120 L320 80 Q340 70 360 80 L440 80 Q460 80 460 110 L460 140 Q460 160 430 160 L310 160 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="5"/>
        <text x="320" y="125" font-family="'Syne', sans-serif" font-weight="800" font-size="20" fill="#0a0a0a">LET'S HACK!</text>
      </g>`,
      
      // Character 2: Cap backwards + Hoodie crowd
      `<g transform="translate(60, 40)">
        <path d="M40 380 C60 280, 180 280, 200 380 Z" fill="#0a0a0a"/>
        <path d="M200 380 C220 250, 380 250, 400 380 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="6"/>
        <circle cx="300" cy="190" r="68" fill="#ffffff" stroke="#0a0a0a" stroke-width="6"/>
        <!-- Backward Cap -->
        <path d="M232 180 C232 120, 368 120, 368 180 Z" fill="#0a0a0a"/>
        <path d="M340 180 L410 195 L340 210 Z" fill="#0a0a0a"/>
        <!-- Face details -->
        <circle cx="280" cy="195" r="6" fill="#0a0a0a"/>
        <circle cx="330" cy="195" r="6" fill="#0a0a0a"/>
        <path d="M290 228 Q305 240 320 228" fill="none" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>
        <path d="M265 175 L290 182 M345 175 L320 182" stroke="#0a0a0a" stroke-width="4"/>
      </g>`,

      // Character 3: Headphones + Laptop + Stickers
      `<g transform="translate(60, 40)">
        <path d="M110 380 C130 260, 310 260, 330 380 Z" fill="#0a0a0a"/>
        <circle cx="220" cy="190" r="65" fill="#ffffff" stroke="#0a0a0a" stroke-width="6"/>
        <!-- Big Hair -->
        <path d="M150 190 C130 90, 310 90, 290 190 C300 230, 140 230, 150 190 Z" fill="#0a0a0a"/>
        <!-- Face -->
        <circle cx="198" cy="195" r="5" fill="#0a0a0a"/>
        <circle cx="242" cy="195" r="5" fill="#0a0a0a"/>
        <path d="M210 225 Q220 232 230 225" fill="none" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round"/>
        <!-- Large Headphones -->
        <path d="M155 190 Q220 120 285 190" fill="none" stroke="#0a0a0a" stroke-width="8"/>
        <rect x="142" y="170" width="22" height="42" rx="10" fill="#ffffff" stroke="#0a0a0a" stroke-width="5"/>
        <rect x="276" y="170" width="22" height="42" rx="10" fill="#ffffff" stroke="#0a0a0a" stroke-width="5"/>
      </g>`
    ];

    const pick = chars[seed % chars.length];
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 400" width="100%" height="100%">
        <rect width="540" height="400" fill="#fcfbf7"/>
        <!-- Notebook margin line -->
        <line x1="0" y1="340" x2="540" y2="340" stroke="#0a0a0a" stroke-width="4" stroke-dasharray="10 6"/>
        <!-- Crowd silhouettes behind -->
        <path d="M-20 400 C10 290, 120 290, 150 400 Z" fill="#0a0a0a"/>
        <path d="M380 400 C410 280, 520 280, 560 400 Z" fill="#0a0a0a"/>
        ${pick}
        <!-- Hand drawn corner spark -->
        <path d="M470 50 L475 70 L495 75 L475 80 L470 100 L465 80 L445 75 L465 70 Z" fill="#0a0a0a"/>
        <text x="30" y="375" font-family="'Kalam', cursive" font-size="22" font-weight="bold" fill="#0a0a0a">${title}</text>
      </svg>
    `;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }


  export const EVENTS = [
    {
      id: "build-night",
      title: "Build Night",
      tag: "Vol. 01",
      date: "Wed, 19 Aug",
      badge: "LIVE LAB",
      tilt: -2,
      photos: [
        { caption: "First pull request celebration", seed: 0 },
        { caption: "Whiteboard architecture mapping", seed: 1 },
        { caption: "Late-night refactoring sprint", seed: 2 },
        { caption: "Demo time with mentors", seed: 0 }
      ]
    },
    {
      id: "hackathon",
      title: "48H Hack",
      tag: "Vol. 02",
      date: "Sat, 12 Sep",
      badge: "HACKATHON",
      tilt: 1.5,
      photos: [
        { caption: "Midnight energy drink summit", seed: 1 },
        { caption: "Debugging the final endpoint", seed: 2 },
        { caption: "Pitch deck rehearsal", seed: 0 },
        { caption: "Grand prize announcement", seed: 1 }
      ]
    },
    {
      id: "workshop",
      title: "Design Lab",
      tag: "Vol. 03",
      date: "Fri, 02 Oct",
      badge: "WORKSHOP",
      tilt: -1,
      photos: [
        { caption: "Component system teardown", seed: 2 },
        { caption: "Typography pairing roast", seed: 0 },
        { caption: "Prototyping physics on Figma", seed: 1 }
      ]
    }
  ];

export function photoSource(photo: { seed: number; caption: string }) {
 return createSyllabusIllustration(photo.seed, photo.caption);
}
