import { EVENTS, type EventPhoto } from "./event-folder-data";

const suppliedTestimonials = [
  {
    organization: "FreshGradPrep Community",
    event: "They Got Hired. Why Didn't You?",
    name: "Bhargavi M",
    role: "HR Professional and Founder, FreshGradPrep Community",
    excerpt: "For me, this isn't just about one event or one collaboration. It's about the people, the trust, and the relationships we build along the way.",
    paragraphs: [
      "My story with Dev Catalyst started at a Microsoft event, with a simple message in a group! 😂",
      "I had posted that anyone interested in attending the event could DM me. Someone reached out saying his friend hadn't registered but wanted to attend. I asked him to share her name, and after a bit of a struggle, we somehow managed to get her in!",
      "During the break, we spoke casually, and he mentioned that they'd started their own community. I wished him all the best, not knowing that our journeys would eventually become so closely connected.",
      "I'd met Siddhartha almost a year earlier at an event we organised at Microsoft. So, when I started planning the first event for FreshGradPrep, he was one of the first people I approached almost two months before the event.",
      "We got on a call, discussed the event flow, and started planning.",
      "When the event finally happened, Siddhartha and the entire Dev Catalyst team showed up with incredible support. They volunteered, helped with coordination, and gave their 100% to make our first event run smoothly.",
      "As a founder organising the first event, having a team that genuinely supports you and works alongside you makes a huge difference. And Dev Catalyst did exactly that for us.",
      "For me, this isn't just about one event or one collaboration. It's about the people, the trust, and the relationships we build along the way.",
      "If there's one community I'd confidently recommend to anyone looking for genuine collaboration and support, it's Dev Catalyst. I've experienced their commitment firsthand, and I'm genuinely grateful to Siddhartha and the entire team.",
      "And to Dev Catalyst: we started with a simple introduction, worked together on our first event, and now you're stuck with us for life! 😂❤️ No going back now. Let's build bigger things together!",
    ],
  },
  {
    organization: "Centle India",
    event: "SummerSaaS AI Hackathon 2026",
    name: "Sai Krishna Guguloth",
    role: "Co-Founder, Centle India",
    excerpt: "A large event like this needs people who take real ownership, and DevCatalyst did.",
    paragraphs: [
      "We worked with the DevCatalyst team on SummerSaaS AI Hackathon 2026, India's largest summer AI hackathon, which brought together thousands of students from 200+ colleges and included a 36-hour onsite round at BITS Pilani, Hyderabad Campus. A large event like this needs people who take real ownership, and DevCatalyst did.",
      "What stood out:",
      "Commitment. The team contributed throughout the event, not just on the day.",
      "Teamwork. Everyone put in the effort to make it happen, and they worked smoothly with our own team.",
      "Reliability. When things got busy, we could depend on them.",
      "Attitude. They were positive, proactive and easy to work with.",
      "Thank you to everyone at DevCatalyst. We'd recommend them to any organisation planning an event or a developer-focused program.",
    ],
  },
  {
    organization: "Centle",
    event: "SummerSaaS 2026",
    name: "Vamshi Guguloth & Team Centle",
    role: "Centle team",
    excerpt: "Working with DevCatalyst has been a wonderful experience. Their combination of technical expertise, creative problem-solving, and a genuine commitment to delivering quality made them a valuable partner for Centle.",
    paragraphs: [
      "On behalf of myself, Vamshi Guguloth, and the entire Centle team, I would like to express our heartfelt appreciation to the DevCatalyst team for their meticulous support and outstanding contribution to organizing SummerSaaS 2026, India's Largest Summer AI Hackathon.",
      "The team's professionalism, patience, creativity, and commitment played a crucial role in making this large-scale initiative a success. Their willingness to understand our requirements, accommodate changes, resolve challenges, and provide timely support throughout the journey was truly commendable.",
      "I would especially like to appreciate every team member for their collaborative spirit, innovative thinking, and consistent efforts. Their attention to detail, flexibility, and dedication helped us navigate the complexities of organizing an event of this scale.",
      "Working with DevCatalyst has been a wonderful experience. Their combination of technical expertise, creative problem-solving, and a genuine commitment to delivering quality made them a valuable partner for Centle.",
      "Thank you, DevCatalyst, for standing by us throughout this journey and helping us bring our vision to life. We look forward to building many more impactful initiatives together!",
    ],
  },
  {
    organization: "Beacon Technologies",
    event: "Beacon's AI Foundry",
    name: "Srini Rao",
    role: "Founder, Beacon Technologies",
    excerpt: "DevCatalyst team has come in as a event partner and helped me organise the Hackathon. Their entire team worked very hard from the beginning and helped me organize the event successfully.",
    paragraphs: [
      "My company Beacon Technologies organized a 24Hrs Agentic AI Hackathon called \"Beacon's AI Foundry\" at IIT Hyderabad campus in June 2026. DevCatalyst team has come in as a event partner and helped me organise the Hackathon. Their entire team worked very hard from the beginning and helped me organize the event successfully.",
      "Srini Rao, Founder, Beacon Technologies.",
    ],
  },
  {
    organization: "Matrusri Engineering College",
    event: "DevCatalyst community",
    name: "Dr. L. K. Indumathi",
    role: "Associate Professor, CSE Department",
    excerpt: "It has been wonderful to see students take ownership, work together, and transform their ideas into meaningful experiences for others.",
    paragraphs: [
      "Having been associated with DevCatalyst since its inception, it has been truly inspiring to witness its journey from a small college initiative into a vibrant student-driven community.",
      "What makes DevCatalyst stand out is not just the number of events it has organized, but the consistency of its enthusiasm and commitment. Over time, the team has successfully conducted 15+ events, bringing together thousands of students and creating meaningful opportunities for learning, collaboration, and interaction.",
      "Student clubs often face the challenge of sustaining their momentum over time. Interests change, teams evolve, and initial enthusiasm can gradually fade. However, one thing that has remained constant with DevCatalyst is its eagerness to take initiative, explore new ideas, and continuously create opportunities for the student community.",
      "It has been wonderful to see students take ownership, work together, and transform their ideas into meaningful experiences for others. I am proud to have been part of this journey and look forward to seeing DevCatalyst continue to grow, inspire, and make a lasting impact on the student community.",
    ],
  },
];

