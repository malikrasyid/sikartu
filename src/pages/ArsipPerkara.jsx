import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FolderOpen, FileText } from 'lucide-react';
import { getPerkara, deletePerkara } from '../services/perkaraService';
import AddPerkaraModal from '../components/AddPerkaraModal';

export default function ArsipPerkara() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // States for Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedYear, setSelectedYear] = useState("all"); // New State for Year Tabs

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // 2. Filter Logic (Search + Status + Year)
  useEffect(() => {
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
      result = result.filter(item => 
        item.nama_perkara.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nomor_sp.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(result);
  }, [searchTerm, statusFilter, selectedYear, data]);

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    
    setIsDeleting(true);
    try {
      await deletePerkara(selectedDeleteId);
      await fetchData(); // Refresh table
      setIsDeleteModalOpen(false); // Close modal
      setSelectedDeleteId(null);
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Gagal menghapus perkara");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for Year Tab Styling
  const getTabClass = (year) => {
    const activeClass = "bg-[#8b1f23] text-white shadow-md transform scale-105";
    const inactiveClass = "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800";
    return `px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedYear === year ? activeClass : inactiveClass}`;
  };

  return (
    <div id="page-archive" className="page-content animate-fade-in">
      
      {/* --- HEADER SECTION (FROM YOUR HTML) --- */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#8b1f23]">Arsip Perkara</h2>
          <p className="text-slate-600 mt-1">Kelola dan akses dokumen perkara berdasarkan tahun</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#8b1f23] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#6d181b] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Perkara
        </button>
      </header>

      {/* --- YEAR TABS (FROM YOUR HTML) --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedYear('all')} className={getTabClass('all')}>
          Semua
        </button>
        <button onClick={() => setSelectedYear(2024)} className={getTabClass(2024)}>
          2024
        </button>
        <button onClick={() => setSelectedYear(2025)} className={getTabClass(2025)}>
          2025
        </button>
        <button onClick={() => setSelectedYear(2026)} className={getTabClass(2026)}>
          2026
        </button>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama perkara atau nomor SP..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-3 text-slate-400" size={18} />
          <select 
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1f23] appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Semua Status</option>
            <option value="Proses">Proses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditangguhkan">Ditangguhkan</option>
          </select>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div id="archiveList" className="space-y-4">
        
        {/* EMPTY STATE (FROM YOUR HTML) - Shown when no data matches */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg border border-slate-100 text-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📂</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Tidak ada data ditemukan</h3>
            <p className="text-slate-500 mt-1">Belum ada perkara terdaftar untuk kategori ini</p>
            <p className="text-slate-400 text-sm mt-2">
              Klik "Tambah Perkara" untuk menambahkan data baru
            </p>
          </div>
        ) : (
          /* TABLE VIEW - Shown when data exists */
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4">Nama Perkara</th>
                  <th className="p-4">Nomor SP</th>
                  <th className="p-4">Jenis</th>
                  <th className="p-4">Tahun</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800 flex items-center gap-2">
                      <FileText size={16} className="text-[#8b1f23]" />
                      {item.nama_perkara}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-sm">{item.nomor_sp}</td>
                    <td className="p-4 text-slate-600">{item.jenis_perkara}</td>
                    <td className="p-4 text-slate-600">{item.tahun}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                        ${item.status_perkara === 'Selesai' ? 'bg-green-100 text-green-700' : 
                          item.status_perkara === 'Proses' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                        {item.status_perkara}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {/* Detail Button */}
                        <button className="text-[#8b1f23] hover:text-[#5c1416] font-medium text-sm hover:underline">
                          Detail
                        </button>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteClick(item._id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus Perkara"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {isModalOpen && (
        <AddPerkaraModal 
          closeModal={() => setIsModalOpen(false)} 
          refreshData={fetchData} 
        />
      )}

      {/* DELETE MODAL */}
      <ModalDelete 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}