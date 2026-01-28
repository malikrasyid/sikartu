// --- CONSTANTS (ENUMS) ---

export const JENIS_PERKARA = {
  LAPORAN_PENGADUAN: 'Laporan Pengaduan', 
  PENYELIDIKAN: 'Penyelidikan',
  PENYIDIKAN: 'Penyidikan',
};

export const STATUS_PERKARA = {
  DALAM_PROSES: 'Dalam Proses',
  DIHENTIKAN: 'Dihentikan',
  NAIK_PENYELIDIKAN: 'Naik Penyelidikan',
  NAIK_PENYIDIKAN: 'Naik Penyidikan',
  NAIK_PRAPENUNTUTAN: 'Naik Prapenuntutan'
};

// --- VALIDATION RULES (BUSINESS LOGIC) ---
// This maps each "Jenis" to its allowed "Statuses"
const STATUS_MAPPING = {
  [JENIS_PERKARA.LAPORAN_PENGADUAN]: [
    STATUS_PERKARA.DALAM_PROSES,
    STATUS_PERKARA.DIHENTIKAN,
    STATUS_PERKARA.NAIK_PENYELIDIKAN
  ],
  [JENIS_PERKARA.PENYELIDIKAN]: [
    STATUS_PERKARA.DALAM_PROSES,
    STATUS_PERKARA.DIHENTIKAN,
    STATUS_PERKARA.NAIK_PENYIDIKAN
  ],
  [JENIS_PERKARA.PENYIDIKAN]: [
    STATUS_PERKARA.DALAM_PROSES,
    STATUS_PERKARA.DIHENTIKAN,
    STATUS_PERKARA.NAIK_PRAPENUNTUTAN
  ]
};

// --- HELPER FUNCTIONS ---

/**
 * Returns the list of valid statuses for a given Jenis Perkara
 * @param {string} jenis 
 * @returns {Array} List of allowed status strings
 */
export const getAllowedStatuses = (jenis) => {
  return STATUS_MAPPING[jenis] || [];
};

export const getYearOptions = (startYear = 2024) => {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + 1; // Allow 1 year ahead
  const years = [];
  
  // Generate descending (Newest first)
  for (let y = endYear; y >= startYear; y--) {
    years.push(y);
  }
  return years;
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export const getJenisColor = (jenis) => {
  switch (jenis) {
    case JENIS_PERKARA.LAPORAN_PENGADUAN:
      return 'bg-amber-500'; // Amber for Laporan
    case JENIS_PERKARA.PENYELIDIKAN:
      return 'bg-blue-500';  // Blue for Penyelidikan
    case JENIS_PERKARA.PENYIDIKAN:
      return 'bg-green-500'; // Green for Penyidikan
    case 'Penuntutan':
      return 'bg-purple-500'; // Purple for Penuntutan (Future proofing)
    case 'Eksekusi':
      return 'bg-slate-800';  // Dark for Eksekusi
    default:
      return 'bg-[#8b1f23]';  // Default Brand Red
  }
};

export const getStatusColor = (status) => {
  if (!status) return 'bg-slate-100 text-slate-700 border-slate-200';
  
  // Use the constants for comparison to ensure safety
  switch (status) {
    case STATUS_PERKARA.NAIK_PENYIDIKAN:
    case STATUS_PERKARA.NAIK_PENYELIDIKAN:
    case STATUS_PERKARA.NAIK_PRAPENUNTUTAN:
    case 'Selesai': // Keeping for legacy data compatibility
      return 'bg-green-100 text-green-700 border-green-200';

    case STATUS_PERKARA.DALAM_PROSES:
    case 'Proses':
      return 'bg-blue-100 text-blue-700 border-blue-200';

    case STATUS_PERKARA.DIHENTIKAN:
    case 'Ditangguhkan':
      return 'bg-red-100 text-red-700 border-red-200';

    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};