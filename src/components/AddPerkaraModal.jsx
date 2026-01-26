import { useState } from 'react';
import { X, Upload, Save, RotateCcw, CheckCircle } from 'lucide-react';
import { createPerkara } from '../services/perkaraService';

export default function AddPerkaraModal({ closeModal, refreshData }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    tahun: '',
    nama_perkara: '',
    nomor_sp: '',
    tanggal_sp: '',
    jenis_perkara: '',
    status_perkara: '',
  });
  
  // File State (Separate from formData because it's binary)
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Prepare FormData (Required for File Uploads)
      const data = new FormData();
      data.append('tahun', formData.tahun);
      data.append('nama_perkara', formData.nama_perkara);
      data.append('nomor_sp', formData.nomor_sp);
      data.append('tanggal_sp', formData.tanggal_sp);
      data.append('jenis_perkara', formData.jenis_perkara);
      data.append('status_perkara', formData.status_perkara);
      
      if (file) {
        data.append('dokumen_terkait', file); // Must match backend 'upload.single()' name
      }

      // 2. Call API
      await createPerkara(data);

      // 3. Handle Success
      setSuccess(true);
      refreshData(); // Refresh the table behind the modal
      
      // Close modal automatically after 2 seconds
      setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal menyimpan perkara');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Header */}
          <header className="mb-8 border-b border-slate-100 pb-4">
            <h2 className="font-display text-3xl font-bold text-[#8b1f23]">Tambah Perkara Baru</h2>
            <p className="text-slate-600 mt-1">Daftarkan perkara baru ke dalam sistem arsip</p>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message (Replaces Form on Success) */}
          {success ? (
             <div className="bg-green-50 border border-green-200 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
               <CheckCircle className="w-10 h-10 text-green-600" />
             </div>
             <div>
               <p className="text-xl font-bold text-green-800">Perkara berhasil ditambahkan!</p>
               <p className="text-green-600 mt-1">Data telah tersimpan ke dalam sistem arsip.</p>
             </div>
           </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Tahun */}
              <div>
                <label htmlFor="tahun" className="block text-sm font-medium text-slate-700 mb-2">
                  Tahun <span className="text-red-500">*</span>
                </label>
                <select 
                  id="tahun" 
                  required 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none"
                  onChange={handleChange}
                >
                  <option value="">Pilih Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              {/* Nama Perkara */}
              <div>
                <label htmlFor="nama_perkara" className="block text-sm font-medium text-slate-700 mb-2">
                  Nama Perkara <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="nama_perkara" 
                  required 
                  placeholder="Contoh: Dugaan Tindak Pidana Korupsi..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none"
                  onChange={handleChange}
                />
              </div>

              {/* Grid: SP Number & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nomor_sp" className="block text-sm font-medium text-slate-700 mb-2">
                    Nomor SP <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="nomor_sp" 
                    required 
                    placeholder="Contoh: 01/L.3/Fd.1/01/2024"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="tanggal_sp" className="block text-sm font-medium text-slate-700 mb-2">
                    Tanggal SP <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    id="tanggal_sp" 
                    required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Grid: Type & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="jenis_perkara" className="block text-sm font-medium text-slate-700 mb-2">
                    Jenis Perkara <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="jenis_perkara" 
                    required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none"
                    onChange={handleChange}
                  >
                    <option value="">Pilih Jenis Perkara</option>
                    <option value="Penyelidikan">Penyelidikan</option>
                    <option value="Penyidikan">Penyidikan</option>
                    <option value="Pidana Umum">Pidana Umum</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status_perkara" className="block text-sm font-medium text-slate-700 mb-2">
                    Status Perkara <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="status_perkara" 
                    required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none"
                    onChange={handleChange}
                  >
                    <option value="">Pilih Status</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditangguhkan">Ditangguhkan</option>
                  </select>
                </div>
              </div>

              {/* File Upload (Changed from Textarea to File Input) */}
              <div>
                <label htmlFor="dokumen" className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Dokumen (PDF)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#8b1f23] transition cursor-pointer relative bg-slate-50">
                  <input 
                    type="file" 
                    id="dokumen" 
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="text-slate-400 mb-2" size={32} />
                    <p className="text-sm font-medium text-slate-600">
                      {file ? file.name : "Klik untuk upload atau drag & drop"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Maksimal ukuran 5MB (PDF)</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex-1 px-8 py-3 bg-[#8b1f23] text-white rounded-lg font-medium hover:bg-[#a62529] transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    'Menyimpan...'
                  ) : (
                    <>
                      <Save size={20} /> Simpan Perkara
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => closeModal()}
                  className="px-8 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={20} /> Batal
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}