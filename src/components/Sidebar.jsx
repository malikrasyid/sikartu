import { Link, useLocation } from 'react-router-dom';
import { Home, Archive, Info, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  // Helper for active link styling (Gold border + lighter background)
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 p-3 mx-2 rounded-lg transition-all duration-200";
    return location.pathname === path 
      ? `${baseClass} bg-white/10 border-l-4 border-[#d4af37] text-white font-medium shadow-inner` 
      : `${baseClass} text-slate-200 hover:bg-white/5 hover:text-white`;
  };

  return (
    // Replaced w-64 with w-72 as per your code
    <aside className="w-72 h-screen bg-gradient-to-b from-[#8b1f23] to-[#5c1416] text-white flex flex-col shadow-2xl fixed left-0 top-0 z-50">
      
      {/* --- YOUR LOGO SECTION START --- */}
      {/* <div className="p-6 border-b border-white/10">
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
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm font-medium text-white">
            Kejaksaan Tinggi Sumatera Barat
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Bidang Tindak Pidana Khusus
          </p>
        </div>
      </div> */}
      {/* --- YOUR LOGO SECTION END --- */}

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
        <div className="px-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        
        <Link to="/" className={getLinkClass('/')}>
          <Home size={20} className="text-[#d4af37]" /> 
          <span>Beranda</span>
        </Link>
        
        <Link to="/arsip" className={getLinkClass('/arsip')}>
          <Archive size={20} className="text-[#d4af37]" /> 
          <span>Arsip Perkara</span>
        </Link>
        
        <Link to="/tentang" className={getLinkClass('/tentang')}>
          <Info size={20} className="text-[#d4af37]" /> 
          <span>Tentang Kami</span>
        </Link>
      </nav>

      
    </aside>
  );
}