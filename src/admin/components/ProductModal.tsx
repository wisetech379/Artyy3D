import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: any) => void;
  product?: any;
  categories?: string[];
}

export default function ProductModal({ open, onClose, onSave, product, categories }: ProductModalProps) {
  const [form, setForm] = useState<any>({ 
    name: '', 
    description: '', 
    price: '', 
    category: '', 
    stock: '', 
    status: 'active', 
    image: '' 
  });

  // جديد: تتبع الأخطاء عشان نظهر تنبيه لليوزر لو حقل مهم فاضي
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({ 
        name: '', 
        description: '', 
        price: '', 
        category: categories?.[0] || '', 
        stock: '', 
        status: 'active', 
        image: '' 
      });
    }
    setErrors({});
  }, [product, open, categories]);

  if (!open) return null;

  // جديد: تحقق بسيط قبل الحفظ
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name || !form.name.trim()) {
      newErrors.name = 'اسم المنتج مطلوب';
    }
    if (form.price === '' || form.price === null || isNaN(Number(form.price)) || Number(form.price) < 0) {
      newErrors.price = 'السعر لازم يكون رقم صحيح';
    }
    if (form.stock === '' || form.stock === null || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      newErrors.stock = 'المخزون لازم يكون رقم صحيح';
    }
    if (!form.category) {
      newErrors.category = 'اختار تصنيف';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // جديد: نحول price و stock لأرقام فعلية قبل ما نبعتهم بره الكومبوننت
    const cleanForm = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    onSave(cleanForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl text-white my-8 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold">
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable for small screens) */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1" dir="auto">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">اسم المنتج</label>
            <input 
              className={`w-full bg-neutral-800 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                errors.name ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
              }`}
              placeholder="أدخل اسم المنتج..." 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">الوصف</label>
            <textarea 
              className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none h-24" 
              placeholder="تفاصيل المنتج..." 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">السعر</label>
              <input 
                type="number"
                min="0"
                step="0.01"
                className={`w-full bg-neutral-800 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                  errors.price ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
                }`}
                placeholder="0.00" 
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value === '' ? '' : Number(e.target.value) })} 
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">المخزون</label>
              <input 
                type="number"
                min="0"
                step="1"
                className={`w-full bg-neutral-800 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                  errors.stock ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
                }`}
                placeholder="0" 
                value={form.stock} 
                onChange={(e) => setForm({ ...form, stock: e.target.value === '' ? '' : Number(e.target.value) })} 
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div className="relative pb-2">
            <label className="block text-xs font-medium text-neutral-400 mb-1">التصنيف</label>
            <select 
              className={`w-full bg-neutral-800 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer ${
                errors.category ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
              }`}
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {(!categories || categories.length === 0) && (
                <option value="" disabled>لا يوجد تصنيفات متاحة</option>
              )}
              {categories?.map((c: string) => (
                <option key={c} value={c} className="bg-neutral-900 text-white py-2">{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          {/* جديد: حقل رابط الصورة، كان مفقود من الفورم الأصلي */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">رابط الصورة</label>
            <input 
              className="w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="https://..." 
              value={form.image} 
              onChange={(e) => setForm({ ...form, image: e.target.value })} 
            />
            {form.image && (
              <img 
                src={form.image} 
                alt="معاينة الصورة" 
                className="mt-2 w-16 h-16 object-cover rounded-lg border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-neutral-900/50">
          <button 
            onClick={onClose} 
            className="px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-neutral-300 hover:bg-white/5 transition-colors"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSave} 
            className="px-5 py-2.5 bg-emerald-600 text-sm font-medium text-white rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
          >
            حفظ
          </button>
        </div>

      </div>
    </div>
  );
}