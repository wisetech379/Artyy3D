import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Sparkles, Users, LogOut, X } from 'lucide-react';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/custom-orders', label: 'Custom Orders', icon: Sparkles },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({ isOpen = false, onClose, onLogout }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-neutral-900 border-r border-white/10 
        flex flex-col justify-between text-neutral-300
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 text-white font-bold text-lg">
            <div className="flex items-center">
              <span className="text-orange-500 mr-2">■</span> Admin Panel
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" dir="ltr">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === '/admin'}
                  onClick={onClose} // يغلق القائمة تلقائياً عند الضغط على أي رابط في الموبايل
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : 'hover:bg-white/5 text-neutral-400 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {it.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}