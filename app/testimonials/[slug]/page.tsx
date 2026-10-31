import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteNav from "@/components/sections/site-nav";
import SiteFooter from "@/components/sections/site-footer";
import { testimonials, testimonialInitials } from "@/components/ui/testimonial-data";
import { EVENTS } from "@/components/ui/event-folder-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return testimonials.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = testimonials.find((item) => item.slug === slug);
  return { title: story ? `${story.name} | DevCatalyst Testimonials` : "Testimonial | DevCatalyst" };
}

export default async function TestimonialPage({ params }: PageProps) {
  const { slug } = await params;
  const story = testimonials.find((item) => item.slug === slug);
  if (!story) notFound();
  const event = EVENTS.find((item) => item.id === story.eventId);
  const photos = story.galleryPhotos ?? event?.photos ?? [];

  return (
    <main className="min-h-screen bg-catalyst-paper text-catalyst-ink">
      <SiteNav />
      <article className="mx-auto max-w-6xl px-6 pb-20 pt-32 sm:px-8 sm:pt-40 lg:px-10">
        <Link href="/#testimonials" className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-ink focus-visible:ring-offset-4"><ArrowLeft aria-hidden="true" size={17} />Back to testimonials</Link>
        <header className="mt-10 border-b border-catalyst-line pb-10">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-catalyst-muted">{story.organization}</p>
          <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            {story.authorImage ? <span className="size-24 shrink-0 overflow-hidden rounded-2xl sm:size-28"><Image src={story.authorImage} alt={story.name} width={112} height={112} className="size-24 object-cover object-top sm:size-28" style={{ transform: `scale(${story.portraitScale})`, transformOrigin: story.portraitOrigin }} priority /></span> : story.companyImage ? <Image src={story.companyImage} alt={`${story.organization} logo`} width={240} height={112} className={story.companyImageSquare ? "size-24 shrink-0 rounded-2xl object-cover sm:size-28" : "h-24 w-60 max-w-full shrink-0 rounded-2xl bg-white p-4 object-contain sm:h-28"} priority /> : <span aria-hidden="true" className="grid size-24 shrink-0 place-items-center rounded-2xl bg-catalyst-ink text-3xl font-semibold text-white sm:size-28">{testimonialInitials(story.name)}</span>}
            <div><h1 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">{story.name}</h1><p className="mt-3 text-base leading-7 text-catalyst-muted">{story.role}</p><p className="mt-1 text-sm leading-6 text-catalyst-muted">{story.event}</p></div>
          </div>
        </header>
        <blockquote className="mx-auto max-w-3xl space-y-6 py-10 text-base leading-8 sm:py-14 sm:text-lg sm:leading-8">
          {story.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </blockquote>
        {photos.length > 0 && <section className="border-t border-catalyst-line pt-10" aria-labelledby="testimonial-event-photos">
          <h2 id="testimonial-event-photos" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{story.galleryTitle ?? `Moments from ${story.event}`}</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {photos.map((photo) => <figure key={photo.src} className="overflow-hidden rounded-2xl bg-catalyst-white"><Image src={photo.src} alt={photo.alt} width={1600} height={1200} sizes="(max-width: 640px) 90vw, 50vw" className="h-auto w-full" loading="lazy" /></figure>)}
          </div>
        </section>}
      </article>
      <SiteFooter />
    </main>
  );
}
