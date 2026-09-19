import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';
import { Reveal, StarRating } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import type { Product, Category } from '@/types';
import { formatPrice } from '@/utils/format';

interface ApiProductItem {
  id: number | string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  dimensions?: string;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  stock?: number;
  featured?: boolean;
}

const AVAILABLE_COLORS = [
  { name: 'White', hex: '#FFFFFF', border: 'border-white/40' },
  { name: 'Black', hex: '#000000', border: 'border-white/20' },
  { name: 'Red', hex: '#EF4444', border: 'border-red-500/40' },
  { name: 'Blue', hex: '#3B82F6', border: 'border-blue-500/40' },
  { name: 'Pink', hex: '#EC4899', border: 'border-pink-500/40' },
  { name: 'Navy', hex: '#0F172A', border: 'border-blue-900/40' },
  { name: 'Gray', hex: '#6B7280', border: 'border-gray-500/40' },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { add } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('White');

  useEffect(() => {
    if (!id) return;

    const API_BASE = 'https://localhost:7254/api';

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/Products/${id}`);
        if (!res.ok) {
          setProduct(null);
          return;
        }
        const data: ApiProductItem = await res.json();
        const mapped: Product = {
          id: String(data.id),
          name: data.name ?? 'Unknown Product',
          description: data.description ?? '',
          category: (data.category ?? 'Custom') as Category,
          price: Number(data.price ?? 0),
          images: data.images && data.images.length ? data.images : data.imageUrl ? [data.imageUrl] : ['/img/placeholder.png'],
          rating: Number(data.rating ?? 5),
          reviews: Number(data.reviews ?? 1),
          dimensions: data.dimensions ?? '',
          colors: data.colors && data.colors.length ? data.colors : AVAILABLE_COLORS.map((c) => c.name),
          sizes: [],
          stock: data.inStock !== undefined ? (data.inStock ? 10 : 0) : Number(data.stock ?? 10),
          featured: Boolean(data.featured ?? data.inStock ?? true),
        };

        setProduct(mapped);
        setSelectedColor(AVAILABLE_COLORS[0].name);

        const listRes = await fetch(`${API_BASE}/Products`);
        const listData: ApiProductItem[] = await listRes.json();
        const mappedList: Product[] = (listData || []).map((item: ApiProductItem) => ({
          id: String(item.id),
          name: item.name ?? 'Unknown Product',
          description: item.description ?? '',
          category: (item.category ?? 'Custom') as Category,
          price: Number(item.price ?? 0),
          images: item.images && item.images.length ? item.images : item.imageUrl ? [item.imageUrl] : ['/img/placeholder.png'],
          rating: Number(item.rating ?? 5),
          reviews: Number(item.reviews ?? 1),
          dimensions: item.dimensions ?? '',
          colors: item.colors && item.colors.length ? item.colors : AVAILABLE_COLORS.map((c) => c.name),
          sizes: [],
          stock: item.inStock !== undefined ? (item.inStock ? 10 : 0) : Number(item.stock ?? 10),
          featured: Boolean(item.featured ?? item.inStock ?? true),
        }));

        setRelated(mappedList.filter((p) => p.category === mapped.category && p.id !== mapped.id).slice(0, 4));
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      }
    };

    load();
  }, [id]);

  useSEO({
    title: product ? `3Print | ${product.name}` : '3Print | Product',
    description: product?.description,
  });

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-white/50">Product not found.</p>
        <Link to="/products" className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    add(product, quantity, undefined, selectedColor);
    toast.success('Added to Cart', {
      description: `${product.name} (${selectedColor}) x${quantity} added to your bag.`,
      action: {
        label: 'View Cart',
        onClick: () => navigate('/checkout'),
      },
    });
  };

  const handleBuyNow = () => {
    add(product, quantity, undefined, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
              <img src={product.images[activeImage]} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
          </Reveal>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? 'border-ember' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="h-20 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Reveal delay={100}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">{product.category}</span>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm text-white/40">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
            </div>
            <p className="mt-6 text-lg text-white/60">{product.description}</p>
            <p className="mt-6 text-3xl font-bold text-white">{formatPrice(product.price)}</p>

            <div className="mt-6 space-y-5 border-t border-white/5 pt-6">
              {product.dimensions && (
                <div>
                  <p className="text-sm font-medium text-white/70">Dimensions</p>
                  <p className="mt-1 text-sm text-white/50">{product.dimensions}</p>
                </div>
              )}

              {/* Color Selection - Swatches */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white/70">Color:</p>
                  <span className="text-sm font-semibold text-white">{selectedColor}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {AVAILABLE_COLORS.map((c) => {
                    const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`group relative h-9 w-9 rounded-full transition-all duration-150 focus:outline-none ${
                          isSelected
                            ? 'scale-110 ring-2 ring-ember ring-offset-2 ring-offset-ink'
                            : 'opacity-85 hover:scale-105 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        <span
                          className={`absolute inset-0 rounded-full border ${c.border || 'border-white/10'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-white/10">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-white/60 hover:text-white" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-white">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-white/60 hover:text-white" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAdd}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-ember hover:text-ember"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-500"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-white">Related Products</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}