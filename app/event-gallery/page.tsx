import type { Metadata } from "next";

import SiteFooter from "@/components/sections/site-footer";
import SiteNav from "@/components/sections/site-nav";
import EventFolderGallery from "@/components/ui/event-folder-gallery";
import { EVENTS } from "@/components/ui/event-folder-data";

export const metadata: Metadata = {
  title: "Event Gallery | DevCatalyst",
  description: "Explore photos from DevCatalyst meetups, workshops, hackathons, and Catalyst Days.",
};

const photoCount = EVENTS.reduce((total, event) => total + event.photos.length, 0);

export default function EventGalleryPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-catalyst-paper">
      <SiteNav />
      <section className="px-6 pb-10 pt-32 sm:pt-40 lg:px-10" aria-labelledby="event-gallery-title">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-catalyst-muted">The moments we made together</p>
          <h1 id="event-gallery-title" className="max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-catalyst-ink sm:text-6xl lg:text-7xl">
            A little more than a photo album.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-catalyst-muted sm:text-lg">
            Browse the people, ideas, and shared moments from our events. Open any folder to see every photo from that event.
          </p>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-catalyst-muted">
            {EVENTS.length} event folders <span aria-hidden="true">·</span> {photoCount} photos
          </p>
        </div>
      </section>
      <section className="px-6 pb-24 lg:px-10 lg:pb-32" aria-label="Event photo folders">
        <div className="mx-auto max-w-7xl">
          <EventFolderGallery />
          <p className="mt-8 text-center text-sm text-catalyst-muted">Select a folder to browse its photos.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
