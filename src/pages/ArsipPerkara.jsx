import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FolderOpen, FileText, Trash2, Calendar, Clock, Edit2, Check, X } from 'lucide-react';
import { getPerkara, deletePerkara, updateStatus } from '../services/perkaraService';
import AddPerkaraModal from '../components/AddPerkaraModal';
import DeleteModal from '../components/DeleteModal';
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
  const [data, setData] = useState([]);
  
  // MODAL & EDIT STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // FILTERS
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedYear, setSelectedYear] = useState("all"); 
  
  const isLoggedIn = !!localStorage.getItem('token');
  const years = getYearOptions(); 

  const fetchData = async () => {
    try {
      const result = await getPerkara();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- NEW: Handle Direct State Update for ADD ---
  const handleAddSuccess = (newItem) => {
    // If the API returns the new item, add it to the top of the list
    if (newItem) {
      setData(prev => [newItem, ...prev]);
    } else {
      // Fallback if API doesn't return data (safeguard)
      fetchData();
    }
  };

  // DERIVED STATE (Filters)
  const filteredData = data.filter((item) => {
    const matchYear = selectedYear === "all" || item.tahun === parseInt(selectedYear);
    const matchStatus = statusFilter === "All" || item.status_perkara === statusFilter;
    const matchSearch = !searchTerm || (
      item.nama_perkara?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.nomor_sp?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchYear && matchStatus && matchSearch;
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
  
  const handleEditClick = (item) => { setEditingId(item._id); setTempStatus(item.status_perkara); };
  const handleCancelEdit = () => { setEditingId(null); setTempStatus(""); };

  const handleSaveStatus = async (id) => { 
    setIsSaving(true);
    try {
      await updateStatus(id, tempStatus);
      setData(prevData => prevData.map(item => item._id === id ? { ...item, status_perkara: tempStatus } : item));
      setEditingId(null);
    } catch (error) { alert("Gagal update"); } 
    finally { setIsSaving(false); }
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
        <div className="relative min-w-[180px] group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Filter className="text-slate-400 group-focus-within:text-[#8b1f23] transition-colors" size={18} /></div>
          <select className="block w-full pl-10 pr-10 py-2.5 border-none bg-transparent rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-[#8b1f23]/10 focus:bg-slate-50 cursor-pointer appearance-none transition-all" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Semua Status</option>
            {Object.values(STATUS_PERKARA).map(status => (<option key={status} value={status}>{status}</option>))}
          </select>
        </div>
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
                    {editingId === item._id ? (
                       <select value={tempStatus} onChange={(e) => setTempStatus(e.target.value)} className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1f23] shadow-sm max-w-[140px]">
                         {getAllowedStatuses(item.jenis_perkara).map(status => (<option key={status} value={status}>{status}</option>))}
                       </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status_perkara)}`}>{item.status_perkara}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3 text-sm text-slate-500 flex-1">
                  <div className="flex items-center gap-3"><FileText size={16} className="text-slate-400 shrink-0" /><span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-medium">{item.nomor_sp}</span></div>
                  <div className="flex items-center gap-3"><Calendar size={16} className="text-slate-400 shrink-0" /><span>{formatDate(item.tanggal_sp)}</span></div>
                  <div className="flex items-center gap-3"><FolderOpen size={16} className="text-slate-400 shrink-0" /><span>{item.jenis_perkara}</span></div>
                  <div className="flex items-center gap-3"><Clock size={16} className="text-slate-400 shrink-0" /><span>Tahun: {item.tahun}</span></div>
                </div>
                {isLoggedIn && (
                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
                    {editingId === item._id ? (
                      <>
                        <button onClick={handleCancelEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-medium text-xs"><X size={14} /> Batal</button>
                        <button onClick={() => handleSaveStatus(item._id)} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-xs shadow-sm"><Check size={14} /> {isSaving ? 'Menyimpan...' : 'Simpan'}</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(item)} className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-sm font-medium text-xs" title="Ubah Status"><Edit2 size={14} /> Ubah</button>
                        <button onClick={() => handleDeleteClick(item._id)} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium text-xs" title="Hapus Perkara"><Trash2 size={14} /> Hapus</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><FolderOpen className="text-slate-300" size={32} /></div>
             <h3 className="text-slate-900 font-semibold text-lg">Tidak ada data ditemukan</h3>
             <button onClick={() => {setSearchTerm(''); setStatusFilter('All'); setSelectedYear('all');}} className="mt-4 text-[#8b1f23] font-medium text-sm hover:underline">Reset Filter</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddPerkaraModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleAddSuccess} // PASS THE NEW HANDLER
        />
      )}
      {isDeleteModalOpen && <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} isLoading={isDeleting} />}
    </div>
  );
}