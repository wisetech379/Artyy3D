import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AdminLayout from '../layouts/AdminLayout';
import api from '../../utils/api';

const statuses = ['Pending', 'Confirmed', 'Printing', 'Shipped', 'Delivered', 'Cancelled'];

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedColor: string;
  selectedSize: string;
  productImage?: string; 
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

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<Order[]>('/Orders');
      setItems(res.data || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      toast.error('Failed to load orders from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id: number, status: string) {
    try {
      await api.put(`/Orders/${id}/status`, { status });
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
      toast.success(`Order #${id} status updated to ${status}`);
    } catch (err: any) {
      console.error('Update status error:', err);
      const msg = err.response?.data?.message || 'Failed to update status on server';
      toast.error(msg);
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20';
      case 'printing':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20';
      case 'shipped':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700';
    }
  };

  const filtered = items.filter(
    (o) =>
      (q
        ? o.id.toString().includes(q) ||
          (o.customerName && o.customerName.toLowerCase().includes(q.toLowerCase())) ||
          (o.customerEmail && o.customerEmail.toLowerCase().includes(q.toLowerCase()))
        : true) && (filter ? o.status.toLowerCase() === filter.toLowerCase() : true)
  );

  return (
    <AdminLayout>
      <div className="space-y-6 text-white max-w-full overflow-hidden">
        {/* Header & Controls */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-orange-500">Orders Management</h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">View customer orders and track fulfillment status.</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <input
              placeholder="Search by ID, name, email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-orange-500 w-full sm:w-64 shadow-md"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-white outline-none transition-colors focus:border-orange-500 shadow-md cursor-pointer"
            >
              <option value="" className="bg-neutral-900">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-neutral-900">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-neutral-300 min-w-[700px]">
              <thead className="border-b border-white/10 bg-black/40 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Order ID</th>
                  <th className="px-4 sm:px-6 py-4">Customer</th>
                  <th className="px-4 sm:px-6 py-4">Date</th>
                  <th className="px-4 sm:px-6 py-4">Total</th>
                  <th className="px-4 sm:px-6 py-4">Payment</th>
                  <th className="px-4 sm:px-6 py-4">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-white">#{o.id}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="font-medium text-white">{o.customerName || 'Customer'}</p>
                        <p className="text-xs text-neutral-400">{o.customerEmail}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-neutral-400">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-GB') : '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-semibold text-orange-400">
                        {Number(o.totalAmount || 0).toFixed(2)} EGP
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-medium uppercase text-neutral-300">
                        {o.paymentMethod || 'COD'}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            className={`cursor-pointer appearance-none rounded-lg border px-3 py-1.5 pr-7 text-xs font-semibold tracking-wide outline-none transition-all shadow-sm ${getStatusStyles(
                              o.status
                            )}`}
                          >
                            {statuses.map((s) => (
                              <option
                                key={s}
                                value={s}
                                className="bg-neutral-900 py-1.5 text-white"
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-neutral-400">
                            ▼
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="rounded-lg border border-white/10 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-200 transition-colors hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 shadow-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Order Details #{selectedOrder.id}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Placed: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '-'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-sm">
                <div className="space-y-1.5 rounded-xl border border-white/10 bg-black/30 p-4 text-neutral-300">
                  <p><span className="text-neutral-500">Customer:</span> <strong className="text-white">{selectedOrder.customerName}</strong></p>
                  <p><span className="text-neutral-500">Email:</span> <span className="text-white">{selectedOrder.customerEmail}</span></p>
                  <p><span className="text-neutral-500">Phone:</span> <span className="text-white">{selectedOrder.phone}</span></p>
                  <p><span className="text-neutral-500">Address:</span> <span className="text-white">{selectedOrder.shippingAddress}</span></p>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Items Ordered
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/50 p-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-12 w-12 rounded-lg object-cover border border-white/10"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800 text-xs text-neutral-500">
                                No Img
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-white">{item.productName}</p>
                              <p className="text-xs text-neutral-400">
                                Color: {item.selectedColor || '-'} | Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-orange-400">
                            {Number(item.totalPrice || 0).toFixed(2)} EGP
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-500">No item details available.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-neutral-400">Total Amount:</span>
                  <span className="text-xl font-bold text-orange-400">
                    {Number(selectedOrder.totalAmount || 0).toFixed(2)} EGP
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}