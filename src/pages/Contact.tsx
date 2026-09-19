import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Loader2, Instagram, Facebook } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Reveal } from '@/components/ui';
import { useToast } from '@/context/ToastContext';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+1 (555) 014-7788' },
  { icon: Mail, label: 'Email', value: 'hello@3print.studio' },
  { icon: MapPin, label: 'Location', value: 'Studio District, Downtown' },
  { icon: Clock, label: 'Working Hours', value: 'Mon–Sat, 9am–7pm' },
];

export default function Contact() {
  useSEO({ title: '3Print | Contact', description: 'Get in touch with the 3Print studio.' });
  const { notify } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      reset();
      notify('Message sent. We will get back to you soon.');
    }, 1200);
  };

  return (
    <div>
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Contact</span>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl text-balance">
              Let's talk about your project
            </h1>
            <p className="mt-4 max-w-xl text-white/50">Questions, quotes, or ideas — send them over and we will come back with a clear answer.</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <Reveal>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Full Name</label>
                  <input
                    {...register('name')}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-ember focus:outline-none"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-ember focus:outline-none"
                    placeholder="you@email.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Phone</label>
                  <input
                    {...register('phone')}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-ember focus:outline-none"
                    placeholder="+1 555 000 0000"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Subject</label>
                  <input
                    {...register('subject')}
                    className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-ember focus:outline-none"
                    placeholder="How can we help?"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Message</label>
                <textarea
                  rows={5}
                  {...register('message')}
                  className="w-full resize-none rounded-lg border border-white/10 bg-surface px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-ember focus:outline-none"
                  placeholder="Tell us about your project..."
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ember py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </Reveal>

          {/* Info */}
          <Reveal delay={150}>
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((info) => (
                <div key={info.label} className="rounded-2xl border border-white/5 bg-surface p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember/10 text-ember">
                    <info.icon size={20} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">{info.label}</h3>
                  <p className="mt-1 text-sm text-white/50">{info.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/5 bg-surface p-6">
              <h3 className="text-sm font-semibold text-white">Follow us</h3>
              <div className="mt-4 flex gap-3">
                <a href="#" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-colors hover:border-ember hover:text-ember">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-colors hover:border-ember hover:text-ember">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
