import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FolderOpen, FileText, Trash2 } from 'lucide-react';
import { getPerkara, deletePerkara } from '../services/perkaraService';
import AddPerkaraModal from '../components/AddPerkaraModal';
import DeleteModal from '../components/DeleteModal';

export default function ArsipPerkara() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // States for Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedYear, setSelectedYear] = useState("all"); 
  
  // States for Delete
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const result = await getPerkara();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Filter Logic (Search + Status + Year)
  useEffect(() => {
    if (!data) return;

    let result = data;

    // Filter by Year (From Tabs)
    if (selectedYear !== "all") {
      result = result.filter(item => item.tahun === parseInt(selectedYear));
    }

    // Filter by Status (From Dropdown)
    if (statusFilter !== "All") {
      result = result.filter(item => item.status_perkara === statusFilter);
    }

    // Filter by Search (Name or SP Number)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.nama_perkara.toLowerCase().includes(lowerTerm) ||
        item.nomor_sp.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredData(result);
  }, [searchTerm, statusFilter, selectedYear, data]);

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;    
    setIsDeleting(true);
    try {
      await deletePerkara(selectedDeleteId);
      await fetchData(); // Refresh data
      setIsDeleteModalOpen(false);
      setSelectedDeleteId(null);
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Gagal menghapus perkara");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full animate-fade-in space-y-6">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#8b1f23]">Arsip Perkara</h1>
          <p className="text-slate-600">Kelola dan telusuri data perkara tindak pidana khusus</p>
        </div>

        {/* CONDITION: ONLY SHOW BUTTON IF LOGGED IN */}
        {isLoggedIn && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#8b1f23] text-white px-5 py-2.5 rounded-xl hover:bg-[#5c1416] transition-all shadow-md group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span className="font-medium">Tambah Perkara</span>
          </button>
        )}
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        
        {/* Year Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['all', '2024', '2025', '2026'].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedYear === year 
                  ? 'bg-white text-[#8b1f23] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {year === 'all' ? 'Semua' : year}
            </button>
          ))}
        </div>

        {/* Search & Status */}
        <div className="flex flex-col md:flex-row gap-3 flex-1 justify-end">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Cari nama atau No. SP..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1f23]/20 focus:border-[#8b1f23] w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1f23]/20 focus:border-[#8b1f23] appearance-none cursor-pointer text-slate-700 font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Semua Status</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Dihentikan">Dihentikan</option>
              <option value="Naik Penyidikan">Naik Penyidikan</option>
            </select>
          </div>

        </div>
      </div>

      {/* DATA LIST / TABLE */}
      <div className="grid grid-cols-1 gap-4">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item._id} className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#8b1f23]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  item.jenis_perkara === 'Penyidikan' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  <FolderOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#8b1f23] transition-colors">
                    {item.nama_perkara}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText size={14} /> {item.nomor_sp}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold">
                      {item.tahun}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      item.status_perkara === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status_perkara}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-[#8b1f23] hover:text-white rounded-lg transition-colors border border-slate-200">
                  Detail
                </button>
                
                {/* CONDITION: ONLY SHOW DELETE IF LOGGED IN */}
                {isLoggedIn && (
                  <button 
                    onClick={() => handleDeleteClick(item._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Perkara"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <FolderOpen className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500 font-medium">Belum ada data perkara</p>
            <p className="text-slate-400 text-sm">Coba sesuaikan filter pencarian anda</p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <AddPerkaraModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchData} 
        />
      )}
      
      {isDeleteModalOpen && (
        <DeleteModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={confirmDelete} 
          isLoading={isDeleting}
        />
      )}

    </div>
  );
}