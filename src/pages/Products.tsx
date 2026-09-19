import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { Reveal } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import type { Product, Category } from '@/types';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const CATEGORIES_LIST: (Category | 'All')[] = [
  'All',
  'Home',
  'Makeup',
  'Doctors',
  'Cars',
  'Graduation Projects'
];

export default function Products() {
  useSEO({ title: 'Artyy 3D | Products', description: 'Browse custom 3D printing and designed products.' });
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const initialCategory = (searchParams.get('category') as Category | 'All') ?? 'All';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category | 'All'>(initialCategory);
  const [sort, setSort] = useState<SortOption>('featured');
  const [visible, setVisible] = useState(8);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    let result = [...productsList];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (category !== 'All') {
      result = result.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return result;
  }, [query, category, sort, productsList]);

  useEffect(() => {
    const BACKEND_URL = 'https://localhost:7254';

    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/Products`);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();

        const mapped: Product[] = (data || []).map((item: any) => {
          let img = item.imageUrl || (item.images && item.images[0]) || '';

          if (img && !img.startsWith('http') && !img.startsWith('data:')) {
            img = `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`;
          }

          if (!img) {
            img = 'https://placehold.co/600x600/222222/ffffff?text=3D+Print';
          }

          const parsedPrice = Number(item.price ?? 0);

          return {
            id: String(item.id || item._id),
            name: item.name || item.title || 'Product',
            description: item.description || '',
            category: (item.category || 'Home') as Category,
            price: parsedPrice,
            image: img,
            imageUrl: img,
            images: [img],
            rating: Number(item.rating ?? 5),
            reviews: Number(item.reviews ?? 1),
            dimensions: item.dimensions || 'Standard',
            colors: item.colors && item.colors.length ? item.colors : ['Default'],
            sizes: item.sizes && item.sizes.length ? item.sizes : ['Standard'],
            stock: item.inStock !== undefined ? (item.inStock ? 10 : 0) : Number(item.stock ?? 10),
            inStock: item.inStock ?? true,
            featured: Boolean(item.featured ?? true),
          } as Product;
        });

        setProductsList(mapped);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleCategory = (cat: Category | 'All') => {
    setCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  return (
    <div>
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Products</h1>
          <p className="mt-4 max-w-xl text-white/50">Find your next favorite piece, or start something custom.</p>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === cat ? 'bg-orange-500 text-white' : 'border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-3 py-2">
              <Search size={16} className="text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none sm:w-48"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-3 py-2">
              <SlidersHorizontal size={16} className="text-white/40" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-transparent text-sm text-white focus:outline-none [&>option]:bg-neutral-900 [&>option]:text-white"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Grid */}
        {loading ? (
          <div className="flex justify-center py-24 text-white/50">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <Search size={48} className="text-white/20" />
            <p className="text-white/50">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.slice(0, visible).map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible((v) => v + 8)}
                  className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-orange-500 hover:text-orange-500"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}