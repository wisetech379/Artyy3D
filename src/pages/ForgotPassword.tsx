import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Boxes, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  useSEO({ title: '3Print | Forgot Password', description: 'Reset your 3Print account password.' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ember text-white">
            <Boxes size={24} />
          </span>
          <h1 className="text-2xl font-bold text-white">Forgot password</h1>
          <p className="mt-2 text-sm text-white/50">Enter your email and we will send a reset link</p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-white/5 bg-surface p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-green-400" />
            <h2 className="mt-4 text-lg font-semibold text-white">Check your inbox</h2>
            <p className="mt-2 text-sm text-white/50">If an account exists for that email, a reset link is on its way.</p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ember hover:text-orange-500"
            >
              <ArrowLeft size={15} /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-white/5 bg-surface p-6 sm:p-8">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-ember focus:outline-none"
                placeholder="you@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ember py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-white/50">
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-ember hover:text-orange-500">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
