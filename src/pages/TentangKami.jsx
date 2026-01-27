// FIX: Removed icon imports from lucide-react
import { } from 'lucide-react'; 

export default function TentangKami() {
  return (
    <div className="w-full animate-fade-in space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#8b1f23]/10 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gradient-to-br from-[#8b1f23] to-[#5c1416] p-1 rounded-full shadow-lg">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-2">
            <img 
              src="https://kejari-kotabaru.kejaksaan.go.id/wp-content/uploads/2025/11/logo-pidsus-945x1024-1.png" 
              alt="Logo PIDSUS" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="text-center md:text-left z-10">
          <h1 className="font-display text-4xl font-bold text-[#8b1f23] mb-2">
            Tentang Kami
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            TU Muda Madya - Bidang Tindak Pidana Khusus
          </p>
          <p className="text-slate-500 mt-2 font-display italic text-lg">
            "PIDSUS BISA, PASTI CERDAS"
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Kejaksaan Tinggi Sumatera Barat
          </p>
        </div>
      </div>

      {/* GRID SECTION: PROFIL & VISI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* PROFIL CARD */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full flex flex-col">
          {/* REMOVED ICON: Just the text now, colored in brand red */}
          <h2 className="font-display text-2xl font-bold text-[#8b1f23] mb-4">Profil</h2>
          
          <div className="prose prose-slate text-slate-600 leading-relaxed flex-1">
            <p>
              <strong className="text-[#8b1f23]">TU MUDA MADYA</strong> merupakan staf tata usaha yang bertugas pada Bidang Tindak Pidana Khusus.
            </p>
            <p className="mt-4">
              Kami berperan dalam mendukung kelancaran administrasi dan manajemen perkara, memastikan setiap proses berjalan akuntabel, transparan, dan sesuai dengan Standar Operasional Prosedur (SOP) yang berlaku di lingkungan Kejaksaan Tinggi Sumatera Barat.
            </p>
          </div>
        </div>

        {/* VISI CARD */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full flex flex-col">
          {/* REMOVED ICON */}
          <h2 className="font-display text-2xl font-bold text-[#8b1f23] mb-4">Visi</h2>
          
          <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-[#8b1f23] to-[#5c1416] text-white p-8 rounded-xl shadow-inner text-center">
            <p className="text-lg font-medium italic leading-relaxed">
              "Menjadi penyelenggara administrasi peradilan yang profesional, modern, dan terpercaya dalam mendukung penegakan hukum tindak pidana khusus yang berkualitas."
            </p>
          </div>
        </div>

      </div>

      {/* MISI SECTION */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 w-full">
        {/* REMOVED ICON */}
        <h2 className="font-display text-2xl font-bold text-[#8b1f23] mb-6">Misi</h2>
        
        <div className="grid grid-cols-1 gap-2">
          {[
            "Meningkatkan kualitas pelayanan administrasi perkara yang cepat, tepat, dan akurat.",
            "Mengembangkan sistem pengelolaan data berbasis teknologi informasi.",
            "Meningkatkan kompetensi sumber daya manusia dalam bidang administrasi kejaksaan.",
            "Mewujudkan tertib administrasi dalam penanganan perkara tindak pidana khusus.",
            "Mendukung terciptanya zona integritas menuju Wilayah Bebas dari Korupsi (WBK)."
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
              <div className="mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-xs group-hover:bg-[#8b1f23] group-hover:text-white transition-colors">
                {index + 1}
              </div>
              <p className="text-slate-700 leading-snug font-medium">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}