import EventFolderGallery from "@/components/ui/event-folder-gallery";

export default function GallerySection() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-catalyst-paper px-6 py-28 lg:px-10" aria-label="DevCatalyst gallery">
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#252525 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-catalyst-forest">The workspace</p>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-catalyst-ink sm:text-6xl">Everything you need,<br />right where you left it.</h2>
          <p className="max-w-xs text-sm leading-6 text-catalyst-muted">A collective of student builders, designers &amp; hackers. Real projects, late nights, zero fluff.</p>
        </div>
        <div className="mt-16"><EventFolderGallery /></div>
        <p className="mt-14 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-catalyst-muted">Move across folders to feel the weight · Click to view dossier</p>
      </div>
    </section>
  );
}
