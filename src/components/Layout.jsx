import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Topbar: Visible ONLY on Mobile */}
      <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar: Pass the state and close function here */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      {/* pt-20 pushes content down on mobile (for Topbar). md:ml-72 makes space for sidebar on desktop */}
      <main className="flex-1 p-4 md:p-8 pt-24 md:pt-8 md:ml-72 transition-all duration-300">
        {children}
      </main>
      
    </div>
  );
}