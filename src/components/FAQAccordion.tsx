import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/types';

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/5 rounded-2xl border border-white/5 bg-surface">
      {faqs.map((faq, i) => (
        <div key={faq.question}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="font-medium text-white">{faq.question}</span>
            <ChevronDown
              size={20}
              className={`shrink-0 text-white/40 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ${
              open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-5 text-sm text-white/50">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
