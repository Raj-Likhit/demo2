import Image from "next/image";
import FaqAccordion, { type FaqData } from "@/components/ui/faq-accordion";

/**
 * FAQ content supplied for DevCatalyst.
 * Please confirm recruitment, event, certificate, and mentoring policies with club leads
 * before publishing these answers publicly.
 */
const FAQ_DATA: FaqData = {
  items: [
    {
      id: "join-who",
      category: "Joining",
      question: "Who can join DevCatalyst?",
      answer:
        "Any student at our college, from any branch and any year. You don’t have to study computer science. If you’re curious about building things, you belong here.",
    },
    {
      id: "join-coding",
      category: "Joining",
      question: "Do I need to know how to code?",
      answer:
        "No. We run beginner tracks alongside advanced ones, so you can start from zero or jump straight into a project. Willingness to learn matters more than what you already know.",
    },
    {
      id: "join-how",
      category: "Joining",
      question: "How do I become a member?",
      answer:
        "Fill out the join form when recruitment opens each semester. It’s a short application followed by an informal chat with the core team. It isn’t a technical exam.",
    },
    {
      id: "join-time",
      category: "Joining",
      question: "How much time do I need to commit?",
      answer:
        "As much as you can give. Most members attend our regular sessions and work on a project at their own pace. Academics always come first.",
    },
    {
      id: "events-kinds",
      category: "Events",
      question: "What kind of events do you run?",
      answer:
        "Workshops, tech talks, coding contests, build nights, and hackathons. We announce every event on our channels ahead of time.",
    },
    {
      id: "events-hackathons",
      category: "Events",
      question: "Do you organise hackathons?",
      answer:
        "Yes. We host our own and send teams to external ones, so you can build with friends even if you’ve never entered a hackathon before.",
    },
    {
      id: "events-open",
      category: "Events",
      question: "Are events open to non-members?",
      answer:
        "Most are. Members get priority when seats or team slots are limited.",
    },
    {
      id: "events-certificates",
      category: "Events",
      question: "Will I get a certificate?",
      answer:
        "Participants and winners receive certificates for our events. Members who ship projects also get recognised, which looks good on a resume or LinkedIn profile.",
    },
    {
      id: "projects-real",
      category: "Projects",
      question: "Can I work on real projects?",
      answer:
        "Yes. Members team up to build things like this website, tools for the campus, and hackathon entries. You’ll practice Git, code reviews, and shipping, the way software gets built outside the classroom.",
    },
    {
      id: "projects-pitch",
      category: "Projects",
      question: "Can I pitch my own idea?",
      answer:
        "Please do. Bring it to the core team, and if it’s solid we’ll help you find teammates, mentors, and resources to get started.",
    },
    {
      id: "projects-mentorship",
      category: "Projects",
      question: "Will I get mentorship?",
      answer:
        "Yes. Seniors and alumni guide newer members through code reviews, project planning, and career questions.",
    },
    {
      id: "projects-placements",
      category: "Projects",
      question: "Does this help with internships and placements?",
      answer:
        "There’s no guarantee, but you’ll leave with shipped projects, teamwork experience, and a public portfolio, which is what recruiters look for.",
    },
  ],
};

export default function FAQSection() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative w-full scroll-mt-24 overflow-hidden bg-white text-black"
    >
      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 lg:grid-cols-[minmax(0,0.625fr)_minmax(0,1fr)]">
        {/* Illustration panel */}
        <div className="relative h-[min(64vw,320px)] min-h-[210px] overflow-hidden bg-white sm:h-[min(72vw,560px)] sm:min-h-0 lg:h-[min(52vw,760px)] lg:min-h-[640px]">
          <Image
            src="/faq-students.webp"
            alt="Hand-drawn illustration of college students gathered around a Frequently Asked Questions sign"
            fill
            sizes="(max-width: 1023px) 100vw, 52vw"
            className="object-cover object-[center_68%] sm:object-contain sm:object-left-bottom"
          />
        </div>

        {/* Interactive question explorer */}
        <div className="flex min-h-[min(64vw,320px)] min-w-0 items-start px-5 py-6 sm:min-h-[min(72vw,560px)] sm:px-8 sm:py-10 lg:min-h-[640px] lg:items-center lg:justify-center lg:px-8 lg:py-12 xl:px-12">
          <FaqAccordion data={FAQ_DATA} />
        </div>
      </div>
    </section>
  );
}
