import React, { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { DollarSign, ShoppingBag, Users, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: {
    id: number;
    customer: string;
    total: number;
    status: string;
    date: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get<DashboardStats>('/Orders/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load statistics from server');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'printing':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-white max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-orange-500 tracking-tight flex items-center gap-2">
              <TrendingUp className="text-orange-500 shrink-0" size={24} /> Dashboard Overview
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              Real-time business performance and printing queue statistics.
            </p>
          </div>
        </div>

        {/* الكروت الإحصائية الأربعة */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Total Revenue
              </span>
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-2 text-orange-400 shrink-0">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white truncate">
              {loading ? '...' : `${Number(stats?.totalRevenue || 0).toFixed(2)} EGP`}
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">From all completed & active orders</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Total Orders
              </span>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 shrink-0">
                <ShoppingBag size={18} />
              </div>
            </div>
            <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white">
              {loading ? '...' : stats?.totalOrders || 0}
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">Lifetime orders placed</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Queue & Pending
              </span>
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-2 text-yellow-400 shrink-0">
                <Clock size={18} />
              </div>
            </div>
            <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white">
              {loading ? '...' : stats?.pendingOrders || 0}
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">Pending / currently in print</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Registered Customers
              </span>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
                <Users size={18} />
              </div>
            </div>
            <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white">
              {loading ? '...' : stats?.totalCustomers || 0}
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-neutral-500">Total registered user accounts</p>
          </div>
        </div>

        {/* جدول آخر الطلبات */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-4">
            <h2 className="text-sm sm:text-base font-semibold text-white">Recent Orders</h2>
            <a
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 transition-colors hover:text-orange-300"
            >
              View all orders <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-neutral-300 min-w-[600px]">
              <thead className="bg-black/40 text-xs font-semibold uppercase tracking-wider text-neutral-400 border-b border-white/10">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5">Order ID</th>
                  <th className="px-4 sm:px-6 py-3.5">Customer</th>
                  <th className="px-4 sm:px-6 py-3.5">Date</th>
                  <th className="px-4 sm:px-6 py-3.5">Total</th>
                  <th className="px-4 sm:px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      Loading statistics...
                    </td>
                  </tr>
                ) : !stats?.recentOrders?.length ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-white">#{order.id}</td>
                      <td className="px-4 sm:px-6 py-4 font-medium text-white">{order.customer}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-neutral-400">{order.date}</td>
                      <td className="px-4 sm:px-6 py-4 font-semibold text-orange-400">
                        {Number(order.total).toFixed(2)} EGP
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}