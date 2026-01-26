import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      {/* Main Content Area: Pushes content to the right of the 64-width sidebar */}
      <main className="flex-1 ml-72 p-8 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}