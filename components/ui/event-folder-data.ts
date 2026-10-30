export type EventPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type GalleryEvent = {
  id: string;
  title: string;
  tag: string;
  categories: string[];
  tilt: number;
  photos: EventPhoto[];
};

type EventFolder = {
  id: string;
  title: string;
  tag: string;
  categories: string[];
  count: number;
};

const eventFolders: EventFolder[] = [
  { id: "freshgradprep-hired", title: "They Got Hired. Why Didn't You?", tag: "EVENT", categories: [], count: 7 },
  { id: "18th-event", title: "18th Event", tag: "MEETUP", categories: ["Meetups"], count: 7 },
  { id: "algorand", title: "Algorand", tag: "MEETUP", categories: ["Meetups"], count: 5 },
  { id: "aws-101", title: "AWS 101", tag: "MEETUP", categories: ["Meetups"], count: 9 },
  { id: "aws-scd", title: "AWS SCD", tag: "MEETUP · WORKSHOP", categories: ["Meetups", "Workshops"], count: 6 },
  { id: "glug-first-commit", title: "GLUG First Commit", tag: "WORKSHOP", categories: ["Workshops"], count: 7 },
  { id: "aws-pvt", title: "AWS PVT", tag: "WORKSHOP", categories: ["Workshops"], count: 15 },
  { id: "agentic-ai", title: "Agentic AI", tag: "WORKSHOP", categories: ["Workshops"], count: 9 },
  { id: "kiro-aws", title: "Kiro AWS", tag: "WORKSHOP", categories: ["Workshops"], count: 6 },
  { id: "catalyst-days", title: "Catalyst Days", tag: "CATALYST DAYS", categories: ["Hackathons", "Catalyst Days"], count: 8 },
  { id: "beacons", title: "Beacons", tag: "HACKATHON", categories: ["Hackathons"], count: 6 },
  { id: "sih25", title: "SIH25", tag: "HACKATHON", categories: ["Hackathons"], count: 8 },
  { id: "sih2026", title: "SIH2026", tag: "HACKATHON", categories: ["Hackathons"], count: 5 },
  { id: "summersaas-2026", title: "SummerSaaS 2026", tag: "HACKATHON", categories: ["Hackathons"], count: 3 },
  { id: "youth-speak", title: "Youth Speak", tag: "HACKATHON", categories: ["Hackathons"], count: 9 },
  { id: "group-pic", title: "Community Moments", tag: "COMMUNITY", categories: [], count: 1 },
];

function makePhotos(id: string, title: string, count: number): EventPhoto[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/event-gallery/${id}/${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `${title}, photo ${index + 1}`,
    caption: `Photo ${index + 1}`,
  }));
}

export const EVENTS: GalleryEvent[] = eventFolders.map((folder, index) => ({
  id: folder.id,
  title: folder.title,
  tag: folder.tag,
  categories: folder.categories,
  tilt: [-1.8, 1.2, -0.8, 1.6, -1.3, 0.6][index % 6],
  photos: makePhotos(folder.id, folder.title, folder.count),
}));

export const EVENT_CATEGORIES = [
  { title: "Meetups", eventIds: ["18th-event", "algorand", "aws-101", "aws-scd"] },
  { title: "Workshops", eventIds: ["glug-first-commit", "aws-pvt", "agentic-ai", "kiro-aws", "aws-scd"] },
  { title: "Hackathons", eventIds: ["catalyst-days", "beacons", "sih25", "sih2026", "summersaas-2026", "youth-speak"] },
  { title: "Catalyst Days", eventIds: ["catalyst-days"] },
] as const;

export const CATEGORY_FOLDERS: GalleryEvent[] = EVENT_CATEGORIES.map((category, index) => ({
  id: category.title.toLowerCase().replace(/\s+/g, "-"),
  title: category.title,
  tag: category.title === "Catalyst Days" ? "FLAGSHIP EVENT" : "EVENTS",
  categories: [category.title],
  tilt: [-1.8, 1.2, -0.8, 1.6][index],
  photos: category.eventIds.flatMap((id) => {
    const event = EVENTS.find((item) => item.id === id);
    if (event && category.title === "Catalyst Days") {
      return [0, 1, 6, 3, 7, 2, 4].map((photoIndex) => event.photos[photoIndex]);
    }
    return event ? [{ ...event.photos[0], caption: event.title }] : [];
  }),
}));
