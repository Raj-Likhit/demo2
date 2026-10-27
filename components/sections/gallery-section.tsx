import EventFolderGallery from "@/components/ui/event-folder-gallery";

export default function GallerySection() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-catalyst-paper px-6 py-28 lg:px-10"
      aria-labelledby="gallery-title"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#252525 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_22rem] md:items-end">
          <h2 id="gallery-title" className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-catalyst-ink sm:text-6xl">
            Events are where connection begins.
          </h2>
          <p className="text-sm leading-6 text-catalyst-muted">
            Replace these sample entries with verified event names, dates, and real moments before publishing.
          </p>
        </div>
        <div className="mt-14"><EventFolderGallery /></div>
        <p className="mt-10 text-center text-sm text-catalyst-muted">
          Sample gallery content for the team to replace with approved event details and photos.
        </p>
      </div>
    </section>
  );
}
