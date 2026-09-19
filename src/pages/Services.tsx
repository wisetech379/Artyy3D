import { useSEO } from '@/hooks/useSEO';

export default function Services() {
  useSEO({
    title: '3Print | Services',
    description: 'Custom printing, apparel, and product design services.',
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember">Services</p>
      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Services coming soon</h1>
      <p className="mt-4 text-lg text-white/60">
        Our service catalog is being prepared. Please check back soon.
      </p>
    </div>
  );
}
