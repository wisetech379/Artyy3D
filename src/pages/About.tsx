import { Link } from 'react-router-dom';
import { ArrowRight, Gem, Zap, Palette, Users } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Reveal, SectionHeading } from '@/components/ui';

const values = [
  { icon: Gem, title: 'Our Mission', text: 'To make premium printing accessible, personal, and worth keeping.' },
  { icon: Palette, title: 'Our Vision', text: 'A studio where any idea can become a tangible, beautiful object.' },
  { icon: Zap, title: 'Quality & Materials', text: 'We choose papers, fabrics, and filaments that respect the design and the person using it.' },
  { icon: Users, title: 'Why Customers Choose Us', text: 'Because we treat every order as if our name is on it — because it is.' },
];

export default function About() {
  useSEO({ title: '3Print | About', description: 'Where craft, technology, and creativity meet.' });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/38094565/pexels-photo-38094565.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 to-ink" />
        </div>
        <div className="relative mx-auto max-w-8xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">About 3Print</span>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              A modern studio for printed things worth keeping
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/60 text-balance">
              We combine precise printing technology with an editorial eye for design. The result is work that feels considered, not mass-produced.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Our Story</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Started with a single print</h2>
            <p className="mt-4 text-white/50">
              3Print began as a small studio with one printer and a simple belief: that custom products should feel personal, not generic. Today we work with individuals, studios, and brands across apparel, decor, stationery, and 3D-printed objects — but the belief has not changed.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/38555188/pexels-photo-38555188.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="3Print studio"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/5 bg-surface">
        <div className="mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="What drives us" title="Mission, vision, and values" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-ink p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember/10 text-ember">
                    <value.icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{value.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-white sm:text-4xl text-balance">Let's make something together</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/50">Browse our catalog or start a custom order — we will guide you from idea to delivery.</p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-orange-500"
          >
            Browse catalog <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
