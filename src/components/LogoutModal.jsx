import { LogOut, X } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8b1f23] to-[#5c1416] p-4 flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <LogOut size={20} /> Konfirmasi Logout
          </h2>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="text-[#8b1f23]" size={32} />
          </div>
          <h3 className="text-slate-800 font-bold text-lg mb-2">Keluar dari Admin?</h3>
          <p className="text-slate-500 text-sm">
            Anda akan keluar dari mode administrator. Anda perlu login kembali untuk mengelola data perkara.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 px-4 py-2.5 bg-[#8b1f23] text-white font-bold rounded-xl hover:bg-[#6d181b] shadow-md hover:shadow-lg transition"
          >
            Ya, Keluar
          </button>
        </div>

      </div>
    </div>
  );
}