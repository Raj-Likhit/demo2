import HomeHero from "@/components/sections/home-hero";
import AboutSection from "@/components/sections/about-section";
import GallerySection from "@/components/sections/gallery-section";
import MarqueeSection from "@/components/sections/marquee-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import FAQSection from "@/components/sections/faq-section";
import SiteFooter from "@/components/sections/site-footer";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-catalyst-paper">
      <HomeHero />
      <AboutSection />
      <GallerySection />
      <MarqueeSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
