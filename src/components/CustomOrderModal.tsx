import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import api from '../utils/api';

const schema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  productType: z.string().min(1, 'Select a product type'),
  quantity: z.coerce.number().int().min(1, 'At least 1'),
  color: z.string().min(1, 'Color is required'),
  notes: z.string().max(500).optional(),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const productTypes = [
  'All',
  'Home',
  'Makeup',
  'Doctors',
  'Cars',
  'Graduation Projects',
];

export function CustomOrderModal({ isOpen, onClose }: CustomOrderModalProps) {
  const { notify } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productType: 'Home',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);

    const formData = new FormData();
    formData.append('CustomerName', data.customerName);
    formData.append('Phone', data.phone);
    formData.append('Address', `Email: ${data.customerEmail}`);
    formData.append('Quantity', data.quantity.toString());
    formData.append('Color', data.color);
    formData.append('ProductType', data.productType);
    formData.append('Notes', data.notes || '');

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      await api.post('/CustomOrders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSubmitting(false);
      reset();
      setSelectedFile(null);
      onClose();
      notify('Custom order request sent successfully and added to Dashboard!');
    } catch (error) {
      console.error('Failed to submit custom order:', error);
      setSubmitting(false);
      notify('Failed to submit order. Please check backend connection.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 text-white shadow-2xl my-auto flex flex-col max-h-[92vh]">
        
        {/* Header (Fixed) */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-white">Create Custom Order</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
          
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-white tracking-wide">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register('customerName')}
                className="w-full rounded-lg border border-white/30 bg-black/60 backdrop-blur-md px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all shadow-inner"
              />
              {errors.customerName && <p className="mt-0.5 text-[10px] text-red-400 font-semibold">{errors.customerName.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-white tracking-wide">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('customerEmail')}
                className="w-full rounded-lg border border-white/30 bg-black/60 backdrop-blur-md px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all shadow-inner"
              />
              {errors.customerEmail && <p className="mt-0.5 text-[10px] text-red-400 font-semibold">{errors.customerEmail.message}</p>}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-xs font-bold text-white tracking-wide">Phone Number</label>
            <input
              type="text"
              placeholder="01000000000"
              {...register('phone')}
              className="w-full rounded-lg border border-white/30 bg-black/60 backdrop-blur-md px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all shadow-inner"
            />
            {errors.phone && <p className="mt-0.5 text-[10px] text-red-400 font-semibold">{errors.phone.message}</p>}
          </div>

          {/* Product Type - Pill Buttons */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-white tracking-wide">Product Type</label>
            <Controller
              name="productType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-1.5">
                  {productTypes.map((type) => {
                    const isSelected = field.value === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => field.onChange(type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                            : 'bg-black/40 text-gray-300 border-white/20 hover:border-orange-500/50 hover:bg-black/60 hover:text-white backdrop-blur-md'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.productType && <p className="mt-1 text-[10px] text-red-400 font-semibold">{errors.productType.message}</p>}
          </div>

          {/* Color & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-white tracking-wide">Color</label>
              <input
                type="text"
                placeholder="e.g. Matte Black, Red"
                {...register('color')}
                className="w-full rounded-lg border border-white/30 bg-black/60 backdrop-blur-md px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all shadow-inner"
              />
              {errors.color && <p className="mt-0.5 text-[10px] text-red-400 font-semibold">{errors.color.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-white tracking-wide">Quantity</label>
              <input
                type="number"
                min={1}
                {...register('quantity')}
                className="w-full rounded-lg border border-white/30 bg-black/60 backdrop-blur-md px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all shadow-inner"
              />
              {errors.quantity && <p className="mt-0.5 text-[10px] text-red-400 font-semibold">{errors.quantity.message}</p>}
            </div>
          </div>

          {/* Design Upload (Compact) */}
          <div>
            <label className="mb-1 block text-xs font-bold text-white tracking-wide">Design Upload</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/40 bg-black/40 backdrop-blur-md px-3 py-3 text-xs text-gray-200 transition-all hover:border-orange-500 hover:bg-black/60 hover:text-orange-400">
              <Upload size={16} className="text-orange-500" />
              <span className="font-medium truncate">{selectedFile ? selectedFile.name : 'Click to upload design file'}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-xs font-bold text-white tracking-wide">Notes</label>
            <textarea
              rows={2}
              {...register('notes')}
              placeholder="Tell us about your vision..."
              className="w-full resize-none rounded-lg border border-white/30 bg-black/60 backdrop-blur-md px-3 py-2 text-xs text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 border-t border-white/10 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Sending Request...' : 'Submit Custom Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}