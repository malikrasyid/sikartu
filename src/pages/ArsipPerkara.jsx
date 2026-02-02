import { useState, useEffect } from 'react';
import { usePerkara } from '../context/PerkaraContext';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Filter, FolderOpen, FileText, Trash2, Calendar, Clock, X, Info, StickyNote } from 'lucide-react';
import { getPerkara, deletePerkara } from '../services/perkaraService';
import AddPerkaraModal from '../components/AddPerkaraModal';
import DeleteModal from '../components/DeleteModal';
import DetailPerkaraModal from '../components/DetailPerkaraModal';
import { 
  formatDate, 
  getStatusColor, 
  getJenisColor,
  STATUS_PERKARA, 
  JENIS_PERKARA, 
  getAllowedStatuses, 
  getYearOptions 
} from '../util';

export default function ArsipPerkara() {
  const { data, loading, fetchData, setData } = usePerkara();
  const location = useLocation();
  
  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // FILTERS
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedYear, setSelectedYear] = useState(location.state?.year || "all"); 
  const [jenisFilter, setJenisFilter] = useState(location.state?.jenis || "All");

  const isLoggedIn = !!localStorage.getItem('token');
  const years = getYearOptions(); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (location.state?.year) setSelectedYear(location.state.year); 
    if (location.state?.jenis) setJenisFilter(location.state.jenis);
    if (location.state?.status) setStatusFilter(location.state.status);
  }, [location.state]);

  const handleAddSuccess = (newItem) => {
    if (newItem) {
      setData(prev => [newItem, ...prev]);
    } else 
      fetchData(true);    
  };

  const handleUpdateSuccess = (updatedItem) => {
    if (updatedItem) {
      setData(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
    } else 
      fetchData(true);
    
  };

  const handleDetailClick = (id) => {
    setDetailId(id);
    setIsDetailModalOpen(true);
  };

  const filteredData = data.filter((item) => {
    const matchYear = selectedYear === "all" || item.tahun === parseInt(selectedYear);
    const matchStatus = statusFilter === "All" || item.status_perkara === statusFilter;
    const matchJenis = jenisFilter === "All" || item.jenis_perkara === jenisFilter;
    const matchSearch = !searchTerm || (
      item.nama_perkara?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.nomor_sp?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchYear && matchStatus && matchJenis && matchSearch;
  });

  const handleDeleteClick = (id) => { setSelectedDeleteId(id); setIsDeleteModalOpen(true); };

  const confirmDelete = async () => { 
    if (!selectedDeleteId) return;
    setIsDeleting(true);
    try {
      await deletePerkara(selectedDeleteId);
      setData(prevData => prevData.filter(item => item._id !== selectedDeleteId));
      setIsDeleteModalOpen(false);
      setSelectedDeleteId(null);
    } catch (error) { console.error(error); alert("Gagal hapus"); } 
    finally { setIsDeleting(false); }
  };

  return (
    <div className="w-full animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#8b1f23]">Arsip Perkara</h1>
          <p className="text-slate-600">Kelola dan telusuri data perkara tindak pidana khusus</p>
        </div>
        {isLoggedIn && (
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#8b1f23] text-white px-5 py-2.5 rounded-xl hover:bg-[#5c1416] transition-all shadow-md group transform hover:-translate-y-0.5">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span className="font-medium">Tambah Perkara</span>
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="text-slate-400 group-focus-within:text-[#8b1f23] transition-colors" size={18} /></div>
          <input type="text" placeholder="Cari nama tersangka, perkara, atau No. SP..." className="block w-full pl-10 pr-3 py-2.5 border-none bg-transparent rounded-xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#8b1f23]/10 focus:bg-slate-50 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="hidden md:block w-px bg-slate-200 my-2"></div>
        <div className="relative min-w-[160px] group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="text-slate-400 group-focus-within:text-[#8b1f23] transition-colors" size={18} /></div>
          <select className="block w-full pl-10 pr-10 py-2.5 border-none bg-transparent rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-[#8b1f23]/10 focus:bg-slate-50 cursor-pointer appearance-none transition-all" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="all">Semua Tahun</option>
            {years.map((year) => (<option key={year} value={year}>{year}</option>))}
          </select>
        </div>
        <div className="relative min-w-[160px] group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FolderOpen className="text-slate-400 group-focus-within:text-[#8b1f23] transition-colors" size={18} /></div>
          <select className="block w-full pl-10 pr-8 py-2.5 border-none bg-transparent rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-[#8b1f23]/10 focus:bg-slate-50 cursor-pointer appearance-none transition-all" value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)}>
            <option value="All">Semua Jenis</option>
            {Object.values(JENIS_PERKARA).map(jenis => (<option key={jenis} value={jenis}>{jenis}</option>))}
          </select>
        </div>
        <div className="relative min-w-[180px] group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Filter className="text-slate-400 group-focus-within:text-[#8b1f23] transition-colors" size={18} /></div>
          <select className="block w-full pl-10 pr-10 py-2.5 border-none bg-transparent rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-[#8b1f23]/10 focus:bg-slate-50 cursor-pointer appearance-none transition-all" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Semua Status</option>
            {Object.values(STATUS_PERKARA).map(status => (<option key={status} value={status}>{status}</option>))}
          </select>
        </div>

        {(selectedYear !== 'all' || jenisFilter !== 'All' || statusFilter !== 'All' || searchTerm) && (
          <button 
            onClick={() => {setSearchTerm(''); setStatusFilter('All'); setSelectedYear('all'); setJenisFilter('All');}}
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Reset Filters"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* DATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item._id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#8b1f23]/20 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getJenisColor(item.jenis_perkara)}`}></div>
              <div className="p-5 pl-7 flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-display font-bold text-slate-800 text-lg leading-snug flex-1 group-hover:text-[#8b1f23] transition-colors">{item.nama_perkara}</h3>
                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status_perkara)}`}>{item.status_perkara}</span>                    
                  </div>
                </div>
              
                <div className="space-y-3 text-sm text-slate-500 flex-1">
                  <div className="flex items-center gap-3"><FileText size={16} className="text-slate-400 shrink-0" /><span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-medium">{item.nomor_sp}</span></div>
                  <div className="flex items-center gap-3"><Calendar size={16} className="text-slate-400 shrink-0" /><span>{formatDate(item.tanggal_sp)}</span></div>
                  <div className="flex items-center gap-3"><FolderOpen size={16} className="text-slate-400 shrink-0" /><span>{item.jenis_perkara}</span></div>
                  <div className="flex items-center gap-3"><Clock size={16} className="text-slate-400 shrink-0" /><span>Tahun: {item.tahun}</span></div>
                  {item.keterangan && (
                    <div className="flex items-center gap-3">
                      <StickyNote size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate">{item.keterangan}</span>
                    </div>
                  )}
                </div>
                {isLoggedIn && (
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleDetailClick(item._id)} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-slate-800 hover:text-white transition shadow-sm font-medium text-xs" 
                      title="Lihat Detail & Edit Full"
                    >
                      <Info size={14} /> Detail
                    </button>                    
                    <button onClick={() => handleDeleteClick(item._id)} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium text-xs" title="Hapus Perkara"><Trash2 size={14} /> Hapus</button>                  
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><FolderOpen className="text-slate-300" size={32} /></div>
             <h3 className="text-slate-900 font-semibold text-lg">Tidak ada data ditemukan</h3>
             <button onClick={() => {setSearchTerm(''); setStatusFilter('All'); setSelectedYear('all'); setJenisFilter('All');}} className="mt-4 text-[#8b1f23] font-medium text-sm hover:underline">Reset Filter</button>
          </div>
        )}
      </div>

      <AddPerkaraModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleAddSuccess} />
      
      <DetailPerkaraModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        perkaraId={detailId}
        onSuccess={handleUpdateSuccess}
      />

      {isDeleteModalOpen && <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} isLoading={isDeleting} />}
    </div>
  );
}