import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { testimonials, testimonialInitials } from "./testimonial-data";
import styles from "./testimonial.module.css";

export default function ClientFeedback() {
  return (
    <section className="w-full overflow-hidden bg-catalyst-paper py-20 text-catalyst-ink sm:py-24" aria-labelledby="stories-title">
      <header className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <h2 id="stories-title" className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Relationships make the work work.</h2>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-base leading-7 text-catalyst-muted sm:text-lg">Notes from people and teams who have worked alongside DevCatalyst.</p>
        </div>
      </header>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
              {testimonials.map((item) => (
                <li key={item.slug} className={styles.card}>
                  <Link href={`/testimonials/${item.slug}`} tabIndex={copy === 1 ? -1 : undefined} className="flex h-full flex-col justify-between rounded-2xl border border-catalyst-line bg-catalyst-white p-6 transition-colors hover:border-catalyst-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-catalyst-ink">
                    <div>
                      <p className="mb-5 text-xs font-medium uppercase tracking-[0.1em] text-catalyst-muted">{item.organization}</p>
                      <blockquote className="line-clamp-4 text-lg leading-7 tracking-[-0.015em]">&ldquo;{item.excerpt}&rdquo;</blockquote>
                    </div>
                    <div>
                      <div className="mt-7 flex items-center gap-3 border-t border-catalyst-line pt-4">
                        {item.authorImage ? <span className="size-11 shrink-0 overflow-hidden rounded-full"><Image src={item.authorImage} alt="" width={44} height={44} className="size-11 object-cover object-top" style={{ transform: `scale(${item.portraitScale})`, transformOrigin: item.portraitOrigin }} /></span> : item.companyImage ? <Image src={item.companyImage} alt="" width={88} height={44} className="h-11 w-[88px] shrink-0 rounded-md bg-white p-1 object-contain" /> : <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-catalyst-ink text-sm font-semibold text-white">{testimonialInitials(item.name)}</span>}
                        <div className="min-w-0"><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs leading-5 text-catalyst-muted">{item.role}</p></div>
                      </div>
                      <span className="mt-5 flex items-center justify-between gap-3 text-sm font-medium">View full testimonial <ArrowUpRight aria-hidden="true" size={17} /></span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
