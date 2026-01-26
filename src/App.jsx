import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Beranda from './pages/Beranda';
import ArsipPerkara from './pages/ArsipPerkara';
import TentangKami from './pages/TentangKami';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/arsip" element={<ArsipPerkara />} />
          <Route path="/tentang" element={<TentangKami />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;