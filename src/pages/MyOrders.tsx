import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedColor: string;
  selectedSize: string;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let email = user?.email;

    if (!email) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          email = parsed?.email;
        }
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }

    if (!email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get(`/Orders/my-orders?email=${encodeURIComponent(email)}`)
      .then((response) => {
        const data = response.data;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Fetch orders error:', err);
        toast.error('Failed to load your orders');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-950/80 px-2.5 py-1 text-xs font-medium text-emerald-300 border border-emerald-800/50">
            <CheckCircle2 size={13} className="text-emerald-400" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-950/80 px-2.5 py-1 text-xs font-medium text-sky-300 border border-sky-800/50">
            <Truck size={13} className="text-sky-400" /> Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-950/80 px-2.5 py-1 text-xs font-medium text-rose-300 border border-rose-800/50">
            <AlertCircle size={13} className="text-rose-400" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-950/80 px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-800/50">
            <Clock size={13} className="text-amber-400" /> {status || 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            <Package className="text-neutral-400 shrink-0" size={30} /> 
            <span>My 3D Print Orders</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-400">
            Track the manufacturing and delivery progress of your items.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-neutral-400 text-sm animate-pulse">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12 text-center shadow-lg">
            <Package size={48} className="mx-auto text-neutral-600 mb-3" />
            <p className="text-sm text-neutral-300">You haven't placed any 3D print orders yet.</p>
            <a
              href="/products"
              className="mt-5 inline-block rounded-lg bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-neutral-200 shadow-md cursor-pointer"
            >
              Explore Products
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 sm:p-6 shadow-xl transition-all hover:border-neutral-700"
              >
                {/* Order Top Info */}
                <div className="flex flex-col justify-between gap-3 border-b border-neutral-800 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">Order ID</span>
                    <h3 className="font-mono text-base sm:text-lg font-bold text-white">#{order.id}</h3>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-base sm:text-lg font-bold text-white">
                      {Number(order.totalAmount).toFixed(2)} EGP
                    </span>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="mt-4 space-y-2.5">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-800/60 bg-neutral-950/50 p-3 text-xs sm:text-sm"
                    >
                      <div>
                        <p className="font-medium text-white">{item.productName}</p>
                        <p className="mt-0.5 text-[11px] text-neutral-400">
                          Color: <span className="text-neutral-200">{item.selectedColor}</span> | Qty: <span className="text-neutral-200">{item.quantity}</span>
                        </p>
                      </div>
                      <span className="font-semibold text-neutral-200">
                        {Number(item.totalPrice).toFixed(2)} EGP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}