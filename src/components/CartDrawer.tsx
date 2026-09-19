import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen, close, remove, setQuantity, subtotal, shipping, total, count } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <ShoppingBag size={20} /> Cart {count > 0 && <span className="text-sm text-white/40">({count})</span>}
          </h2>
          <button onClick={close} aria-label="Close cart" className="text-white/60 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={48} className="text-white/20" />
            <p className="text-white/50">Your cart is empty.</p>
            <button
              onClick={close}
              className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-500"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                    <img src={item.images[0]} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">{item.name}</h3>
                          {item.selectedColor && (
                            <p className="text-xs text-white/40">{item.selectedColor}</p>
                          )}
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-white/30 hover:text-ember"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-lg border border-white/10">
                          <button
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-white/60 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                          <button
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-white/60 hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-white/5 px-6 py-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 text-base font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                onClick={close}
                className="mt-4 block rounded-full bg-ember py-3 text-center text-sm font-semibold text-white transition-all hover:bg-orange-500"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
