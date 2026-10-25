import FaqCatBoard from "@/components/sections/faq-cat-board";
import FaqQuestions from "@/components/sections/faq-questions";

export default function FAQSection() {
  return (
    <section className="dc-faq-section" id="faq" aria-label="Frequently asked questions">
      <FaqCatBoard />
      <FaqQuestions />
    </section>
  );
}
