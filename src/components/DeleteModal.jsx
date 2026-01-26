import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all scale-100">
        <div className="text-center">
          
          {/* Icon Wrapper */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </div>

          <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
            Hapus Perkara?
          </h3>
          
          <p className="text-slate-600 mb-6">
            Apakah Anda yakin ingin menghapus perkara ini? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClose} 
              disabled={loading}
              className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            
            <button 
              onClick={onConfirm} 
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              {loading ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}