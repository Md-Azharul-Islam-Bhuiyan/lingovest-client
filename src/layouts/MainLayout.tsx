import Footer from '@/components/common/Footer';
import NewsTicker from '@/components/common/NewsTicker';
import Topbar from '@/components/common/Topbar';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
  return (
    <div className="overflow-hidden bg-animated-gradient min-h-screen">
      <NewsTicker />
      <Topbar />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
