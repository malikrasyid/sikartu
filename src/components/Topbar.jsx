import { Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="bg-gradient-to-r from-[#8b1f23] to-[#5c1416] text-white p-4 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-40 md:hidden">
      {/* Logo & Brand - Matches Sidebar Theme */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 relative">
          <img 
            src="https://kejari-kotabaru.kejaksaan.go.id/wp-content/uploads/2025/11/logo-pidsus-945x1024-1.png" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-display font-bold text-[#d4af37] tracking-wide">
          SI-KARTU
        </span>
      </div>

      {/* Hamburger Menu Button */}
      <button 
        onClick={onMenuClick} 
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}