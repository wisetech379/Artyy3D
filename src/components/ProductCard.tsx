import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Star, Plus } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { notify } = useToast();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-surface transition-all duration-500 hover:border-white/15 hover:bg-surface-2">
      <Link to={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-mist backdrop-blur">
          {product.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center gap-1 text-xs text-amber-400">
          <Star size={12} className="fill-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-white/30">({product.reviews})</span>
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-white transition-colors group-hover:text-ember">{product.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-white/50">{product.description}</p>
        <p className="mt-2 text-xs text-white/40">{product.dimensions}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
          <button
            onClick={() => {
              add(product);
              notify(`${product.name} added to cart`);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ember text-white transition-all hover:scale-110 hover:bg-orange-500 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
