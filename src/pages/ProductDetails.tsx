import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';
import { Reveal, StarRating } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import type { Product, Category } from '@/types';
import { formatPrice } from '@/utils/format';
import api from '@/utils/api';

interface ApiProductImage {
  id?: number | string;
  Id?: number | string;
  imageUrl?: string;
  ImageUrl?: string;
}

interface ApiProductItem {
  id: number | string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  images?: (ApiProductImage | string)[];
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

// الباك بيرجع الصور كمصفوفة objects { id, imageUrl } دلوقتي بدل مصفوفة نصوص،
// الدالة دي بتتعامل مع الحالتين (نص أو object) عشان الكود يفضل شغال في الحالتين
function extractImageUrls(images: (ApiProductImage | string)[] | undefined, fallback?: string): string[] {
  if (images && images.length > 0) {
    return images.map((img) => (typeof img === 'string' ? img : img.imageUrl || img.ImageUrl || ''));
  }
  return fallback ? [fallback] : ['/img/placeholder.png'];
}

const AUTO_SLIDE_INTERVAL = 4000; // 4 ثواني
const TRANSITION_DURATION = 700; // مللي ثانية

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { add } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('White');
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await api.get(`/Products/${id}`);
        const data: ApiProductItem = res.data;

        const mapped: Product = {
          id: String(data.id),
          name: data.name ?? 'Unknown Product',
          description: data.description ?? '',
          category: (data.category ?? 'Custom') as Category,
          price: Number(data.price ?? 0),
          images: extractImageUrls(data.images, data.imageUrl),
          rating: Number(data.rating ?? 5),
          reviews: Number(data.reviews ?? 1),
          dimensions: data.dimensions ?? '',
          colors: data.colors && data.colors.length ? data.colors : AVAILABLE_COLORS.map((c) => c.name),
          sizes: [],
          stock: data.inStock !== undefined ? (data.inStock ? 10 : 0) : Number(data.stock ?? 10),
          featured: Boolean(data.featured ?? data.inStock ?? true),
        };

        setProduct(mapped);
        setActiveImage(0);
        setSelectedColor(AVAILABLE_COLORS[0].name);

        const listRes = await api.get('/Products');
        const listData: ApiProductItem[] = listRes.data;
        const mappedList: Product[] = (listData || []).map((item: ApiProductItem) => ({
          id: String(item.id),
          name: item.name ?? 'Unknown Product',
          description: item.description ?? '',
          category: (item.category ?? 'Custom') as Category,
          price: Number(item.price ?? 0),
          images: extractImageUrls(item.images, item.imageUrl),
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

  // Auto-slide: بيتحرك تلقائيًا كل 4 ثواني، ويتوقف لو المستخدم بيعمل hover أو لو صورة واحدة بس
  useEffect(() => {
    if (!product || product.images.length <= 1 || isHovering) {
      return;
    }

    autoSlideRef.current = setInterval(() => {
      setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [product, isHovering]);

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

  const goToPrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextImage();
      } else {
        goToPrevImage();
      }
    }
    setTouchStart(null);
  };

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
            <div
              className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 bg-surface"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* كل الصور متراكبة فوق بعض، وبس اللي شغالة دلوقتي ظاهرة - ده اللي بيدي الـ crossfade الناعم */}
              {product.images.map((img, i) => (
                <img
                  key={img + i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-cover transition-[opacity,transform] ease-in-out"
                  style={{
                    opacity: activeImage === i ? 1 : 0,
                    transform: activeImage === i ? 'scale(1.06)' : 'scale(1)',
                    transitionDuration: `${TRANSITION_DURATION}ms, 4200ms`,
                    zIndex: activeImage === i ? 1 : 0,
                  }}
                />
              ))}

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 group-hover:opacity-100 focus:opacity-100"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 group-hover:opacity-100 focus:opacity-100"
                  >
                    <ChevronRight size={22} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        aria-label={`Go to image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                          activeImage === i ? 'w-5 bg-ember' : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Reveal>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-300 ${
                    activeImage === i ? 'border-ember opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="h-12 w-12 object-cover" />
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