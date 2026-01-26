import { useState, useEffect } from 'react';
import { getPerkara } from '../services/perkaraService';
import { Lock as LockIcon, Search, Scale, FileText, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import LoginModal from '../components/LoginModal';

export default function Beranda() {
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    penyelidikan: { 2024: 0, 2025: 0, 2026: 0 },
    penyidikan: { 2024: 0, 2025: 0, 2026: 0 },
    statusPenyelidikan: { proses: 0, dihentikan: 0, naik: 0 },
    statusPenyidikan: { proses: 0, dihentikan: 0, naik: 0 },
    recentCases: []
  });

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      const data = await getPerkara();
      
      // Initialize counters
      const newStats = {
        total: data.length,
        penyelidikan: { 2024: 0, 2025: 0, 2026: 0 },
        penyidikan: { 2024: 0, 2025: 0, 2026: 0 },
        statusPenyelidikan: { proses: 0, dihentikan: 0, naik: 0 },
        statusPenyidikan: { proses: 0, dihentikan: 0, naik: 0 },
        recentCases: data.slice(0, 5) // Get top 5 newest
      };

      data.forEach(item => {
        const year = item.tahun;
        const jenis = item.jenis_perkara?.toLowerCase() || '';
        const status = item.status_perkara?.toLowerCase() || '';

        let yearTarget, statusTarget;

        if (jenis.includes('penyelidikan')) {
          yearTarget = newStats.penyelidikan;
          statusTarget = newStats.statusPenyelidikan;
        } else if (jenis.includes('penyidikan')) {
          yearTarget = newStats.penyidikan;
          statusTarget = newStats.statusPenyidikan;
        } else {
          return; // Skip if it's neither
        }

        if (yearTarget[year] !== undefined) {
          yearTarget[year]++;
        }

        switch (status) {
          case 'proses':
            statusTarget.proses++;
            break;
          case 'ditangguhkan':
            statusTarget.dihentikan++;
            break;
          case 'selesai':
            statusTarget.naik++;
            break;
          default:
            break;
        }
      });

      setStats(newStats);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat Data Dashboard...</div>;

  return (
    <div id="page-dashboard" className="page-content animate-fade-in">
      
      {/* HEADER */}
      <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#8b1f23]">Dashboard</h2>
          <p className="text-slate-600 mt-1">Ringkasan data arsip perkara tindak pidana khusus</p>
        </div>

        {/* LOGIN BUTTON / ADMIN BADGE */}
        <div>
          {!isLoggedIn ? (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-[#8b1f23] text-[#8b1f23] rounded-full font-medium shadow-sm hover:bg-[#8b1f23] hover:text-white transition-all duration-300"
            >
              <LockIcon size={18} className="group-hover:text-white transition-colors" />
              <span>Login Admin</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-800 rounded-full font-medium border border-green-200 shadow-sm cursor-default">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Admin Mode Aktif</span>
            </div>
          )}
        </div>
      </header>

      {/* TOTAL STATS CARD */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-[#8b1f23] to-[#5c1416] rounded-xl p-6 text-white shadow-lg transform transition hover:scale-[1.01] duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm font-medium uppercase tracking-wider">Total Seluruh Perkara</p>
              <p className="text-5xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Scale className="w-10 h-10 text-[#d4af37]" />
            </div>
          </div>
        </div>
      </div>

      {/* PENYELIDIKAN STATS */}
      <div className="mb-6">
        <h3 className="font-display text-xl font-semibold text-[#8b1f23] mb-4 flex items-center gap-2">
          <Search className="text-[#8b1f23]" size={24} /> Penyelidikan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[2024, 2025, 2026].map(year => (
            <div key={`lid-${year}`} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Tahun {year}</p>
                  <p className="text-3xl font-bold text-[#8b1f23] mt-1">{stats.penyelidikan[year]}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                  📊
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PENYIDIKAN STATS */}
      <div className="mb-8">
        <h3 className="font-display text-xl font-semibold text-[#8b1f23] mb-4 flex items-center gap-2">
          <Scale className="text-[#8b1f23]" size={24} /> Penyidikan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[2024, 2025, 2026].map(year => (
            <div key={`dik-${year}`} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm">Tahun {year}</p>
                  <p className="text-3xl font-bold text-[#8b1f23] mt-1">{stats.penyidikan[year]}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl">
                  📈
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATUS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Penyelidikan */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-display text-lg font-semibold text-[#8b1f23] mb-4">Status Penyelidikan</h3>
          <div className="space-y-4">
            <StatusRow color="bg-blue-500" label="Dalam Proses" count={stats.statusPenyelidikan.proses} />
            <StatusRow color="bg-red-500" label="Dihentikan" count={stats.statusPenyelidikan.dihentikan} />
            <StatusRow color="bg-green-500" label="Naik Penyidikan" count={stats.statusPenyelidikan.naik} />
          </div>
        </div>

        {/* Status Penyidikan */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-display text-lg font-semibold text-[#8b1f23] mb-4">Status Penyidikan</h3>
          <div className="space-y-4">
            <StatusRow color="bg-blue-500" label="Dalam Proses" count={stats.statusPenyidikan.proses} />
            <StatusRow color="bg-red-500" label="Dihentikan" count={stats.statusPenyidikan.dihentikan} />
            <StatusRow color="bg-purple-500" label="Naik PraPenuntutan" count={stats.statusPenyidikan.naik} />
          </div>
        </div>
      </div>

      {/* RECENT CASES */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
        <h3 className="font-display text-lg font-semibold text-[#8b1f23] mb-4">Perkara Terbaru</h3>
        <div className="space-y-3">
          {stats.recentCases.length > 0 ? (
            stats.recentCases.map((perkara) => (
              <div key={perkara._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <FileText className="text-slate-400" size={20} />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{perkara.nama_perkara}</p>
                    <p className="text-xs text-slate-500">{perkara.nomor_sp}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-medium 
                  ${perkara.status_perkara === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {perkara.status_perkara}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm italic">Belum ada perkara terdaftar</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Component for the Status Rows to keep code clean
function StatusRow({ color, label, count }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 ${color} rounded-full`}></span>
        <span className="text-slate-600">{label}</span>
      </div>
      <span className="font-semibold text-[#8b1f23]">{count}</span>
    </div>
  );
}