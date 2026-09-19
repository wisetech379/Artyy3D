import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import AdminLayout from '../layouts/AdminLayout';
import { Sparkles, Plus, X, Download, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'https://localhost:7254';

export interface CustomOrder {
  id: number;
  customerName: string;
  phone: string;
  email?: string;
  productType: string;
  quantity: number;
  color: string;
  notes?: string;
  status: string;
  createdAt?: string;
  filePath?: string;
  imageUrl?: string;
  image?: string;
}

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    productType: 'Home',
    quantity: 1,
    color: '',
    notes: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Home', 'Makeup', 'Doctors', 'Cars', 'Graduation Projects'];

  const fetchCustomOrders = async () => {
    try {
      const response = await api.get<CustomOrder[]>('/CustomOrders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/CustomOrders/${id}/status`, { status: newStatus });
      fetchCustomOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-neutral-800 text-neutral-300 border-white/10';
    }
  };

  const getImageUrl = (order: CustomOrder) => {
    const path = order.filePath || order.imageUrl || order.image;
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/${path}`;
  };

  const handleDownloadImage = async (imageUrl: string, orderId: number) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();

      const extMatch = imageUrl.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
      const extension = extMatch ? extMatch[1] : 'jpg';

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `order-${orderId}-design.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('فشل تحميل الصورة. حاول مرة أخرى.');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('CustomerName', formData.customerName);
      data.append('Phone', formData.phone);
      data.append('Email', formData.email || '');
      data.append('Address', formData.address || '');
      data.append('ProductType', formData.productType);
      data.append('Quantity', formData.quantity.toString());
      data.append('Color', formData.color);
      data.append('Notes', formData.notes);
      if (file) {
        data.append('file', file);
      }

      await api.post('/CustomOrders', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsCreateModalOpen(false);
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        productType: 'Home',
        quantity: 1,
        color: '',
        notes: ''
      });
      setFile(null);
      fetchCustomOrders();
    } catch (error) {
      console.error('Error creating custom order:', error);
      alert('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-neutral-400">
          جاري تحميل الطلبات المخصصة...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <Sparkles size={24} /> Custom Orders Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1">View customer custom print requests and track status.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-600/20 shrink-0"
          >
            <Plus size={16} /> Add New Order
          </button>
        </div>

        {/* Orders Table Container */}
        <div className="bg-neutral-900/70 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="border-b border-white/10 bg-black/40 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product & Details</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  const imageUrl = getImageUrl(order);
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-white">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Order ${order.id} design`}
                            onClick={() => setSelectedOrder(order)}
                            className="w-12 h-12 object-cover rounded-xl border border-white/10 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-dashed border-white/15 text-neutral-500 text-xs">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">{order.email || order.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{order.productType}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">{order.quantity} قطع - {order.color}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`cursor-pointer appearance-none rounded-xl border px-3 py-1.5 pr-8 text-xs font-semibold tracking-wide outline-none transition-all shadow-sm ${getStatusStyles(
                            order.status
                          )}`}
                        >
                          <option value="Pending" className="bg-neutral-900 text-white">Pending</option>
                          <option value="Processing" className="bg-neutral-900 text-white">Processing</option>
                          <option value="Completed" className="bg-neutral-900 text-white">Completed</option>
                          <option value="Cancelled" className="bg-neutral-900 text-white">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 border border-white/10 bg-white/5 rounded-xl text-neutral-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 transition-colors text-xs font-semibold shadow-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                      لا توجد طلبات مخصصة حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Custom Order Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto text-white">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-5 border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white">Create Custom Order</h2>
                <p className="text-xs text-neutral-400 mt-1">Fill out the details below to request your custom print.</p>
              </div>

              <form onSubmit={handleCreateOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="auto">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01000000000"
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g. Matte Black, Red"
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Product Type - Pill Buttons */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Product Type</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = formData.productType === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, productType: cat })}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                              : 'bg-neutral-800 text-neutral-300 border-white/10 hover:border-orange-500/50 hover:bg-white/5'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Design Upload</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20 cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about your vision..."
                    className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 mt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-600/20"
                  >
                    {submitting ? 'Submitting...' : 'Submit Custom Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl max-w-xl w-full p-6 relative text-white max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-4 border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white">Custom Order Details #{selectedOrder.id}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Placed: {selectedOrder.createdAt}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-300">
                <div className="bg-neutral-800/60 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                  <p className="font-semibold text-white mb-1.5 border-b border-white/10 pb-1 text-orange-400">Customer Info</p>
                  <p><span className="font-medium text-neutral-400">Name:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium text-neutral-400">Phone:</span> {selectedOrder.phone}</p>
                  <p><span className="font-medium text-neutral-400">Email:</span> {selectedOrder.email || 'N/A'}</p>
                </div>

                <div className="bg-neutral-800/60 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                  <p className="font-semibold text-white mb-1.5 border-b border-white/10 pb-1 text-orange-400">Product Specs</p>
                  <p><span className="font-medium text-neutral-400">Type:</span> {selectedOrder.productType}</p>
                  <p><span className="font-medium text-neutral-400">Quantity:</span> {selectedOrder.quantity}</p>
                  <p><span className="font-medium text-neutral-400">Color:</span> {selectedOrder.color}</p>
                  <p className="truncate"><span className="font-medium text-neutral-400">Notes:</span> {selectedOrder.notes || 'None'}</p>
                </div>
              </div>

              {(() => {
                const imageUrl = getImageUrl(selectedOrder);
                if (!imageUrl) return null;
                return (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                    <div className="flex items-center gap-3">
                      <img
                        src={imageUrl}
                        alt={`Order ${selectedOrder.id} design`}
                        className="h-14 w-14 rounded-xl border border-white/10 object-cover shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-white block">Attached Design File</span>
                        <span className="text-[11px] text-neutral-400">Ready to download</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadImage(imageUrl, selectedOrder.id)}
                      className="px-3.5 py-2 bg-orange-600 text-white rounded-xl text-xs font-medium hover:bg-orange-500 transition-colors flex items-center gap-1.5 shadow-md shadow-orange-600/20"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                );
              })()}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}