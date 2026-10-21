import HomeHero from "@/components/sections/home-hero";
import WorkflowSection from "@/components/sections/workflow-section";
import AboutSection from "@/components/sections/about-section";
import GallerySection from "@/components/sections/gallery-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import FAQSection from "@/components/sections/faq-section";
import SiteFooter from "@/components/sections/site-footer";

export default function Home() {
  return <main className="min-h-screen overflow-hidden bg-[#f8f7f4]"><HomeHero /><WorkflowSection /><AboutSection /><GallerySection /><TestimonialsSection /><FAQSection /><SiteFooter /></main>;
}
