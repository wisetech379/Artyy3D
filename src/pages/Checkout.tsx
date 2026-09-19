import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ShieldCheck, Smartphone, Wallet, ExternalLink, Copy, CheckCircle, MapPin, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/format';
import { authFetch } from '@/services/auth';


const INSTAPAY_USERNAME = 'faresyoussef423@instapay'; 
const INSTAPAY_PAY_LINK = 'https://ipn.eg/S/faresyoussef423/instapay/9lcZqf';
// --------------------------------------


const AVAILABLE_COLORS = ['أسود (Black)', 'أبيض (White)', 'رمادي (Gray)', 'أحمر (Red)', 'أزرق (Blue)', 'أصفر (Yellow)', 'ذهبي (Gold)', 'فضي (Silver)'];

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  postal: z.string().min(3, 'Postal code is required'),
  payment: z.enum(['cod', 'instapay']),
});

type FormData = z.infer<typeof schema>;

export default function Checkout() {
  useSEO({ title: '3Print | Checkout', description: 'Complete your order securely.' });
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // حالة لتخزين الألوان المخصصة لكل منتج في العربة
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { payment: 'cod', city: 'طنطا' },
  });

  const selectedPayment = watch('payment');

  useEffect(() => {
    if (user) {
      reset((prev: FormData) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user, reset]);

  // تحديث اللون المحلي لمنتج معين
  const handleColorChange = (itemKey: string, color: string) => {
    setSelectedColors(prev => ({ ...prev, [itemKey]: color }));
  };

  // --- دالة نسخ المعرف وفتح التطبيق ---
  const handleCopyAndPay = () => {
    navigator.clipboard.writeText(INSTAPAY_USERNAME).then(() => {
      toast.success('InstaPay ID copied! Please paste it in the app.', {
        icon: <CheckCircle size={18} className="text-emerald-400" />,
      });
      window.open(INSTAPAY_PAY_LINK, '_blank');
    }).catch(() => {
      toast.error('Failed to copy ID. Please try again manually.');
    });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);

    const orderPayload = {
      customerName: data.name,
      customerEmail: data.email,
      phone: data.phone,
      shippingAddress: `${data.address}, ${data.area}, ${data.city} (${data.postal})`,
      paymentMethod: data.payment === 'instapay' ? 'InstaPay' : 'Cash on Delivery',
      shippingCost: 0, // الشحن سيتم تنسيقه لاحقاً
      totalAmount: subtotal,
      items: items.map((item) => {
        const itemKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
        return {
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          selectedColor: selectedColors[itemKey] || item.selectedColor || 'أسود (Black)',
        };
      }),
    };

    try {
      const response = await authFetch('https://localhost:7254/api/Orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        let orderId = Math.floor(100000 + Math.random() * 900000);
        try {
          const resData = await response.json();
          if (resData && (resData.id || resData.orderId)) {
            orderId = resData.id || resData.orderId;
          }
        } catch {
          // ignore parse error if response body is empty or not json
        }

        clear();
        toast.success('Order Placed Successfully! 🎉', {
          description: `Confirmation email sent to ${data.email}. We will contact you regarding shipping.`,
        });

        navigate('/order-success', {
          state: { orderId, email: data.email, paymentMethod: data.payment },
          replace: true,
        });
      } else {
        const err = await response.text();
        toast.error('Order Submission Failed', {
          description: err || 'Please verify your details and try again.',
        });
      }
    } catch (error) {
      console.error('Order Submission Error:', error);
      toast.error('Network Error', {
        description: 'Unable to reach the server. Please check your connection.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-white/50">Your cart is empty.</p>
        <Link to="/products" className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-500">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Checkout</h1>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          <ShieldCheck size={14} />
          Secure Checkout
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          {/* Customer Information Section */}
          <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/20 text-ember text-xs font-bold">1</span>
              Customer Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">Full Name</label>
                <input {...register('name')} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:ring-2 focus:ring-ember/30 focus:outline-none transition-all" placeholder="Your name" />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">Email</label>
                <input type="email" {...register('email')} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:ring-2 focus:ring-ember/30 focus:outline-none transition-all" placeholder="you@email.com" />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">Phone Number</label>
                <input {...register('phone')} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:ring-2 focus:ring-ember/30 focus:outline-none transition-all" placeholder="01xxxxxxxxx" />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
              </div>
            </div>
          </section>

          {/* Shipping Address Section */}
          <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/20 text-ember text-xs font-bold">2</span>
              Shipping Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">Street Address</label>
                <input {...register('address')} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:ring-2 focus:ring-ember/30 focus:outline-none transition-all" placeholder="Street address, building, apt" />
                {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">City / Governorate</label>
                <input {...register('city')} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:ring-2 focus:ring-ember/30 focus:outline-none transition-all" placeholder="e.g., Tanta, Cairo..." />
                {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-300 flex items-center gap-1">
                  <MapPin size={14} className="text-ember" /> Area / District
                </label>
                <input {...register('area')} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:ring-2 focus:ring-ember/30 focus:outline-none transition-all" placeholder="e.g., El-Gish Street, St. Louis..." />
                {errors.area && <p className="mt-1 text-xs text-red-400">{errors.area.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-300">Postal Code</label>
                <input {...register('postal')} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:ring-2 focus:ring-ember/30 focus:outline-none transition-all" placeholder="00000" />
                {errors.postal && <p className="mt-1 text-xs text-red-400">{errors.postal.message}</p>}
              </div>
            <div className="sm:col-span-2 rounded-xl border-2 border-amber-500 bg-amber-400 p-4 text-slate-950 text-sm font-medium shadow-md">
  <span className="font-bold underline">ملاحظة الشحن:</span> بعد إتمام الطلب، سنتواصل معك هاتفياً أو عبر الواتساب لتأكيد عنوانك وتحديد تكلفة الشحن المناسبة لمحافظتك أو منطقتك بدقة.
</div>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/20 text-ember text-xs font-bold">3</span>
              Payment Method
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${selectedPayment === 'cod' ? 'border-ember bg-ember/10 text-white' : 'border-white/10 bg-black/40 text-gray-300 hover:border-white/30'}`}>
                <input type="radio" value="cod" {...register('payment')} className="accent-ember" />
                <div className="flex items-center gap-2.5">
                  <Wallet size={20} className="text-ember" />
                  <div>
                    <p className="text-sm font-semibold">Cash on Delivery</p>
                    <p className="text-[11px] text-gray-400">Pay when you receive</p>
                  </div>
                </div>
              </label>

              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${selectedPayment === 'instapay' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/10 bg-black/40 text-gray-300 hover:border-white/30'}`}>
                <input type="radio" value="instapay" {...register('payment')} className="accent-purple-500" />
                <div className="flex items-center gap-2.5">
                  <Smartphone size={20} className="text-purple-400" />
                  <div>
                    <p className="text-sm font-semibold">InstaPay (IPN)</p>
                    <p className="text-[11px] text-gray-400">Instant Mobile Payment</p>
                  </div>
                </div>
              </label>
            </div>

            {selectedPayment === 'instapay' && (
              <div className="mt-4 rounded-xl border border-purple-500/30 bg-black/60 backdrop-blur-md p-4 space-y-3">
                <p className="text-xs font-medium text-purple-400">InstaPay Fast Transfer:</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Click the button below to copy our InstaPay ID (<span className="text-purple-400 font-bold">{INSTAPAY_USERNAME}</span>) and open InstaPay to transfer the amount <span className="text-white font-bold">{formatPrice(subtotal)}</span> (Shipping will be coordinated later).
                </p>
                <button
                  type="button"
                  onClick={handleCopyAndPay}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-purple-500 shadow-lg shadow-purple-600/30"
                >
                  <Copy size={14} />
                  Copy ID & Open InstaPay
                  <ExternalLink size={14} />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right: Summary & Color Selection */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-neutral-950/80 p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-lg font-semibold text-white">Order Summary & Colors</h2>
            <ul className="mt-4 max-h-80 overflow-y-auto space-y-6 pr-1">
              {items.map((item) => {
                const itemKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
                const currentColor = selectedColors[itemKey] || item.selectedColor || AVAILABLE_COLORS[0];

                return (
                  <li key={itemKey} className="flex flex-col gap-3 border-b border-white/10 pb-4">
                    <div className="flex gap-3">
                      <img src={item.images[0]} alt={item.name} className="h-16 w-16 rounded-xl object-cover border border-white/10" />
                      <div className="flex flex-1 flex-col">
                        <h3 className="text-sm font-medium text-white truncate max-w-[180px]">{item.name}</h3>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        <span className="mt-1 text-sm font-semibold text-ember">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* خانة اختيار اللون */}
                    <div className="rounded-xl bg-black/40 p-2.5 border border-white/10">
                      <label className="text-[11px] font-semibold text-gray-300 flex items-center gap-1 mb-1.5">
                        <Palette size={13} className="text-ember" /> اختيار لون الطباعة لهذا المنتج:
                      </label>
                      <select
                        value={currentColor}
                        onChange={(e) => handleColorChange(itemKey, e.target.value)}
                        className="w-full rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-ember focus:outline-none"
                      >
                        {AVAILABLE_COLORS.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-amber-400 font-medium text-xs">سيتم التنسيق وتحديد السعر</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold">
                <span className="text-white">Total Items</span>
                <span className="text-ember text-lg">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ember to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {submitting ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}