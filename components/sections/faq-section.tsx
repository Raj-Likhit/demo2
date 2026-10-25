"use client";

import { useEffect, useRef, useState } from "react";
import { faqSvgMarkup } from "@/components/sections/faq-art";
import { installFaqCatAnimation } from "@/components/sections/faq-cat-animation";

const questions = [
  ["Joining", "Who can join DevCatalyst?", "Any student at our college, from any branch and any year. You don't have to study computer science. If you're curious about building things, you belong here."],
  ["Joining", "Do I need to know how to code?", "Not at all! Many of our members write their very first line of code at our beginner workshops. We welcome designers, builders, and complete beginners alike."],
  ["Joining", "How do I become a member?", "We open community registrations at the start of each semester. Hop into our Discord, attend an orientation session, and you're officially in!"],
  ["Joining", "How much time do I need to commit?", "It's completely flexible around your classes and exams. General members can drop into weekly sessions at their own pace, while project squads typically spend 3–5 hours a week building together."],
  ["Events", "What kind of events do you run?", "Hands-on build nights, web & AI bootcamps, open-source sprints, design jams, and fireside chats with student founders and industry engineers."],
  ["Events", "Do you organise hackathons?", "Yes! We host our flagship 24-hour campus hackathon every year, along with miniweekend buildathons where you can team up and ship a prototype from scratch."],
  ["Events", "Are events open to non-members?", "Most of our public workshops, speaker sessions, and hackathons are open to everyone on campus. Just RSVP ahead of time to grab a seat."],
  ["Events", "Will I get a certificate?", "Bootcamps, hackathons, and completed project cohorts include verified certificates—plus a real, deployed project you can showcase on your GitHub and resume."],
  ["Projects", "Can I work on real projects?", "Building real software is at the heart of DevCatalyst. You'll team up in small squads with mentors to design, build, and launch tools used by students across campus."],
];
const categories = ["All", "Joining", "Events", "Projects"];

export default function FAQSection() {
  const svgHost = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const svg = svgHost.current?.querySelector("svg");
    return svg ? installFaqCatAnimation(svg) : undefined;
  }, []);

  return (
    <section className="dc-faq-section" id="faq" aria-label="Frequently asked questions">
      <aside className="dc-faq-visual-col" aria-label="Illustrated FAQ board with two playful cats">
        <div ref={svgHost} className="dc-faq-svg-host" dangerouslySetInnerHTML={{ __html: faqSvgMarkup }} />
      </aside>
      <section className="dc-faq-content-col" aria-label="Frequently Asked Questions">
        <div className="dc-filter-bar" role="tablist" aria-label="Filter questions by category">
          {categories.map((item) => <button key={item} type="button" className={`dc-filter-btn${category === item ? " active" : ""}`} role="tab" aria-selected={category === item} onClick={() => { setCategory(item); setOpenIndex(-1); }}>{item}</button>)}
        </div>
        <div className="dc-accordion-list">
          {questions.map(([itemCategory, question, answer], index) => {
            const isOpen = openIndex === index;
            return <article className={`dc-faq-item${isOpen ? " is-open" : ""}`} data-category={itemCategory} key={question} hidden={category !== "All" && category !== itemCategory}>
              <button className="dc-faq-trigger" type="button" aria-expanded={isOpen} aria-controls={`dc-faq-answer-${index}`} onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                <span className="dc-faq-num">{String(index + 1).padStart(2, "0")}</span><span className="dc-faq-cat">{itemCategory}</span><span className="dc-faq-q">{question}</span><span className="dc-faq-icon" aria-hidden="true" />
              </button>
              <div className="dc-faq-panel" id={`dc-faq-answer-${index}`}><div className="dc-faq-panel-inner"><div className="dc-faq-answer-box">{answer}</div></div></div>
            </article>;
          })}
        </div>
      </section>
    </section>
  );
}

