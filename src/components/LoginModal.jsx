import { useState } from 'react';
import { X, User, Lock as LockIcon, LogIn } from 'lucide-react';
import api from '../services/api';

export default function LoginModal({ closeModal }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Send Login Request
      const response = await api.post('/auth/login', { username, password });
      
      // 2. Save Token to LocalStorage
      localStorage.setItem('token', response.data.token);
      
      // 3. Refresh the Page
      // We reload the page so all components (Sidebar, ArsipPerkara) 
      // re-check localStorage and update their UI to "Admin Mode".
      window.location.reload(); 
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Username atau password salah');
      setLoading(false);
    }
  };

  return (
    // Overlay with backdrop blur
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative transform transition-all scale-100">
        
        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#8b1f23] to-[#5c1416] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
            <LockIcon className="text-[#d4af37]" size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Admin Login</h2>
          <p className="text-red-100 text-sm mt-1 opacity-80">Masuk untuk mengelola arsip</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-[#8b1f23] text-white rounded-lg font-bold shadow-lg hover:bg-[#6d181b] hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : (
                <>
                  <LogIn size={18} /> Masuk Sistem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}