export type Testimonial = {
  slug: string;
  organization: string;
  event: string;
  name: string;
  role: string;
  excerpt: string;
  paragraphs: string[];
  eventId: string | null;
  authorImage: string | null;
  companyImage: string | null;
  portraitScale: number;
  portraitOrigin: string;
  galleryPhotos?: EventPhoto[];
  galleryTitle?: string;
};

export const testimonials: Testimonial[] = suppliedTestimonials.map((item, index) => ({
  ...item,
  slug: ["bhargavi-freshgradprep", "sai-krishna-centle", "vamshi-team-centle", "srini-rao-beacon", "dr-l-k-indumathi"][index],
  eventId: ["freshgradprep-hired", "summersaas-2026", "summersaas-2026", "beacons", null][index],
  authorImage: ["/testimonials/bhargavi-m.png", "/testimonials/sai-krishna-guguloth.jpeg", null, null, "/testimonials/indumathi.jpeg"][index],
  companyImage: [null, null, "/testimonials/centle.png", "/testimonials/beacon-technologies.webp", null][index],
  portraitScale: index === 1 ? 2.5 : 1,
  portraitOrigin: index === 1 ? "50% 65%" : "center",
  galleryPhotos: index === 4 ? ["catalyst-days", "aws-101", "agentic-ai", "glug-first-commit", "kiro-aws", "18th-event"].flatMap((id) => {
    const event = EVENTS.find((item) => item.id === id);
    return event ? [event.photos[0]] : [];
  }) : undefined,
  galleryTitle: index === 4 ? "Moments from DevCatalyst events" : undefined,
}));

export function testimonialInitials(name: string) {
  return name.replace(/^Dr\.?\s+/i, "").split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
}
