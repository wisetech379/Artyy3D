import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AdminLayout from '../layouts/AdminLayout';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, Search, Trash2, Edit, Upload } from 'lucide-react';
import api from '../../utils/api';

const ALL_CATEGORIES = ['Home', 'Makeup', 'Doctors', 'Cars', 'Graduation Projects'];
const BACKEND_URL = 'https://grateful-elegance-production-8692.up.railway.app';

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setItems(response.data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products', {
        description: 'Please make sure the backend API is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function saveProduct(formData: FormData, productId?: string) {
    try {
      setSaving(true);
      const isEdit = Boolean(productId);
      const url = isEdit ? `/products/${productId}` : '/products';

      if (isEdit) {
        await api.put(url, formData);
      } else {
        await api.post(url, formData);
      }

      await fetchProducts();
      setModalOpen(false);
      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
    } catch (error: any) {
      console.error('Error saving product:', error);
      const errText = error.response?.data || error.message;
      toast.error('Failed to save product', {
        description: typeof errText === 'string' ? errText : 'Server returned error',
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!id || id === 'undefined') {
      toast.error('Invalid product identifier');
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const msg = error.response?.data?.message || 'Failed to delete product from server';
      toast.error(msg);
    } finally {
      setConfirm({ open: false });
    }
  }

  const filtered = items.filter((p) => {
    const productName = p.name || p.Name || '';
    const productCat = p.category || p.Category || '';
    const matchesSearch = productName.toLowerCase().includes(q.toLowerCase());
    const matchesCat = cat ? productCat.toLowerCase() === cat.toLowerCase() : true;
    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 text-white max-w-full overflow-hidden">
        {/* Header & Add Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-orange-500">Product Management</h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">Manage, edit, and organize store products.</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-neutral-400" size={18} />
            <input
              placeholder="Search products by title..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none shadow-md transition-colors focus:border-orange-500"
            />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none shadow-md transition-colors focus:border-orange-500 cursor-pointer"
          >
            <option value="" className="bg-neutral-900">All Categories</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-neutral-900">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-neutral-300 min-w-[700px]">
              <thead className="border-b border-white/10 bg-black/40 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Image</th>
                  <th className="px-4 sm:px-6 py-4">Name</th>
                  <th className="px-4 sm:px-6 py-4">Category</th>
                  <th className="px-4 sm:px-6 py-4">Price</th>
                  <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      Loading products...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const productId = p.id ?? p.Id ?? p._id;
                    const productName = p.name || p.Name || 'Untitled Product';
                    const productCategory = p.category || p.Category || 'Home';
                    const productPrice = Number(p.price ?? p.Price ?? 0);

                    let rawImg = p.imageUrl || p.ImageUrl || p.image || '';
                    if (rawImg && !rawImg.startsWith('http') && !rawImg.startsWith('data:')) {
                      rawImg = `${BACKEND_URL}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
                    }
                    const displayImg = rawImg || 'https://placehold.co/100x100/171717/737373?text=No+Img';

                    return (
                      <tr key={String(productId)} className="transition-colors hover:bg-white/[0.02]">
                        <td className="px-4 sm:px-6 py-4">
                          <img
                            src={displayImg}
                            alt={productName}
                            className="h-12 w-12 rounded-lg border border-white/10 bg-neutral-800 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/171717/737373?text=No+Img';
                            }}
                          />
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-medium text-white">{productName}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="rounded-md border border-white/10 bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
                            {productCategory}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-semibold text-orange-400">
                          {productPrice.toFixed(2)} EGP
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditing(p);
                                setModalOpen(true);
                              }}
                              className="rounded-lg border border-white/10 bg-neutral-800 p-2 text-neutral-300 shadow-sm transition-colors hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setConfirm({ open: true, id: String(productId) })}
                              className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 shadow-sm transition-colors hover:bg-red-500 hover:text-white cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveProduct}
        product={editing}
        categories={ALL_CATEGORIES}
        saving={saving}
      />
      <ConfirmDialog
        open={confirm.open}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => remove(confirm.id!)}
      />
    </AdminLayout>
  );
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: FormData, productId?: string) => void;
  product?: any;
  categories: string[];
  saving: boolean;
}

function ProductModal({ open, onClose, onSave, product, categories, saving }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name || product.Name || '');
      setDescription(product.description || product.Description || '');
      const pPrice = product.price ?? product.Price;
      setPrice(pPrice !== undefined && pPrice !== null ? String(pPrice) : '');
      setCategory(product.category || product.Category || categories[0] || 'Home');

      let rawImg = product.imageUrl || product.ImageUrl || product.image || null;
      if (rawImg && !rawImg.startsWith('http') && !rawImg.startsWith('data:')) {
        rawImg = `${BACKEND_URL}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
      }
      setPreviewUrl(rawImg);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory(categories[0] || 'Home');
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [product, open, categories]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('price', price);
    data.append('category', category);

    if (imageFile) {
      data.append('image', imageFile);
    }

    const productId = product?.id ?? product?.Id ?? product?._id;
    onSave(data, productId ? String(productId) : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 text-white shadow-2xl my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-6 pb-4">
          <h3 className="text-lg font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Product Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Graduation Trophy Design"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide a detailed product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Price (EGP)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-orange-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none transition-colors focus:border-orange-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-neutral-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Product Image
            </label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 shadow-sm transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 active:scale-95">
                <Upload size={14} className="text-orange-400" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="max-w-[220px] truncate text-xs text-neutral-400">
                {imageFile ? imageFile.name : 'No file chosen'}
              </span>
            </div>

            {previewUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-16 w-16 rounded-xl border border-white/10 bg-neutral-800 object-cover shadow-sm"
                />
                <span className="text-xs text-neutral-400">Image selected</span>
              </div>
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}