import React from 'react';

export default function TentangKami() {
  
  // Handle case where image fails to load
  const handleImageError = (e) => {
    e.target.style.display = 'none'; // Hide the broken image
    e.target.parentElement.classList.add('bg-[#8b1f23]', 'flex', 'items-center', 'justify-center');
    // Create a fallback text element
    const fallbackText = document.createElement('span');
    fallbackText.className = 'text-white font-bold text-xs';
    fallbackText.innerText = 'Logo Unavailable';
    e.target.parentElement.appendChild(fallbackText);
  };

  return (
    <div className="page-content animate-fade-in">
      
      {/* HEADER */}
      <header className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[#8b1f23]">Tentang Kami</h2>
        <p className="text-slate-600 mt-1">TU Muda Madya - Bidang Tindak Pidana Khusus Kejati Sumbar</p>
      </header>

      <div className="max-w-4xl space-y-6">
        
        {/* LOGO SECTION */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-100 text-center">
          <div className="w-48 h-48 mx-auto mb-6">
            <img 
              src="https://kejari-kotabaru.kejaksaan.go.id/wp-content/uploads/2025/11/logo-pidsus-945x1024-1.png" 
              alt="Logo PIDSUS" 
              loading="lazy" 
              className="w-full h-full object-contain" 
              onError={handleImageError}
            />
          </div>
          <div className="bg-gradient-to-r from-[#8b1f23] to-[#a62529] text-white py-3 px-6 rounded-lg inline-block shadow-md">
            <p className="font-display text-2xl font-bold tracking-wide">PIDSUS BISA, PASTI CERDAS</p>
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-display text-xl font-semibold text-[#8b1f23] mb-4 flex items-center gap-3">
            <span className="text-2xl">👥</span> Profil
          </h3>
          <p className="text-slate-700 leading-relaxed text-justify">
            Kami adalah <strong>TU MUDA MADYA</strong>, pegawai pelaksana pada Bidang Tindak Pidana Khusus (PIDSUS) Kejaksaan Tinggi Sumatera Barat. Kami hadir sebagai bagian penting dalam mendukung pelaksanaan tugas dan fungsi penegakan hukum, khususnya dalam penanganan tindak pidana khusus yang profesional, akuntabel, dan berintegritas.
          </p>
          <p className="text-slate-700 leading-relaxed text-justify mt-4">
            Sebagai garda pendukung di bidang PIDSUS, kami berkomitmen untuk terus berinovasi, meningkatkan kompetensi, serta memberikan kontribusi nyata demi terwujudnya penegakan keadilan yang berkualitas, terpercaya, dan berorientasi pada kepentingan masyarakat.
          </p>
          <p className="text-slate-700 leading-relaxed text-justify mt-4">
            Dalam menjalankan peran tersebut, TU Muda Madya tidak hanya berfokus pada pelaksanaan tugas administratif dan teknis, tetapi juga pada penguatan sistem kerja, kolaborasi, serta adaptasi terhadap perkembangan zaman dan teknologi.
          </p>
        </div>

        {/* VISION SECTION */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-100">
          <h3 className="font-display text-xl font-semibold text-[#8b1f23] mb-4 flex items-center gap-3">
            <span className="text-2xl">🎯</span> Visi Kami
          </h3>
          <p className="text-slate-700 leading-relaxed text-justify">
            Mewujudkan peningkatan kemakmuran dan profesionalisme pegawai Kejaksaan, khususnya pada jabatan pelaksana, serta membuka peluang pengembangan karier hingga menjadi jabatan struktural di masa depan.
          </p>
        </div>

        {/* MISSION SECTION */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="font-display text-xl font-semibold text-[#8b1f23] mb-4 flex items-center gap-3">
            <span className="text-2xl">🚀</span> Misi Kami
          </h3>
          <div className="space-y-4">
            
            <MissionItem number="1">
              Memberikan layanan dan pembantuan penegakan keadilan yang berkualitas tinggi, efektif, dan bertanggung jawab di lingkungan Bidang Tindak Pidana Khusus.
            </MissionItem>
            
            <MissionItem number="2">
              Meningkatkan kapasitas, kesejahteraan, dan profesionalisme pegawai pelaksana sebagai bagian integral dari sistem penegakan hukum.
            </MissionItem>
            
            <MissionItem number="3">
              Mendorong terciptanya tata kelola kerja yang transparan, akuntabel, dan berintegritas.
            </MissionItem>
            
            <MissionItem number="4">
              Terus berinovasi dan beradaptasi dengan perkembangan zaman, termasuk pemanfaatan teknologi dan sistem kerja modern.
            </MissionItem>
            
            <MissionItem number="5">
              Menjadi pendukung yang andal dalam mewujudkan penegakan hukum yang adil, humanis, dan berorientasi pada kepentingan publik.
            </MissionItem>

          </div>
        </div>

        {/* FOOTER QUOTE */}
        <div className="bg-gradient-to-r from-[#8b1f23] to-[#a62529] rounded-xl p-6 shadow-lg text-white text-center transform hover:scale-[1.01] transition duration-300">
          <p className="text-lg italic mb-2">
            "Bersama TU Muda Madya, kami berkomitmen untuk mendukung penegakan hukum yang profesional dan berintegritas"
          </p>
          <p className="text-sm text-slate-200 opacity-90">
            Bidang Tindak Pidana Khusus - Kejaksaan Tinggi Sumatera Barat
          </p>
        </div>

      </div>
    </div>
  );
}

// Helper Component for Mission Items to keep code clean
function MissionItem({ number, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-[#8b1f23] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-sm">
        {number}
      </div>
      <p className="text-slate-700 leading-relaxed text-justify">
        {children}
      </p>
    </div>
  );
}