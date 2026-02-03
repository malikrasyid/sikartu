import { useState } from 'react';
import { X, Upload, Check, AlertCircle, FileText } from 'lucide-react';
import { createPerkara } from '../services/perkaraService';
import { JENIS_PERKARA, getAllowedStatuses, getYearOptions } from '../util';

export default function AddPerkaraModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultJenis = Object.values(JENIS_PERKARA)[0];
  const defaultStatus = getAllowedStatuses(defaultJenis)[0];
  
  const [formData, setFormData] = useState({
    nama_perkara: '',
    nomor_sp: '',
    tanggal_sp: '',
    jenis_perkara: defaultJenis,
    tahun: new Date().getFullYear(),
    status_perkara: defaultStatus,
    keterangan: '',
    dokumen_terkait: []
  });

  const validStatuses = getAllowedStatuses(formData.jenis_perkara);
  const years = getYearOptions();
  
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

  // Handle Multiple Files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, dokumen_terkait: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData object for file upload
      const data = new FormData();
      data.append('nama_perkara', formData.nama_perkara);
      data.append('nomor_sp', formData.nomor_sp);
      data.append('tanggal_sp', formData.tanggal_sp);
      data.append('jenis_perkara', formData.jenis_perkara);
      data.append('tahun', formData.tahun);
      data.append('status_perkara', formData.status_perkara);
      data.append('keterangan', formData.keterangan); // Append Keterangan

      // Append Multiple Files
      if (formData.dokumen_terkait && formData.dokumen_terkait.length > 0) {
        formData.dokumen_terkait.forEach((file) => {
          data.append('dokumen_terkait', file);
        });
      }

      console.log('Submitting data:', formData);
      const newItem = await createPerkara(data);
      
      onSuccess(newItem); 
      onClose();
      
    } catch (err) {
      console.error(err);
      setError('Gagal menambahkan perkara. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // If not open, return null (though conditioned in parent, this is safe)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-gradient-to-r from-[#8b1f23] to-[#5c1416] p-6 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-display font-bold text-white">Tambah Perkara Baru</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Perkara / Tersangka</label>
              <input type="text" name="nama_perkara" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] focus:border-transparent outline-none" placeholder="Contoh: Dugaan Korupsi Pembangunan..." value={formData.nama_perkara} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor SP</label>
                <input type="text" name="nomor_sp" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none" placeholder="PRINT-..." value={formData.nomor_sp} onChange={handleChange} />
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
                  {Object.values(JENIS_PERKARA).map(jenis => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tahun</label>
                <select 
                  name="tahun" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none bg-white"
                  value={formData.tahun} 
                  onChange={handleChange}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status Perkara</label>
              <select name="status_perkara" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none bg-white" value={formData.status_perkara} onChange={handleChange}>
                {validStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Keterangan</label>
              <textarea 
                name="keterangan" 
                rows="3" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8b1f23] outline-none resize-none"
                placeholder="Tambahkan keterangan tambahan..."
                value={formData.keterangan}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Dokumen Fisik (PDF)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  multiple // Allow multiple
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <Upload size={24} />
                  <span className="text-sm font-medium">
                    {formData.dokumen_terkait.length > 0 
                      ? `${formData.dokumen_terkait.length} file dipilih` 
                      : 'Klik untuk upload dokumen (Bisa banyak)'}
                  </span>
                </div>
              </div>
              {formData.dokumen_terkait.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.dokumen_terkait.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 p-1.5 rounded">
                      <FileText size={14} /> <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Batal</button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#8b1f23] text-white font-bold rounded-lg hover:bg-[#6d181b] shadow-lg hover:shadow-xl transition flex items-center gap-2">
                {loading ? 'Menyimpan...' : <><Check size={18} /> Simpan Data</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}