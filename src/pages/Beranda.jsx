import { useState, useEffect } from 'react';
import { getPerkara } from '../services/perkaraService';
import {
  Lock as LockIcon, Search, Scale, FileText, LogOut, 
  FileWarning, CheckCircle, XCircle, Clock, 
  ChevronRight, TrendingUp, Activity
  } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import LogoutModal from '../components/LogoutModal';
import { JENIS_PERKARA, STATUS_PERKARA, getYearOptions } from '../util';

export default function Beranda() {
  const [loading, setLoading] = useState(true);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');
  
  // 1. Get Years but FILTER OUT future years (Remove 2027 if current is 2026)
  const currentYear = new Date().getFullYear();
  const years = getYearOptions().filter(y => y <= currentYear);
  
  // Helper to create empty year object { 2024: 0, 2025: 0, 2026: 0 }
  const createYearlyStats = () => years.reduce((acc, year) => ({ ...acc, [year]: 0 }), {});

  const [stats, setStats] = useState({
    total: 0,
    // Years Stats
    laporan: createYearlyStats(),
    penyelidikan: createYearlyStats(),
    penyidikan: createYearlyStats(),
    // Status Breakdown Stats
    statusLaporan: { proses: 0, dihentikan: 0, naik: 0 },
    statusPenyelidikan: { proses: 0, dihentikan: 0, naik: 0 },
    statusPenyidikan: { proses: 0, dihentikan: 0, naik: 0 },
    recentCases: []
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true); 
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setIsLogoutOpen(false);
    window.location.reload(); 
  };
  const calculateStats = async () => {
    try {
      const data = await getPerkara();
      
      const newStats = {
        total: data.length,
        laporan: createYearlyStats(),
        penyelidikan: createYearlyStats(),
        penyidikan: createYearlyStats(),
        statusLaporan: { proses: 0, dihentikan: 0, naik: 0 },
        statusPenyelidikan: { proses: 0, dihentikan: 0, naik: 0 },
        statusPenyidikan: { proses: 0, dihentikan: 0, naik: 0 },
        recentCases: data.slice(0, 5) 
      };

      data.forEach(item => {
        const year = item.tahun;
        const jenis = item.jenis_perkara; // Exact match from util constants
        const status = item.status_perkara;

        let yearTarget, statusTarget;

        // --- MAP DATA TO TARGETS ---
        if (jenis === JENIS_PERKARA.LAPORAN_PENGADUAN) {
          yearTarget = newStats.laporan;
          statusTarget = newStats.statusLaporan;
        } else if (jenis === JENIS_PERKARA.PENYELIDIKAN) {
          yearTarget = newStats.penyelidikan;
          statusTarget = newStats.statusPenyelidikan;
        } else if (jenis === JENIS_PERKARA.PENYIDIKAN) {
          yearTarget = newStats.penyidikan;
          statusTarget = newStats.statusPenyidikan;
        } else {
          return; // Skip unknown types
        }

        // 1. Count Yearly Stats (Safety check: only count if year is in our list)
        if (yearTarget[year] !== undefined) yearTarget[year]++;

        // 2. Count Status Stats (Using strict Enum comparison)
        if (status === STATUS_PERKARA.DALAM_PROSES) {
            statusTarget.proses++;
        } else if (status === STATUS_PERKARA.DIHENTIKAN) {
            statusTarget.dihentikan++;
        } else if (
            status === STATUS_PERKARA.NAIK_PENYELIDIKAN || 
            status === STATUS_PERKARA.NAIK_PENYIDIKAN || 
            status === STATUS_PERKARA.NAIK_PRAPENUNTUTAN
        ) {
            statusTarget.naik++;
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
    <div id="page-dashboard" className="page-content animate-fade-in relative space-y-8">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#8b1f23]">Dashboard</h2>
          <p className="text-slate-600 mt-1">Ringkasan data arsip perkara tindak pidana khusus</p>
        </div>

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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-800 rounded-full font-medium border border-green-200 shadow-sm cursor-default">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Admin Mode Aktif</span>
              </div>
              <button 
                onClick={handleLogoutClick}
                className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm group"
                title="Keluar"
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* TOTAL STATS HERO CARD */}
      <div className="bg-gradient-to-r from-[#8b1f23] to-[#5c1416] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Activity size={20} />
              <p className="text-sm font-medium uppercase tracking-wider">Total Seluruh Perkara</p>
            </div>
            <p className="text-6xl font-display font-bold">{stats.total}</p>
          </div>
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
            <Scale className="w-10 h-10 text-[#d4af37]" />
          </div>
        </div>
      </div>

      {/* --- STATS GRID SECTIONS --- */}
      
      {/* 1. LAPORAN PENGADUAN */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
            <FileWarning size={20} />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-800">Laporan Pengaduan</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map(year => (
            <StatCard 
              key={`lap-${year}`}
              year={year}
              count={stats.laporan[year]}
              label="Laporan Masuk"
              icon={<FileText size={20} />}
              colorClass="text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white"
            />
          ))}
        </div>
      </section>

      {/* 2. PENYELIDIKAN */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <Search size={20} />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-800">Penyelidikan</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map(year => (
            <StatCard 
              key={`lid-${year}`}
              year={year}
              count={stats.penyelidikan[year]}
              label="Perkara Lid"
              icon={<Search size={20} />}
              colorClass="text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white"
            />
          ))}
        </div>
      </section>

      {/* 3. PENYIDIKAN */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 text-green-700 rounded-lg">
            <Scale size={20} />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-800">Penyidikan</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map(year => (
            <StatCard 
              key={`dik-${year}`}
              year={year}
              count={stats.penyidikan[year]}
              label="Perkara Dik"
              icon={<Scale size={20} />}
              colorClass="text-green-600 bg-green-50 group-hover:bg-green-600 group-hover:text-white"
            />
          ))}
        </div>
      </section>

      {/* --- STATUS OVERVIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusCard title="Status Laporan" stats={stats.statusLaporan} />
        <StatusCard title="Status Penyelidikan" stats={stats.statusPenyelidikan} />
        <StatusCard title="Status Penyidikan" stats={stats.statusPenyidikan} />
      </div>

      {/* RECENT CASES */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-bold text-[#8b1f23]">Perkara Terbaru</h3>
          <button className="text-sm font-medium text-slate-500 hover:text-[#8b1f23] flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {stats.recentCases.length > 0 ? (
            stats.recentCases.map((perkara) => (
              <div key={perkara._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 text-slate-400 group-hover:text-[#8b1f23] group-hover:border-[#8b1f23]/20 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm group-hover:text-[#8b1f23] transition-colors">{perkara.nama_perkara}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{perkara.nomor_sp}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border 
                  ${perkara.status_perkara.includes('Selesai') || perkara.status_perkara.includes('Naik') 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : perkara.status_perkara.includes('Proses') 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {perkara.status_perkara}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 italic">Belum ada perkara terdaftar</div>
          )}
        </div>
      </div>

      {isLoginOpen && <LoginModal closeModal={() => setIsLoginOpen(false)} />}
      
      <LogoutModal 
        isOpen={isLogoutOpen} 
        onClose={() => setIsLogoutOpen(false)} 
        onConfirm={confirmLogout} 
      />
      
    </div>
  );
}

// --- NEW COMPONENT: Clean, Modern Stat Card ---
function StatCard({ year, count, label, icon, colorClass }) {
  return (
    <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Tahun {year}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold text-slate-800">{count || 0}</span>
            <span className="text-xs text-slate-500 font-medium">kasus</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${colorClass}`}>
          {icon}
        </div>
      </div>
      
    </div>
  );
}

// --- NEW COMPONENT: Status Card ---
function StatusCard({ title, stats }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col h-full">
      <h3 className="font-display text-lg font-bold text-[#8b1f23] mb-6 border-b border-slate-50 pb-2">{title}</h3>
      <div className="space-y-5 flex-1">
        <StatusRow icon={<Clock size={18} />} color="text-blue-600 bg-blue-50" label="Dalam Proses" count={stats.proses} />
        <StatusRow icon={<XCircle size={18} />} color="text-red-600 bg-red-50" label="Dihentikan" count={stats.dihentikan} />
        <StatusRow icon={<CheckCircle size={18} />} color="text-green-600 bg-green-50" label="Tindak Lanjut" count={stats.naik} />
      </div>
    </div>
  );
}

function StatusRow({ icon, color, label, count }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg transition-colors ${color}`}>
          {icon}
        </div>
        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{label}</span>
      </div>
      <span className="font-bold text-slate-800 text-lg">{count}</span>
    </div>
  );
}