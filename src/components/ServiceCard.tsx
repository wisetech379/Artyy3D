import type { Service } from '@/types';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onLearnMore?: () => void;
}

export function ServiceCard({ service, onLearnMore }: ServiceCardProps) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Sparkles;

  return (
    <div className="group flex flex-col rounded-2xl border border-white/5 bg-surface p-6 transition-all duration-300 hover:border-ember/30 hover:bg-surface-2">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-white">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
      <p className="mt-2 text-sm text-white/50">{service.description}</p>
      <ul className="mt-4 space-y-1.5">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-white/40">
            <span className="h-1 w-1 rounded-full bg-ember" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onLearnMore}
        className="mt-5 flex items-center gap-1 text-sm font-medium text-white/70 transition-colors hover:text-ember"
      >
        Learn More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
