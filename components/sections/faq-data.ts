export const FAQ_CATEGORIES = ["Events", "Collaborations", "Joining the Community", "Other Questions"] as const;

type FaqItem = {
  category: typeof FAQ_CATEGORIES[number];
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Events",
    question: "What kind of events does DevCatalyst organize?",
    answer: "DevCatalyst organizes technical workshops, hands-on sessions, hackathons, tech talks, networking events, and other activities focused on helping students and young professionals grow in technology.",
  },
  {
    category: "Events",
    question: "Can I attend a DevCatalyst event if I'm not a member?",
    answer: "Absolutely! You can attend our events even if you're not a DevCatalyst member. However, we highly recommend joining our community to stay connected and receive relevant updates.",
  },
  {
    category: "Events",
    question: "How can I register for a DevCatalyst event?",
    answer: "You can register through the event-specific registration link shared on our official platforms.",
  },
  {
    category: "Events",
    question: "Are DevCatalyst events free?",
    answer: "It depends on the event. Some events are free, while others may have a registration fee. Check the respective event announcement for details.",
  },
  {
    category: "Collaborations",
    question: "How can I collaborate with DevCatalyst?",
    answer: "We are open to collaborations with communities, organizations, institutions, speakers, and companies. You can reach out to us at partnerships@devcatalyst.in.",
  },
  {
    category: "Collaborations",
    question: "What is the process for collaborating with DevCatalyst?",
    answer: "Once you share your collaboration proposal, our team will review it. We will then arrange an initial meeting to understand your goals, expectations, and possible areas of collaboration. Based on the discussion, we'll take things forward together.",
  },
  {
    category: "Collaborations",
    question: "Can I collaborate with DevCatalyst to organize an event or workshop?",
    answer: "Yes! We welcome collaborations for technical workshops, hackathons, speaker sessions, community events, and other initiatives. Send us your proposal through our partnerships email.",
  },
  {
    category: "Collaborations",
    question: "Can I become a speaker or conduct a workshop through DevCatalyst?",
    answer: "Absolutely! If you have expertise in a particular technology and would like to share your knowledge with our community, reach out to us with your topic and a brief introduction.",
  },
  {
    category: "Joining the Community",
    question: "What is DevCatalyst?",
    answer: "DevCatalyst is a tech community that brings together students and young professionals who are passionate about technology. We organize workshops, events, and community activities to help members learn, grow, and connect with like-minded people.",
  },
  {
    category: "Joining the Community",
    question: "Who can join DevCatalyst?",
    answer: "DevCatalyst is open to students and early-career professionals who are interested in technology, learning new skills, and connecting with like-minded people.",
  },
  {
    category: "Joining the Community",
    question: "How can I become a DevCatalyst member?",
    answer: "You can join our community through our official community joining link.",
  },
  {
    category: "Joining the Community",
    question: "Do I need prior technical knowledge to join?",
    answer: "Not at all! Whether you're a beginner or someone with experience in technology, you're welcome to be part of DevCatalyst.",
  },
  {
    category: "Joining the Community",
    question: "Can I volunteer for DevCatalyst events?",
    answer: "Yes! Whenever we have volunteer opportunities, we open registration forms for individual events. You can fill out the respective form to express your interest in volunteering.",
  },
  {
    category: "Joining the Community",
    question: "How can I stay connected with DevCatalyst?",
    answer: "Follow our official social media pages and join our community channels for announcements, event updates, and opportunities.",
  },
  {
    category: "Other Questions",
    question: "Is DevCatalyst only for Computer Science students?",
    answer: "No! Anyone interested in technology and learning is welcome, regardless of their academic background or branch.",
  },
  {
    category: "Other Questions",
    question: "What can I gain from being part of DevCatalyst?",
    answer: "You get opportunities to learn from industry professionals, participate in technical events, connect with fellow tech enthusiasts, exchange ideas, and explore new opportunities.",
  },
  {
    category: "Other Questions",
    question: "Can I suggest topics for future workshops or events?",
    answer: "Absolutely! We encourage community members to share their ideas and suggest topics they'd like us to cover. You can email your suggestions to contact@devcatalyst.in.",
  },
  {
    category: "Other Questions",
    question: "How can I contact the DevCatalyst team?",
    answer: "For general queries, suggestions, or feedback, reach us at contact@devcatalyst.in.\n\nFor partnerships and collaborations, email partnerships@devcatalyst.in.",
  },
];
