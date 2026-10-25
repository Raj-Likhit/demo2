"use client";

import { useId, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export type FaqData = {
  items: FaqItem[];
};

const COMMON_QUESTIONS = "Common questions";
const COMMON_QUESTION_IDS = new Set([
  "join-who",
  "join-coding",
  "join-how",
  "projects-real",
]);

/**
 * Reusable, monochrome FAQ explorer.
 *
 * Features:
 * - Categories are derived from the supplied data.
 * - Selecting a category opens its first question.
 * - One answer is expanded at a time.
 * - Native buttons, ARIA state, visible keyboard focus, and reduced-motion support.
 */
export default function FaqAccordion({ data }: { data: FaqData }) {
  const baseId = useId();
  const [activeCategory, setActiveCategory] = useState(COMMON_QUESTIONS);
  const [openId, setOpenId] = useState<string | null>(data.items[0]?.id ?? null);

  const categories = useMemo(
    () => [COMMON_QUESTIONS, ...Array.from(new Set(data.items.map((item) => item.category)))],
    [data.items],
  );

  const visibleItems = useMemo(
    () =>
      activeCategory === COMMON_QUESTIONS
        ? data.items.filter((item) => COMMON_QUESTION_IDS.has(item.id))
        : data.items.filter((item) => item.category === activeCategory),
    [activeCategory, data.items],
  );

  const selectCategory = (category: string) => {
    const nextItems =
      category === COMMON_QUESTIONS
        ? data.items.filter((item) => COMMON_QUESTION_IDS.has(item.id))
        : data.items.filter((item) => item.category === category);

    setActiveCategory(category);
    setOpenId(nextItems[0]?.id ?? null);
  };

  return (
    <div className="mx-auto w-full max-w-[820px] min-w-0">
      {/* Category filters */}
      <div
        role="group"
        aria-label="Filter frequently asked questions by topic"
        className="-mx-5 mb-5 flex flex-nowrap gap-2 overflow-x-auto border-b border-black/70 px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:mb-6 sm:flex-wrap sm:overflow-visible sm:px-8 sm:pb-6 lg:mx-0 lg:px-0"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectCategory(category)}
              className={`min-h-10 shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-black/70 bg-white text-black hover:bg-neutral-100"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <ul className="border-b border-black/60">
        {visibleItems.map((item) => {
          const isOpen = item.id === openId;
          const originalIndex = data.items.findIndex((entry) => entry.id === item.id);
          const buttonId = `${baseId}-button-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <li key={item.id} className="border-t border-black/60">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="grid w-full grid-cols-[30px_minmax(0,1fr)_22px] items-center gap-2.5 py-3 text-left sm:grid-cols-[44px_92px_minmax(0,1fr)_24px] sm:gap-3 sm:py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black"
                >
                  <span className="w-fit border-b border-black/70 pb-1 text-sm font-semibold tabular-nums sm:text-base">
                    {String(originalIndex + 1).padStart(2, "0")}
                  </span>

                  <span className="hidden text-[11px] text-neutral-500 sm:block sm:text-sm">
                    {item.category}
                  </span>

                  <span className="min-w-0 text-[15px] font-semibold leading-5 tracking-[-0.025em] text-black sm:text-lg sm:leading-6">
                    {item.question}
                  </span>

                  <span aria-hidden="true" className="flex justify-end text-black">
                    {isOpen ? (
                      <Minus size={20} strokeWidth={1.8} />
                    ) : (
                      <Plus size={20} strokeWidth={1.8} />
                    )}
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid grid-cols-[30px_minmax(0,1fr)_22px] gap-2.5 pb-3 sm:grid-cols-[44px_92px_minmax(0,1fr)_24px] sm:gap-3 sm:pb-3">
                    <div className="col-start-2 col-span-2 rounded-xl bg-neutral-100 px-4 py-3 text-[13px] leading-[1.65] text-neutral-700 sm:col-start-3 sm:px-5 sm:py-3 sm:text-sm">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
