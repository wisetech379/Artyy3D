import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle, Instagram } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Reveal, SectionHeading, StarRating } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CustomOrderModal } from '@/components/CustomOrderModal';
import { testimonials, faqs } from '@/data';
import type { Product } from '@/types';
import * as Icons from 'lucide-react';

const features = [
  { icon: 'Gem', title: 'Premium Quality', text: 'Materials chosen to last and finishes worth keeping.' },
  { icon: 'Zap', title: 'Fast Delivery', text: 'Most orders leave our studio in days, not weeks.' },
  { icon: 'Wallet', title: 'Affordable Prices', text: 'Fair pricing without cutting corners on craft.' },
  { icon: 'Palette', title: 'Custom Designs', text: 'Your idea, our guidance, a result that is yours.' },
  { icon: 'ShieldCheck', title: 'Reliable Service', text: 'Clear communication from proof to doorstep.' },
  { icon: 'Headphones', title: 'Customer Support', text: 'Real people who care about how it turns out.' },
];

const steps = [
  { num: '01', title: 'Choose Your Product', text: 'Browse the catalog or start a custom order.' },
  { num: '02', title: 'Upload Your Design', text: 'Share your file or describe your idea to us.' },
  { num: '03', title: 'We Print It', text: 'We prepare a proof and bring it to life.' },
  { num: '04', title: 'Receive Your Order', text: 'Delivered to your door, ready to use or gift.' },
];

export default function Home() {
  useSEO({ title: 'Artyy 3D | Custom 3D Printing & Products', description: 'Premium printing solutions with creative designs and fast delivery.' });
  const [customOpen, setCustomOpen] = useState(false);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    const API_BASE = 'https://grateful-elegance-production-8692.up.railway.app/api';
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/Products`);
        const data = await res.json();
        const mapped: Product[] = (data || []).map((item: any) => ({
          id: String(item.id),
          name: item.name ?? 'Unknown Product',
          description: item.description ?? '',
          category: (item.category ?? 'Custom') as any,
          price: Number(item.price ?? 0),
          images: item.images && item.images.length ? item.images : item.imageUrl ? [item.imageUrl] : ['/img/placeholder.png'],
          rating: Number(item.rating ?? 0),
          reviews: Number(item.reviews ?? 0),
          dimensions: item.dimensions ?? '',
          colors: item.colors ?? [],
          sizes: item.sizes ?? [],
          stock: Number(item.stock ?? 0),
          featured: Boolean(item.featured ?? false),
        }));

        setFeatured(mapped.filter((p) => p.featured).slice(0, 4));
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };

    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/326513/pexels-photo-326513.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink" />
        </div>
        <div className="relative mx-auto max-w-8xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-xs font-medium text-ember">
                <Sparkles size={14} /> Custom Printing & 3D-Printed Products
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
                Bring Your Ideas to Life with <span className="text-yellow-500">3D Print</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 text-balance">
                Professional printing solutions with premium quality, creative designs, and fast delivery.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className=" bg-black rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-yellow-500 transition-all hover:border-white/40 "
                >
                  Start Your Order
                </Link>
                <button
                  onClick={() => setCustomOpen(true)}
                  className="rounded-full bg-yellow-500 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-orange-500 cursor-pointer"
                >
                  Create Custom Order
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Featured"
            title="Crafted with intention"
            subtitle="A curated selection of our most-loved pieces, ready to ship or customize."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xl font-semibold text-yellow-500 transition-colors hover:text-ember"
          >
            View all products <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* About Preview */}
      <section className="border-y border-white/5 bg-surface">
        <div className="mx-auto grid max-w-8xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/16307279/pexels-photo-16307279.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="3D studio workspace"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">About Artyy 3D</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl text-balance">
              Where craft, technology, and creativity meet
            </h2>
            <p className="mt-4 text-white/50">
              We are a modern printing studio combining precise technology with an eye for design. From custom 3D-printed decor to bespoke objects, every order is treated as a piece worth being proud of.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/60">
              {['Creativity', 'Quality', 'Customization', 'Fast service'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" /> {item}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-ember hover:text-ember"
            >
              Learn More <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why Choose */}
      <section className="border-y border-white/5 bg-surface">
        <div className="mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Why Artyy 3D" title="Built on trust and craft" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[feature.icon] ?? Icons.Sparkles;
              return (
                <Reveal key={feature.title} delay={i * 60}>
                  <div className="flex gap-4 rounded-2xl border border-white/5 bg-ink p-6 transition-colors hover:border-white/10">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="mt-1 text-sm text-white/50">{feature.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="How It Works" title="From idea to doorstep in four steps" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 100}>
              <div className="relative rounded-2xl border border-white/5 bg-surface p-6">
                <span className="text-4xl font-bold text-ember/20">{step.num}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-white/50">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Custom Project CTA */}
      <section className="border-y border-white/5 bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold text-white sm:text-4xl text-balance">Have Your Own Design?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/50 text-balance">
              Upload your idea and let us turn it into a high-quality 3D-printed product.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setCustomOpen(true)}
                className="rounded-full bg-yellow-500 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-orange-500 cursor-pointer"
              >
                Create Custom Order
              </button>
              <a
                href="https://wa.me/qr/IIVQNI2KFWDWC1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href="https://www.instagram.com/artyy.3d?stkn=bWVtcm9vaWZkaThn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials / Showcase */}
      <section className="mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Showcase" title="Loved by makers and brands" />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-surface p-6">
                <StarRating rating={t.rating} />
                <p className="mt-4 flex-1 text-white/70">"{t.review}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10 text-sm font-bold text-ember">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role} · {t.product}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-8xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          </Reveal>
          <div className="mt-12">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      <CustomOrderModal isOpen={customOpen} onClose={() => setCustomOpen(false)} />
    </div>
  );
}