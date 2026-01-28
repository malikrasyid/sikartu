import { Link, useLocation } from 'react-router-dom';
import { Home, Archive, Info, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 p-3 mx-2 rounded-lg transition-all duration-200";
    return location.pathname === path 
      ? `${baseClass} bg-white/10 border-l-4 border-[#d4af37] text-white font-medium shadow-inner` 
      : `${baseClass} text-slate-200 hover:bg-white/5 hover:text-white`;
  };

  return (
    <>
      {/* Mobile Overlay (Click to close) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 
        bg-gradient-to-b from-[#8b1f23] to-[#5c1416] text-white 
        flex flex-col shadow-2xl transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        
        {/* --- LOGO SECTION (Original Attributes Preserved) --- */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 relative">
              <img 
                src="https://kejari-kotabaru.kejaksaan.go.id/wp-content/uploads/2025/11/logo-pidsus-945x1024-1.png" 
                alt="Logo SI-KARTU" 
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#d4af37] tracking-wide">
                SI-KARTU
              </h1>
              <p className="text-xs text-slate-300 leading-tight">
                Sistem Katalog Arsip<br />
                Tindak Pidana Khusus
              </p>
            </div>
          </div>

          {/* CLOSE BUTTON (Mobile Only) */}
          <button 
            onClick={onClose}
            className="md:hidden text-slate-300 hover:text-white hover:bg-white/10 p-1 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sub-info (Original) */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/10">
          <p className="text-sm font-medium text-white">
            Kejaksaan Tinggi Sumatera Barat
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Bidang Tindak Pidana Khusus
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
          <div className="px-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          
          <Link to="/" className={getLinkClass('/')} onClick={onClose}>
            <Home size={20} className="text-[#d4af37]" /> 
            <span>Beranda</span>
          </Link>
          
          <Link to="/arsip" className={getLinkClass('/arsip')} onClick={onClose}>
            <Archive size={20} className="text-[#d4af37]" /> 
            <span>Arsip Perkara</span>
          </Link>
          
          <Link to="/tentang" className={getLinkClass('/tentang')} onClick={onClose}>
            <Info size={20} className="text-[#d4af37]" /> 
            <span>Tentang Kami</span>
          </Link>
        </nav>
        
      </aside>
    </>
  );
}