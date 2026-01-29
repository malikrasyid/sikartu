import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerkara } from '../context/PerkaraContext';
import {
  Lock as LockIcon, Search, Scale, FileText, LogOut, Activity,
  FileWarning, CheckCircle, XCircle, Clock, ShieldCheck
  } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import LogoutModal from '../components/LogoutModal';
import { JENIS_PERKARA, STATUS_PERKARA, getYearOptions } from '../util';

export default function Beranda() {
const { data, loading, fetchData } = usePerkara();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');
  
  const currentYear = new Date().getFullYear();
  const years = getYearOptions().filter(y => y <= currentYear);
  const createYearlyStats = () => years.reduce((acc, year) => ({ ...acc, [year]: 0 }), {});

  const [stats, setStats] = useState({
    total: 0,
    laporan: createYearlyStats(),
    penyelidikan: createYearlyStats(),
    penyidikan: createYearlyStats(),
    statusLaporan: { proses: 0, dihentikan: 0, naik: 0 },
    statusPenyelidikan: { proses: 0, dihentikan: 0, naik: 0 },
    statusPenyidikan: { proses: 0, dihentikan: 0, naik: 0 },
    recentCases: []
  });

  useEffect(() => {
    // Optional: If Admin, force fetch to ensure fresh data
    const shouldForce = isLoggedIn; 
    fetchData(shouldForce);
  }, [fetchData, isLoggedIn]);

  useEffect(() => {
    if (!loading && data) {
        calculateStatsFromData(data);
    }
  }, [data, loading]);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true); 
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setIsLogoutOpen(false);
    window.location.reload(); 
  };

  const handleStatClick = (year, jenis) => {
    navigate('/arsip', { state: { year, jenis } });
  };

  const calculateStatsFromData = (items) => {
      const newStats = {
        total: items.length,
        laporan: createYearlyStats(),
        penyelidikan: createYearlyStats(),
        penyidikan: createYearlyStats(),
        statusLaporan: { proses: 0, dihentikan: 0, naik: 0 },
        statusPenyelidikan: { proses: 0, dihentikan: 0, naik: 0 },
        statusPenyidikan: { proses: 0, dihentikan: 0, naik: 0 },
        recentCases: items.slice(0, 5) 
      };

      items.forEach(item => {
        const year = item.tahun;
        const jenis = item.jenis_perkara; 
        const status = item.status_perkara;

        let yearTarget, statusTarget;

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
          return;
        }

        if (yearTarget[year] !== undefined) yearTarget[year]++;

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
  };

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
              className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-[#8b1f23] text-[#8b1f23] rounded-full font-medium shadow-sm hover:bg-[#8b1f23] hover:text-white transition-all duration-300"
            >
              <LockIcon size={18} className="group-hover:text-white transition-colors" />
              <span>Login Admin</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200 shadow-sm cursor-default select-none">
                <ShieldCheck size={18} className="text-green-600" />
                <span>Admin</span>
              </div>

              <button 
                onClick={handleLogoutClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-full font-medium shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 group"
                title="Keluar"
              >
                <LogOut size={18} className="group-hover:stroke-white transition-colors" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* --- STATS GRID SECTIONS --- */}      
      {/* 1. LAPORAN PENGADUAN */}
      <section>
        <div className="mb-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8b1f23] to-[#5c1416] rounded-full pl-2 pr-6 py-1.5 text-white shadow-lg shadow-[#8b1f23]/20 border border-white/10 relative overflow-hidden group hover:scale-105 transition-transform duration-300">            
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
              <Activity size={18} className="text-white" />
            </div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              Laporan Pengaduan
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map(year => (
            <StatCard 
              key={`lap-${year}`}
              year={year}
              count={stats.laporan[year]}
              label="Laporan Masuk"
              icon={<FileText size={20} />}
              colorClass="text-[#8b1f23] bg-red-50 group-hover:bg-[#8b1f23] group-hover:text-white"
              onClick={() => handleStatClick(year, JENIS_PERKARA.LAPORAN_PENGADUAN)}
              isLoading={loading}
            />
          ))}
        </div>
      </section>

      {/* 2. PENYELIDIKAN */}
      <section>
        <div className="mb-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8b1f23] to-[#5c1416] rounded-full pl-2 pr-6 py-1.5 text-white shadow-lg shadow-[#8b1f23]/20 border border-white/10 relative overflow-hidden group hover:scale-105 transition-transform duration-300">            
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
              <Search size={18} className="text-white" />
            </div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              Penyelidikan
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map(year => (
            <StatCard 
              key={`lid-${year}`}
              year={year}
              count={stats.penyelidikan[year]}
              label="Perkara Lid"
              icon={<Search size={20} />}
              colorClass="text-[#8b1f23] bg-red-50 group-hover:bg-[#8b1f23] group-hover:text-white"
              onClick={() => handleStatClick(year, JENIS_PERKARA.PENYELIDIKAN)}
              isLoading={loading}
            />
          ))}
        </div>
      </section>

      {/* 3. PENYIDIKAN */}
      <section>
        <div className="mb-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8b1f23] to-[#5c1416] rounded-full pl-2 pr-6 py-1.5 text-white shadow-lg shadow-[#8b1f23]/20 border border-white/10 relative overflow-hidden group hover:scale-105 transition-transform duration-300">            
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
              <Scale size={18} className="text-white" />
            </div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              Penyidikan
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map(year => (
            <StatCard 
              key={`dik-${year}`}
              year={year}
              count={stats.penyidikan[year]}
              label="Perkara Dik"
              icon={<Scale size={20} />}
              colorClass="text-[#8b1f23] bg-red-50 group-hover:bg-[#8b1f23] group-hover:text-white"
              onClick={() => handleStatClick(year, JENIS_PERKARA.PENYIDIKAN)}
              isLoading={loading}
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
        </div>
        <div className="space-y-3">
          {loading ? [1,2,3].map(i => <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse"><div className="h-10 w-40 bg-gray-200 rounded"></div></div>) : 
                stats.recentCases.length > 0 ? stats.recentCases.map((perkara) => (
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
                     <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${perkara.status_perkara.includes('Selesai') || perkara.status_perkara.includes('Naik') ? 'bg-green-50 text-green-700 border-green-200' : perkara.status_perkara.includes('Proses') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{perkara.status_perkara}</span>
                  </div>
                )) : <div className="text-center py-8 text-slate-400 italic">Belum ada perkara</div>
              }
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

function StatCard({ year, count, label, icon, colorClass, onClick, isLoading }) {
  return (
    <div className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Tahun {year}</p>
          <div className="flex items-baseline gap-1">
            {isLoading ? (
               <div className="h-8 w-12 bg-slate-200 rounded animate-pulse mb-1"></div>
            ) : (
               <span className="text-3xl font-display font-bold text-slate-800">
                 <CountUp end={count || 0} />
               </span>
            )}
            <span className="text-xs text-slate-500 font-medium">kasus</span>
          </div>
        </div>
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${colorClass}`}
          onClick={onClick}
          title="Lihat Detail"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, stats, isLoading }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full relative overflow-hidden transition-all duration-300">
      
      {/* Decorative Top Gradient (Appears on Hover) */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8b1f23] to-[#5c1416] opacity-100 transition-opacity duration-300"></div>

      {/* Header - Clean Left Aligned */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
        <h3 className="font-display text-lg font-bold text-slate-800 group-hover:text-[#8b1f23] transition-colors">
          {title}
        </h3>
        {/* Subtle decorative dot */}
        <div className="w-2 h-2 rounded-full bg-[#8b1f23] transition-colors"></div>
      </div>

      {/* Content */}
      <div className="space-y-1 flex-grow">
        <StatusRow 
          icon={<Clock size={18} />} 
          color="text-blue-600 bg-blue-50" 
          label="Dalam Proses" 
          count={stats.proses} 
          isLoading={isLoading} 
        />
        <StatusRow 
          icon={<XCircle size={18} />} 
          color="text-red-600 bg-red-50" 
          label="Dihentikan" 
          count={stats.dihentikan} 
          isLoading={isLoading} 
        />
        <StatusRow 
          icon={<CheckCircle size={18} />} 
          color="text-green-600 bg-green-50" 
          label="Tindak Lanjut" 
          count={stats.naik} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

// Slightly updated StatusRow to have padding/hover background
function StatusRow({ icon, color, label, count, isLoading }) {
  return (
    <div className="flex items-center justify-between p-1 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg transition-colors ${color}`}>
          {icon}
        </div>
        <span className="text-slate-600 font-medium text-sm">{label}</span>
      </div>
      
      {isLoading ? (
        <div className="h-6 w-8 bg-slate-200 rounded animate-pulse"></div>
      ) : (
        <span className="font-bold text-slate-800 text-lg font-display">
          <CountUp end={count || 0} duration={1500} />
        </span>
      )}
    </div>
  );
}

function CountUp({ end, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease Out Expo: Starts fast, ends slow (Smooth UI feel)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}</>;
}