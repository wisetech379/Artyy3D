import React from 'react';
import { Search, User, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  adminName?: string;
}

export default function Topbar({ 
  onMenuClick, 
  searchQuery, 
  onSearchChange,
  adminName = "Admin"
}: TopbarProps) {
  return (
    <header className="h-16 bg-neutral-900 border-b border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      
      {/* Left side: Mobile Menu Button & Search */}
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Hamburger button for mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search anything..."
            className="w-full rounded-xl border border-white/10 bg-neutral-800/50 py-2 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-orange-500"
          />
        </div>
      </div>

      {/* Right side: User Profile */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white">
          <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
            <User size={14} />
          </div>
          <span className="hidden sm:block text-xs font-medium">{adminName}</span>
        </div>
      </div>
      
    </header>
  );
}