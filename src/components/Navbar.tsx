import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, User, LogOut, ArrowRight, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { count, open } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setMobileOpen(false);
      setQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-gray-100 ">
        <nav className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-white/50 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={open}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ember px-1 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            {/* Auth Actions - Desktop */}
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 sm:flex">
                {/* رابط Dashboard للأدمن فقط */}
                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 rounded-lg border border-ember/30 bg-ember/10 px-3 py-1.5 text-sm font-medium text-ember transition-all hover:bg-ember hover:text-white"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* رابط طلباتي للعميل المسجل */}
                <Link
                  to="/my-orders"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-neutral-300 transition-all hover:border-ember/40 hover:bg-white/10 hover:text-white"
                >
                  <Package size={17} className="text-ember" />
                  <span>My Orders</span>
                </Link>

                <span className="flex items-center gap-1.5 px-2 text-sm text-white/80">
                  <User size={18} />
                  <span className="max-w-[120px] truncate">{user?.name || user?.email}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-500/10"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white sm:flex"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
            )}

            <Link
              to="/products"
              className="ml-1 hidden items-center gap-1.5 rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-orange-500 sm:flex"
            >
              Shop Now <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => setMobileOpen((m) => !m)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {searchOpen && (
          <div className="border-t border-white/5 px-4 py-3 sm:px-6 lg:px-8">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-3xl items-center gap-2">
              <Search size={18} className="text-white/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <button type="submit" className="rounded-lg bg-ember px-4 py-1.5 text-sm font-medium text-white">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80vw] animate-slide-in-right border-l border-white/10 bg-surface p-6">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} className="text-white/60" />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                      isActive ? 'bg-white/5 text-white' : 'text-white/60 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Auth Actions - Mobile */}
            <div className="mt-6 flex flex-col gap-3 border-t border-white/5 pt-6">
              {isAuthenticated ? (
                <>
                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg border border-ember/30 bg-ember/10 px-3 py-3 text-sm font-medium text-ember"
                    >
                      <LayoutDashboard size={18} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    <Package size={18} className="text-ember" />
                    <span>My Orders</span>
                  </Link>

                  <div className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-3 text-sm font-medium text-white">
                    <User size={18} className="text-ember" />
                    <span className="truncate">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-3 text-sm font-medium text-red-400"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-3 text-sm font-medium text-white"
                >
                  <User size={18} /> Login / Account
                </Link>
              )}

              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-yellow-500  px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 