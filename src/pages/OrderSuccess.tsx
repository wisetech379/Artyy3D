import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Mail, ArrowRight, Home } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function OrderSuccess() {
  useSEO({ title: '3Print | Order Confirmed', description: 'Your order was placed successfully.' });
  const location = useLocation();
  const state = location.state as { orderId?: string | number; email?: string } | undefined;

  // إذا حاول المستخدم فتح الصفحة يدوياً بدون عمل طلب، يتم تحويله للمنتجات
  if (!state?.orderId) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-surface/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        {/* أيقونة النجاح */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-400 ring-1 ring-green-500/30">
          <CheckCircle2 size={46} />
        </div>

        <span className="mt-6 inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
          Order Confirmed
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Thank You For Your Order!
        </h1>

        <p className="mt-3 text-base text-white/60">
          We’ve received your order and our 3D printing workshop has begun preparing it.
        </p>

        {/* كارت تفاصيل رقم الأوردر والإيميل */}
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-black/40 p-5 text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-white/60">
              <PackageCheck size={18} className="text-orange-400" />
              <span className="text-xs uppercase tracking-wider">Order Number</span>
            </div>
            <span className="font-mono text-base font-bold text-white">
              #{state.orderId}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60">
              <Mail size={18} className="text-orange-400" />
              <span className="text-xs uppercase tracking-wider">Confirmation Sent To</span>
            </div>
            <span className="text-sm font-medium text-white truncate max-w-[180px]">
              {state.email || 'Your Email'}
            </span>
          </div>
        </div>

        {/* أزرار التنقل */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/80 transition-all hover:border-white/30 hover:text-white"
          >
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}