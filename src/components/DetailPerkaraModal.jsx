import { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, FileText, Download, Calendar } from 'lucide-react';
import { getPerkaraById, updatePerkara } from '../services/perkaraService'; // Import the new service
import { JENIS_PERKARA, getAllowedStatuses, getYearOptions, formatDate } from '../util';

export default function DetailPerkaraModal({ isOpen, onClose, perkaraId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Initial State
  const [formData, setFormData] = useState({
    nama_perkara: '',
    nomor_sp: '',
    tanggal_sp: '',
    jenis_perkara: '',
    tahun: '',
    status_perkara: '',
    keterangan: '',
    dokumen_terkait: []
  });
  
  // State to hold the EXISTING file (Array)
  const [existingFiles, setExistingFiles] = useState([]);

  const years = getYearOptions();
  // Get valid statuses based on current selection
  const validStatuses = formData.jenis_perkara ? getAllowedStatuses(formData.jenis_perkara) : [];

  useEffect(() => {
    if (isOpen && perkaraId) {
      fetchDetail();
    }
  }, [isOpen, perkaraId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await getPerkaraById(perkaraId);
      
      setFormData({
        nama_perkara: data.nama_perkara,
        nomor_sp: data.nomor_sp,
        tanggal_sp: data.tanggal_sp ? new Date(data.tanggal_sp).toISOString().split('T')[0] : '',
        jenis_perkara: data.jenis_perkara,
        tahun: data.tahun,
        status_perkara: data.status_perkara,
        keterangan: data.keterangan || '',
        dokumen_terkait: []
      });

      // Handle existing files (Ensure it's an array)
      if (Array.isArray(data.dokumen_terkait)) {
        setExistingFiles(data.dokumen_terkait);
      } else if (data.dokumen_terkait) {
        setExistingFiles([data.dokumen_terkait]); // Fallback for single file string
      } else {
        setExistingFiles([]);
      }

    } catch (err) {
      console.error(err);
      setError("Gagal mengambil detail perkara.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;    
    if (name === 'jenis_perkara') {
      const newStatuses = getAllowedStatuses(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        status_perkara: newStatuses[0] 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, dokumen_terkait: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('nama_perkara', formData.nama_perkara);
      data.append('nomor_sp', formData.nomor_sp);
      data.append('tanggal_sp', formData.tanggal_sp);
      data.append('jenis_perkara', formData.jenis_perkara);
      data.append('tahun', formData.tahun);
      data.append('status_perkara', formData.status_perkara);
      data.append('keterangan', formData.keterangan);
      
      // Append Multiple Files
      if (formData.dokumen_terkait && formData.dokumen_terkait.length > 0) {
        formData.dokumen_terkait.forEach((file) => {
          data.append('dokumen_terkait', file);
        });
      }

      const updatedItem = await updatePerkara(perkaraId, data);
      
      onSuccess(updatedItem);
      onClose();

    } catch (err) {
      console.error(err);
      setError('Gagal memperbarui perkara.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg text-white">
                <FileText size={20} />
             </div>
             <div>
                <h2 className="text-xl font-display font-bold text-white">Detail Perkara</h2>
             </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[#8b1f23] rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm">Memuat data...</p>
             </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* EXISTING FILES LIST */}
                {existingFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <label className="block text-sm font-semibold text-slate-700">Dokumen Tersimpan</label>
                    {existingFiles.map((file, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 overflow-hidden">
                              <div className="bg-blue-100 p-1.5 rounded text-blue-600"><FileText size={16}/></div>
                              <div className="truncate">
                                  {/* FIX: Render specific property (nama_file) instead of the whole object */}
                                  <p className="text-sm text-slate-700 truncate max-w-[200px]">
                                    {file.nama_file || 'Dokumen Tanpa Nama'}
                                  </p>
                              </div>
                          </div>
                          {/* FIX: Use file.url for the link */}
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 p-1" title="Download/Lihat">
                              <Download size={18} />
                          </a>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Perkara / Tersangka</label>
                  <input type="text" name="nama_perkara" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none" value={formData.nama_perkara} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor SP</label>
                    <input type="text" name="nomor_sp" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none" value={formData.nomor_sp} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal SP</label>
                    <input type="date" name="tanggal_sp" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none" value={formData.tanggal_sp} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Perkara</label>
                    <select name="jenis_perkara" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none bg-white" value={formData.jenis_perkara} onChange={handleChange}>
                      {Object.values(JENIS_PERKARA).map(jenis => (<option key={jenis} value={jenis}>{jenis}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tahun</label>
                    <select name="tahun" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none bg-white" value={formData.tahun} onChange={handleChange}>
                      {years.map(year => (<option key={year} value={year}>{year}</option>))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status Perkara</label>
                  <select name="status_perkara" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none bg-white" value={formData.status_perkara} onChange={handleChange}>
                    {validStatuses.map(status => (<option key={status} value={status}>{status}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Keterangan</label>
                  <textarea 
                    name="keterangan" 
                    rows="3" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none resize-none"
                    value={formData.keterangan}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Tambah Dokumen (Bisa Pilih Banyak)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      multiple // Multiple
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Upload size={24} />
                      <span className="text-sm font-medium">
                         {formData.dokumen_terkait.length > 0 
                          ? `${formData.dokumen_terkait.length} file baru dipilih` 
                          : 'Klik untuk tambah file PDF'}
                      </span>
                    </div>
                  </div>
                  {formData.dokumen_terkait.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.dokumen_terkait.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-1.5 rounded">
                          <Check size={14} /> <span className="truncate">Akan diupload: {file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                  <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Tutup</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[#8b1f23] text-white font-bold rounded-lg hover:bg-[#6d181b] shadow-lg hover:shadow-xl transition flex items-center gap-2">
                    {submitting ? 'Menyimpan...' : <><Check size={18} /> Simpan Perubahan</>}
                  </button>
                </div>

              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}